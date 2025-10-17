import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import {
  DataContextProps,
  Estadisticas,
  Movimiento,
  MovimientoServer,
} from "@/interfaces/interfaces";
import { AuthContext } from "./AuthContext";
import { getCurrentDateTimeInParaguay } from "@/utilities/dateTime";
import { toast } from "@/utilities/nativeToast";

type SyncAction = "CREATE" | "UPDATE_SALIDA";
let isSyncing = false;

type OpenMovimiento = Movimiento & {
  localId: string;
  id?: number;
};

type OutboxItem =
  | {
      id: string;
      action: "CREATE";
      localId: string;
      payload: Movimiento;
      timestamp: number;
      retries: number;
    }
  | {
      id: string;
      action: "UPDATE_SALIDA";
      localId: string;
      serverId?: number;
      payload: { fechaSalida: string; horaSalida: string };
      timestamp: number;
      retries: number;
    };

const STORAGE_KEYS = {
  OUTBOX: "outbox",
  OPEN: "openMovimientos",
  IDMAP: "idMap",
} as const;

const uuid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const DataContext = createContext<DataContextProps>({
  pendingData: [],
  saveFormData: async () => {},
  getSentData: async () => [],
  marcarSalida: async () => {},
  updateSentData: async () => {},
  getEstadisticas: async () => ({}) as Estadisticas,
  retryPendingData: async () => {},
});

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [openMovimientos, setOpenMovimientos] = useState<OpenMovimiento[]>([]);
  const [outbox, setOutbox] = useState<OutboxItem[]>([]);

  const { user } = useContext(AuthContext) ?? {};
  const token = user?.token;

  const api = axios.create({
    baseURL: "https://backend-afteraccess.vercel.app",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    timeout: 15000,
  });

  const isOnline = async () => {
    try {
      const s = await NetInfo.fetch();
      return !!s.isConnected;
    } catch {
      return false;
    }
  };

  const loadAll = async () => {
    const [o, q] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.OPEN),
      AsyncStorage.getItem(STORAGE_KEYS.OUTBOX),
    ]);
    setOpenMovimientos(o ? JSON.parse(o) : []);
    setOutbox(q ? JSON.parse(q) : []);
  };

  const persistOpen = async (data: OpenMovimiento[]) => {
    setOpenMovimientos(data);
    await AsyncStorage.setItem(STORAGE_KEYS.OPEN, JSON.stringify(data));
  };

  const persistOutbox = async (data: OutboxItem[]) => {
    setOutbox(data);
    await AsyncStorage.setItem(STORAGE_KEYS.OUTBOX, JSON.stringify(data));
  };

  const readIdMap = async (): Promise<Record<string, number>> => {
    const s = await AsyncStorage.getItem(STORAGE_KEYS.IDMAP);
    return s ? JSON.parse(s) : {};
  };
  const writeIdMap = async (map: Record<string, number>) => {
    await AsyncStorage.setItem(STORAGE_KEYS.IDMAP, JSON.stringify(map));
  };

  const tryProcessOutbox = async () => {
    if (isSyncing) return;
    isSyncing = true;
    try {
      if (!(await isOnline())) return;
      if (!token) return;

      let queue: OutboxItem[] = JSON.parse(
        (await AsyncStorage.getItem(STORAGE_KEYS.OUTBOX)) || "[]",
      );
      if (queue.length === 0) return;

      const idMap = await readIdMap();
      const newIdMap = { ...idMap };

      const creates = queue
        .filter((i) => i.action === "CREATE")
        .sort((a, b) => a.timestamp - b.timestamp);
      for (const item of creates) {
        try {
          const res = await api.post("/movimiento", item.payload);
          if (res?.status === 200 && res.data?.id) {
            const serverId = res.data.id as number;
            newIdMap[item.localId] = serverId;

            const open: OpenMovimiento[] = JSON.parse(
              (await AsyncStorage.getItem(STORAGE_KEYS.OPEN)) || "[]",
            );
            const updated = open.map((m) =>
              m.localId === item.localId ? { ...m, id: serverId } : m,
            );
            await persistOpen(updated);

            queue = queue.filter((q) => q.id !== item.id);
          } else {
            throw new Error("Respuesta inválida en CREATE");
          }
        } catch (e) {
          console.log("Fallo CREATE, se reintentará", e);
        }
      }
      await writeIdMap(newIdMap);

      const updates = queue
        .filter((i) => i.action === "UPDATE_SALIDA")
        .sort((a, b) => a.timestamp - b.timestamp);
      for (const item of updates) {
        const serverId =
          item.serverId || newIdMap[item.localId] || idMap[item.localId];
        if (!serverId) continue;

        try {
          const res = await api.put("/movimiento", {
            id: serverId,
            ...item.payload,
          });
          if (res?.status === 200) {
            queue = queue.filter((q) => q.id !== item.id);
          } else {
            throw new Error("Respuesta inválida en UPDATE_SALIDA");
          }
        } catch (e) {
          console.log("Fallo UPDATE_SALIDA, se reintentará", e);
        }
      }

      await persistOutbox(queue);
    } finally {
      isSyncing = false;
    }
  };

  useEffect(() => {
    (async () => {
      await loadAll();
      await tryProcessOutbox();
    })();

    const unsubNet = NetInfo.addEventListener(async (state) => {
      if (state.isConnected) {
        await tryProcessOutbox();
      }
    });
    const interval = setInterval(tryProcessOutbox, 60_000);

    return () => {
      unsubNet();
      clearInterval(interval);
    };
  }, [token]);

  const saveFormData = async (mov: Movimiento) => {
    const localId = uuid();

    const newOpen: OpenMovimiento = { ...mov, localId };
    await persistOpen([newOpen, ...openMovimientos]);

    if (await isOnline()) {
      try {
        const res = await api.post("/movimiento", mov);
        if (res?.status === 200 && res.data?.id) {
          const serverId = res.data.id as number;

          const idMap = await readIdMap();
          idMap[localId] = serverId;
          await writeIdMap(idMap);

          const open: OpenMovimiento[] = JSON.parse(
            (await AsyncStorage.getItem(STORAGE_KEYS.OPEN)) || "[]",
          );
          const merged = open.map((o) =>
            o.localId === localId ? { ...o, id: serverId } : o,
          );
          await persistOpen(merged);

          toast.success("Ingreso enviado");
          return;
        }
        throw new Error("Respuesta inválida");
      } catch {}
    }

    const item: OutboxItem = {
      id: uuid(),
      action: "CREATE",
      localId,
      payload: mov,
      timestamp: Date.now(),
      retries: 0,
    };
    await persistOutbox([item, ...outbox]);
    toast.warn("Sin conexión. Ingreso guardado localmente");
  };

  const marcarSalida = async (idOrLocalId: number | string): Promise<void> => {
    try {
      const { currentDate, currentTime } = getCurrentDateTimeInParaguay();

      const localId =
        typeof idOrLocalId === "string"
          ? idOrLocalId
          : (openMovimientos.find((m) => m.id === idOrLocalId)?.localId ??
            String(idOrLocalId));

      const remaining = openMovimientos.filter((m) => m.localId !== localId);
      await persistOpen(remaining);

      const idMap = await readIdMap();
      const serverId =
        typeof idOrLocalId === "number"
          ? idOrLocalId
          : openMovimientos.find((m) => m.localId === localId)?.id ||
            idMap[localId];

      if ((await isOnline()) && serverId) {
        try {
          const res = await api.put("/movimiento", {
            id: serverId,
            fechaSalida: currentDate,
            horaSalida: currentTime,
          });
          if (res?.status === 200) {
            toast.success("Salida enviada");
            return;
          }
        } catch {}
      }

      const item: OutboxItem = {
        id: uuid(),
        action: "UPDATE_SALIDA",
        localId,
        serverId: serverId || undefined,
        payload: { fechaSalida: currentDate, horaSalida: currentTime },
        timestamp: Date.now(),
        retries: 0,
      };
      await persistOutbox([item, ...outbox]);
      toast.warn("Sin conexión. Salida guardada para sincronizar");
    } catch (error) {
      console.error("Error al marcar salida:", error);
      toast.error("Error al marcar salida");
    }
  };

  const getSentData = async (): Promise<MovimientoServer[]> => {
    const open = await AsyncStorage.getItem(STORAGE_KEYS.OPEN);
    const list: OpenMovimiento[] = open ? JSON.parse(open) : [];
    return list
      .filter((m) => typeof m.id === "number")
      .map((m) => ({ ...m, id: m.id! }) as MovimientoServer);
  };

  const retryPendingData = async () => {
    await tryProcessOutbox();
  };

  const updateSentData = async () => {
    await getSentData();
  };

  const getEstadisticas = async (option: "mensuales" | "hoy") => {
    try {
      const res = await api.get(`/estadisticas-${option}`).then((r) => r.data);
      return res as Estadisticas;
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      toast.error("Error al obtener estadísticas");
    }
  };

  return (
    <DataContext.Provider
      value={{
        pendingData: openMovimientos as unknown as any[],
        saveFormData,
        getSentData,
        marcarSalida,
        updateSentData,
        getEstadisticas,
        retryPendingData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
