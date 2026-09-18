import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import { useToast } from "react-native-toast-notifications";
import {
  ConnectionStatus,
  DataContextProps,
  Estadisticas,
  Movimiento,
  MovimientoServer,
  PendingMovimiento,
  PendingSalida,
} from "@/interfaces/interfaces";
import { AuthContext } from "./AuthContext";
import { getCurrentDateTimeInParaguay } from "@/utilities/dateTime";
import { API_BASE_URL } from "@/config/api";

const REQUEST_TIMEOUT = 8000;
const PENDING_MOVIMIENTOS_KEY = "movimientosPendientes";
const SENT_MOVIMIENTOS_KEY = "movimientosEnviados";
const PENDING_SALIDAS_KEY = "salidasPendientes";

const isNetworkError = (error: unknown) => {
  if (!axios.isAxiosError(error)) return false;

  return (
    !error.response ||
    error.code === "ERR_NETWORK" ||
    error.code === "ECONNABORTED" ||
    error.code === "ETIMEDOUT"
  );
};

const createLocalId = () =>
  `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createLocalNumericId = (localId: string) => {
  let hash = 0;

  for (let index = 0; index < localId.length; index += 1) {
    hash = (hash * 31 + localId.charCodeAt(index)) | 0;
  }

  return -(Math.abs(hash) || 1);
};

const normalizePendingMovimiento = (
  data: unknown
): PendingMovimiento[] => {
  if (!Array.isArray(data)) return [];

  return data.map((item, index) => {
    const movimiento = item as Partial<PendingMovimiento>;

    return {
      ...movimiento,
      localId:
        typeof movimiento.localId === "string"
          ? movimiento.localId
          : `legacy-${index}-${Date.now()}`,
    } as PendingMovimiento;
  });
};

const readStorageArray = async <T,>(key: string): Promise<T[]> => {
  try {
    const storedData = await AsyncStorage.getItem(key);
    if (!storedData) return [];

    const parsedData: unknown = JSON.parse(storedData);
    return Array.isArray(parsedData) ? (parsedData as T[]) : [];
  } catch (error) {
    console.error(`Error al leer ${key}:`, error);
    return [];
  }
};

const writeStorageArray = async <T,>(key: string, data: T[]) => {
  await AsyncStorage.setItem(key, JSON.stringify(data));
};

const toApiMovimiento = (movimiento: PendingMovimiento): Movimiento => {
  const { localId: _localId, serverId: _serverId, ...data } = movimiento;
  return data;
};

const toApiSalida = ({ id, fechaSalida, horaSalida }: PendingSalida) => ({
  id,
  fechaSalida,
  horaSalida,
});

export const DataContext = createContext<DataContextProps>({
  connectionStatus: "checking",
  pendingData: [],
  pendingExits: [],
  refreshConnection: async () => false,
  saveFormData: async () => {},
  getSentData: async () => [],
  marcarSalida: async () => {},
  updateSentData: async () => {},
  getEstadisticas: async () => ({} as Estadisticas),
  retryPendingData: async () => {},
});

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("checking");
  const [pendingData, setPendingData] = useState<PendingMovimiento[]>([]);
  const [pendingExits, setPendingExits] = useState<PendingSalida[]>([]);
  const syncInProgress = useRef(false);
  const toast = useToast();
  const { user } = useContext(AuthContext) ?? {};
  const token = user?.token;

  const markRequestSuccess = useCallback(() => {
    setConnectionStatus("connected");
  }, []);

  const markRequestFailure = useCallback(async () => {
    const state = await NetInfo.fetch();
    const deviceHasNetwork =
      state.isConnected === true && state.isInternetReachable !== false;
    setConnectionStatus(
      deviceHasNetwork ? "server-unavailable" : "offline"
    );
  }, []);

  const checkConnection = useCallback(async () => {
    setConnectionStatus("checking");
    const state = await NetInfo.fetch();
    const deviceHasNetwork =
      state.isConnected === true && state.isInternetReachable !== false;

    try {
      await axios.get(`${API_BASE_URL}/health`, {
        timeout: 5000,
      });
      markRequestSuccess();
      return true;
    } catch {
      setConnectionStatus(
        deviceHasNetwork ? "server-unavailable" : "offline"
      );
      return false;
    }
  }, [markRequestSuccess]);

  const persistPendingData = useCallback(async (data: PendingMovimiento[]) => {
    await writeStorageArray(PENDING_MOVIMIENTOS_KEY, data);
    setPendingData(data);
  }, []);

  const enqueuePendingData = useCallback(
    async (movimiento: Movimiento) => {
      const currentData = normalizePendingMovimiento(
        await readStorageArray<PendingMovimiento>(PENDING_MOVIMIENTOS_KEY)
      );
      const updatedData = [
        ...currentData,
        { ...movimiento, localId: createLocalId() },
      ];

      await persistPendingData(updatedData);
      toast.show("Sin conexión. El ingreso quedó guardado para sincronizar.", {
        type: "warning",
        placement: "top",
      });
    },
    [persistPendingData, toast]
  );

  const syncPendingData = useCallback(async () => {
    if (!token || syncInProgress.current) return;

    const storedPending = normalizePendingMovimiento(
      await readStorageArray<PendingMovimiento>(PENDING_MOVIMIENTOS_KEY)
    );
    const storedExits = await readStorageArray<PendingSalida>(
      PENDING_SALIDAS_KEY
    );

    if (storedPending.length === 0 && storedExits.length === 0) return;

    syncInProgress.current = true;
    const remainingPending: PendingMovimiento[] = [];
    const sentData: MovimientoServer[] = [];
    let syncedCount = 0;
    let syncHadNetworkFailure = false;

    try {
      let pending = storedPending;

      for (let index = 0; index < pending.length; index += 1) {
        let movimiento = pending[index];

        try {
          if (!movimiento.serverId) {
            const response = await axios.post(
              `${API_BASE_URL}/movimiento`,
              toApiMovimiento(movimiento),
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                timeout: REQUEST_TIMEOUT,
              }
            );

            if (response.status !== 200 || !response.data.id) {
              throw new Error("El servidor no devolvió el ID del movimiento.");
            }

            movimiento = {
              ...movimiento,
              serverId: Number(response.data.id),
            };
            pending = pending.map((item) =>
              item.localId === movimiento.localId ? movimiento : item
            );
            await writeStorageArray(PENDING_MOVIMIENTOS_KEY, pending);
          }

          if (movimiento.fechaSalida && movimiento.horaSalida) {
            await axios.put(
              `${API_BASE_URL}/movimiento`,
              {
                id: movimiento.serverId,
                fechaSalida: movimiento.fechaSalida,
                horaSalida: movimiento.horaSalida,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                timeout: REQUEST_TIMEOUT,
              }
            );
          } else {
            sentData.push({
              ...toApiMovimiento(movimiento),
              id: movimiento.serverId!,
            });
          }

          syncedCount += 1;
        } catch (error) {
          remainingPending.push(movimiento);

          if (isNetworkError(error)) {
            syncHadNetworkFailure = true;
            console.info("Sin conexión para sincronizar movimientos pendientes.");
            await markRequestFailure();
            remainingPending.push(...pending.slice(index + 1));
            break;
          }

          console.error("Error al sincronizar movimiento:", error);
        }
      }

      await writeStorageArray(PENDING_MOVIMIENTOS_KEY, remainingPending);

      if (sentData.length > 0) {
        const previousSentData = await readStorageArray<MovimientoServer>(
          SENT_MOVIMIENTOS_KEY
        );
        const sentById = new Map(
          previousSentData.map((movimiento) => [movimiento.id, movimiento])
        );
        sentData.forEach((movimiento) => sentById.set(movimiento.id, movimiento));
        await writeStorageArray(
          SENT_MOVIMIENTOS_KEY,
          Array.from(sentById.values())
        );
      }

      const remainingExits: PendingSalida[] = [];

      for (let index = 0; index < storedExits.length; index += 1) {
        const salida = storedExits[index];

        try {
          await axios.put(
            `${API_BASE_URL}/movimiento`,
            toApiSalida(salida),
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              timeout: REQUEST_TIMEOUT,
            }
          );
          syncedCount += 1;
        } catch (error) {
          remainingExits.push(salida);

          if (isNetworkError(error)) {
            syncHadNetworkFailure = true;
            console.info("Sin conexión para sincronizar salidas pendientes.");
            await markRequestFailure();
            remainingExits.push(...storedExits.slice(index + 1));
            break;
          }

          console.error("Error al sincronizar salida:", error);
        }
      }

      await writeStorageArray(PENDING_SALIDAS_KEY, remainingExits);
      setPendingData(remainingPending);
      setPendingExits(remainingExits);

      if (syncedCount > 0 && !syncHadNetworkFailure) {
        markRequestSuccess();
      }

      if (
        syncedCount > 0 &&
        remainingPending.length === 0 &&
        remainingExits.length === 0
      ) {
        toast.show(
          `${syncedCount} operación${syncedCount === 1 ? "" : "es"} sincronizada${syncedCount === 1 ? "" : "s"}.`,
          {
            type: "success",
            placement: "top",
          }
        );
      }
    } finally {
      syncInProgress.current = false;
    }
  }, [markRequestFailure, markRequestSuccess, toast, token]);

  const saveFormData = useCallback(
    async (movimiento: Movimiento) => {
      if (
        connectionStatus === "offline" ||
        connectionStatus === "server-unavailable"
      ) {
        await enqueuePendingData(movimiento);
        return;
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/movimiento`,
          movimiento,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: REQUEST_TIMEOUT,
          }
        );

        markRequestSuccess();
        const movimientoConID: MovimientoServer = {
          ...movimiento,
          id: response.data.id,
        };

        toast.show("Ingreso exitoso", {
          type: "success",
          placement: "top",
        });

        const storedData = await readStorageArray<MovimientoServer>(
          SENT_MOVIMIENTOS_KEY
        );
        await writeStorageArray(SENT_MOVIMIENTOS_KEY, [
          ...storedData,
          movimientoConID,
        ]);
      } catch (error) {
        if (isNetworkError(error)) {
          console.info("Sin conexión. El ingreso se guardará localmente.");
          await markRequestFailure();
          await enqueuePendingData(movimiento);
          return;
        }

        console.error("Error al guardar movimiento:", error);
        toast.show(
          "No se pudo guardar el ingreso. Revisá los datos e intentá de nuevo.",
          {
            type: "danger",
            placement: "top",
          }
        );
        throw error;
      }
    },
    [connectionStatus, enqueuePendingData, markRequestFailure, markRequestSuccess, toast, token]
  );

  const getSentData = useCallback(async (): Promise<MovimientoServer[]> => {
    const storedData = await readStorageArray<MovimientoServer>(
      SENT_MOVIMIENTOS_KEY
    );
    const pendingMovimientos = normalizePendingMovimiento(
      await readStorageArray<PendingMovimiento>(PENDING_MOVIMIENTOS_KEY)
    );

    return [
      ...storedData.filter(
        (movimiento) => !movimiento.fechaSalida && !movimiento.horaSalida
      ),
      ...pendingMovimientos
        .filter((movimiento) => !movimiento.fechaSalida && !movimiento.horaSalida)
        .map((movimiento) => ({
          ...toApiMovimiento(movimiento),
          id: createLocalNumericId(movimiento.localId),
          localId: movimiento.localId,
          isPending: true,
        })),
    ];
  }, []);

  const queuePendingExit = useCallback(
    async (salida: PendingSalida) => {
      const pendingExits = await readStorageArray<PendingSalida>(
        PENDING_SALIDAS_KEY
      );
      const updatedExits = [
        ...pendingExits.filter((item) => item.id !== salida.id),
        salida,
      ];
      const sentData = await readStorageArray<MovimientoServer>(
        SENT_MOVIMIENTOS_KEY
      );

      await writeStorageArray(PENDING_SALIDAS_KEY, updatedExits);
      await writeStorageArray(
        SENT_MOVIMIENTOS_KEY,
        sentData.filter((movimiento) => movimiento.id !== salida.id)
      );
      setPendingExits(updatedExits);
      toast.show("La salida quedó guardada para sincronizar.", {
        type: "warning",
        placement: "top",
      });
    },
    [toast]
  );

  const marcarSalida = useCallback(
    async (id: number, localId?: string): Promise<void> => {
      const { currentDate, currentTime } = getCurrentDateTimeInParaguay();

      if (localId) {
        const pendingMovimientos = normalizePendingMovimiento(
          await readStorageArray<PendingMovimiento>(PENDING_MOVIMIENTOS_KEY)
        );
        const localMovimiento = pendingMovimientos.find(
          (movimiento) => movimiento.localId === localId
        );

        if (localMovimiento) {
          const updatedMovimientos = pendingMovimientos.map((movimiento) =>
            movimiento.localId === localId
              ? {
                  ...movimiento,
                  fechaSalida: currentDate,
                  horaSalida: currentTime,
                }
              : movimiento
          );

          await persistPendingData(updatedMovimientos);
          toast.show("Salida guardada. Se sincronizará al volver la conexión.", {
            type: "warning",
            placement: "top",
          });
          return;
        }
      }

      const salida: PendingSalida = {
        id,
        fechaSalida: currentDate,
        horaSalida: currentTime,
      };

      const storedSentData = await readStorageArray<MovimientoServer>(
        SENT_MOVIMIENTOS_KEY
      );
      const pendingSalida: PendingSalida = {
        ...salida,
        movimiento: storedSentData.find((movimiento) => movimiento.id === id),
      };

      if (
        connectionStatus === "offline" ||
        connectionStatus === "server-unavailable"
      ) {
        await queuePendingExit(pendingSalida);
        return;
      }

      try {
        const response = await axios.put(
          `${API_BASE_URL}/movimiento`,
          salida,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: REQUEST_TIMEOUT,
          }
        );

        if (response.status !== 200) {
          throw new Error("Error en la respuesta del servidor");
        }

        markRequestSuccess();
        toast.show("Salida exitosa", {
          type: "success",
          placement: "top",
        });

        const storedData = await readStorageArray<MovimientoServer>(
          SENT_MOVIMIENTOS_KEY
        );
        await writeStorageArray(
          SENT_MOVIMIENTOS_KEY,
          storedData.filter((movimiento) => movimiento.id !== id)
        );
      } catch (error) {
        if (isNetworkError(error)) {
          console.info("Sin conexión para marcar la salida.");
          await markRequestFailure();
          await queuePendingExit(pendingSalida);
          return;
        }

        console.error("Error al marcar salida:", error);
        toast.show("Error al marcar salida.", {
          type: "danger",
          placement: "top",
        });
        throw error;
      }
    },
    [
      connectionStatus,
      markRequestFailure,
      markRequestSuccess,
      persistPendingData,
      queuePendingExit,
      toast,
      token,
    ]
  );

  const retryPendingData = useCallback(async () => {
    const apiAvailable = await checkConnection();

    if (apiAvailable) {
      await syncPendingData();
    }
  }, [checkConnection, syncPendingData]);

  const updateSentData = useCallback(async () => {
    await getSentData();
  }, [getSentData]);

  const getEstadisticas = useCallback(
    async (option: "mensuales" | "hoy") => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/estadisticas-${option}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: REQUEST_TIMEOUT,
          }
        );

        markRequestSuccess();
        return response.data;
      } catch (error) {
        if (isNetworkError(error)) {
          console.info("Sin conexión para obtener estadísticas.");
          await markRequestFailure();
        } else {
          console.error("Error al obtener estadísticas:", error);
        }

        toast.show("Error al obtener estadísticas.", {
          type: "danger",
          placement: "top",
        });
        throw error;
      }
    },
    [markRequestFailure, markRequestSuccess, toast, token]
  );

  const refreshConnection = useCallback(async () => {
    const apiAvailable = await checkConnection();

    if (apiAvailable) {
      await syncPendingData();
    }

    return apiAvailable;
  }, [checkConnection, syncPendingData]);

  useEffect(() => {
    const loadPendingData = async () => {
      const storedPending = normalizePendingMovimiento(
        await readStorageArray<PendingMovimiento>(PENDING_MOVIMIENTOS_KEY)
      );
      const storedExits = await readStorageArray<PendingSalida>(
        PENDING_SALIDAS_KEY
      );
      await writeStorageArray(PENDING_MOVIMIENTOS_KEY, storedPending);
      setPendingData(storedPending);
      setPendingExits(storedExits);
    };

    void loadPendingData();
  }, []);

  useEffect(() => {
    void refreshConnection();

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected === null) {
        setConnectionStatus("checking");
      }
      void refreshConnection();
    });

    const interval = setInterval(() => {
      void refreshConnection();
    }, 10000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [refreshConnection]);

  return (
    <DataContext.Provider
      value={{
        connectionStatus,
        pendingData,
        pendingExits,
        refreshConnection,
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
