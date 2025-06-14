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
import { useToast } from "react-native-toast-notifications";
import {
  DataContextProps,
  Estadisticas,
  Movimiento,
  MovimientoServer,
} from "@/interfaces/interfaces";
import { AuthContext } from "./AuthContext";
import { getCurrentDateTimeInParaguay } from "@/utilities/dateTime";

export const DataContext = createContext<DataContextProps>({
  pendingData: [],
  saveFormData: async () => {},
  getSentData: async () => [],
  marcarSalida: async () => {},
  updateSentData: async () => {},
  getEstadisticas: async () => ({} as Estadisticas),
  retryPendingData: async () => {},
});

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [pendingData, setPendingData] = useState<Movimiento[]>([]);
  const toast = useToast();
  const { user } = useContext(AuthContext) ?? {};
  const token = user?.token;

  useEffect(() => {
    const syncData = async () => {
      const isConnected = await NetInfo.fetch().then(
        (state) => state.isConnected
      );
      if (isConnected) {
        await sendPendingData();
      }
    };

    const loadPendingData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("movimientosPendientes");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setPendingData(parsedData);
        } else {
          setPendingData([]);
        }
      } catch (error) {
        console.error(
          "Error al cargar datos pendientes desde AsyncStorage:",
          error
        );
      }
    };
    const startSyncTimer = () => {
      const interval = setInterval(syncData, 60000); // Cada 60 segundos
      return () => clearInterval(interval);
    };

    loadPendingData();
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        syncData();
      }
    });

    const stopSyncTimer = startSyncTimer();

    return () => {
      unsubscribe();
      stopSyncTimer();
    };
  }, []);

  const saveFormData = async (movimiento: Movimiento) => {
    try {
      const isConnected = await NetInfo.fetch().then(
        (state) => state.isConnected
      );

      if (isConnected) {
        const response = await axios.post(
          "https://backend-afteraccess.vercel.app/movimiento",
          movimiento,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const movimientoConID: MovimientoServer = {
          ...movimiento,
          id: response.data.id,
        };

        toast.show("Ingreso exitoso", {
          type: "success",
          placement: "top",
        });

        const storedData = await AsyncStorage.getItem("movimientosEnviados");
        const updatedData = storedData
          ? [...JSON.parse(storedData), movimientoConID]
          : [movimientoConID];

        await AsyncStorage.setItem(
          "movimientosEnviados",
          JSON.stringify(updatedData)
        );
      } else {
        toast.show("Sin conexión. Guardando localmente.", {
          type: "warning",
          placement: "top",
        });

        const updatedData = [...pendingData, movimiento];

        await AsyncStorage.setItem(
          "movimientosPendientes",
          JSON.stringify(updatedData)
        );
        setPendingData(updatedData);
      }
    } catch (error) {
      console.error("Error al guardar movimiento:", error);
      toast.show("Error al guardar movimiento.", {
        type: "danger",
        placement: "top",
      });
    }
  };

  const sendPendingData = async () => {
    if (pendingData.length === 0) return;

    const failedData: Movimiento[] = [];
    const sentData: MovimientoServer[] = [];

    for (const data of pendingData) {
      try {
        const response = await axios.post(
          "https://backend-afteraccess.vercel.app/movimiento",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 && response.data.id) {
          const movimientoEnviado: MovimientoServer = {
            ...data,
            id: response.data.id,
          };
          sentData.push(movimientoEnviado);
        }
      } catch (error) {
        console.error(
          "Error al sincronizar movimiento en segundo plano:",
          error
        );
        failedData.push(data);
      }
    }

    await AsyncStorage.setItem(
      "movimientosPendientes",
      JSON.stringify(failedData)
    );

    const prevSentData = await AsyncStorage.getItem("movimientosEnviados");
    const updatedSentData = prevSentData
      ? [...JSON.parse(prevSentData), ...sentData]
      : sentData;

    await AsyncStorage.setItem(
      "movimientosEnviados",
      JSON.stringify(updatedSentData)
    );

    setPendingData(failedData);
  };

  const getSentData = async (): Promise<MovimientoServer[]> => {
    const storedData = await AsyncStorage.getItem("movimientosEnviados");
    return storedData ? JSON.parse(storedData) : [];
  };

  const marcarSalida = async (id: number): Promise<void> => {
    try {
      const { currentDate, currentTime } = getCurrentDateTimeInParaguay();

      const movimientoSalida = {
        id,
        horaSalida: currentTime,
        fechaSalida: currentDate,
      };

      const isConnected = await NetInfo.fetch().then(
        (state) => state.isConnected
      );

      if (isConnected) {
        const response = await axios.put(
          "https://backend-afteraccess.vercel.app/movimiento",
          movimientoSalida,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          toast.show("Salida exitosa", {
            type: "success",
            placement: "top",
          });

          const storedData = await AsyncStorage.getItem("movimientosEnviados");
          if (storedData) {
            const movimientos = JSON.parse(storedData) as MovimientoServer[];
            const updatedMovimientos = movimientos.filter(
              (mov) => mov.id !== id
            );
            await AsyncStorage.setItem(
              "movimientosEnviados",
              JSON.stringify(updatedMovimientos)
            );
          }
        } else {
          throw new Error("Error en la respuesta del servidor");
        }
      } else {
        toast.show("Sin conexión. No se pudo marcar la salida.", {
          type: "warning",
          placement: "top",
        });
        throw new Error("Sin conexión");
      }
    } catch (error) {
      console.error("Error al marcar salida:", error);
      toast.show("Error al marcar salida.", {
        type: "danger",
        placement: "top",
      });
    }
  };

  const retryPendingData = async () => {
    await sendPendingData();
  };

  const updateSentData = async () => {
    await getSentData();
  };

  const getEstadisticas = async (option: "mensuales" | "hoy") => {
    try {
      const response = await axios
        .get(`https://backend-afteraccess.vercel.app/estadisticas-${option}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data);

      return response;
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      toast.show("Error al obtener estadísticas.", {
        type: "danger",
        placement: "top",
      });
    }
  };

  return (
    <DataContext.Provider
      value={{
        pendingData,
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
