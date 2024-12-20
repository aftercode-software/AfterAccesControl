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
import { Movimiento, MovimientoServer } from "@/interfaces/interfaces";
import { AuthContext } from "./AuthContext";

interface DataContextProps {
  saveFormData: (data: Movimiento) => Promise<void>;
  getSentData: () => Promise<MovimientoServer[]>;
}

export const DataContext = createContext<DataContextProps>({
  saveFormData: async () => {},
  getSentData: async () => [],
});

export const useData = (): DataContextProps => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

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
      const storedData = await AsyncStorage.getItem("movimientosPendientes");
      if (storedData) {
        setPendingData(JSON.parse(storedData));
        syncData();
      }
    };

    const startSyncTimer = () => {
      const interval = setInterval(syncData, 5 * 60 * 1000); // Cada 5 minutos
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
    console.log("Saving form data:", movimiento);
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
        console.log("Response:", response.data);

        const movimientoConID: MovimientoServer = {
          ...movimiento,
          id: response.data.id,
        };

        toast.show("Datos enviados correctamente", {
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
      console.error("Error al enviar datos:", error);
      toast.show("Error al enviar datos.", {
        type: "danger",
        placement: "top",
      });
      throw new Error("Error al enviar datos.");
    }
  };

  const sendPendingData = async () => {
    if (pendingData.length === 0) return;

    const failedData: Movimiento[] = [];
    const sentData: Movimiento[] = [];

    for (const data of pendingData) {
      try {
        const response = await axios.post(
          "https://backend-afteraccess.vercel.app/movimiento",
          data,
          {
            headers: {
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
          toast.show(`Movimiento sincronizado: ID ${response.data.id}`, {
            type: "success",
            placement: "top",
          });
        }
      } catch (error) {
        console.error("Error al sincronizar datos:", error);
        failedData.push(data);
        toast.show("Error al sincronizar un movimiento.", {
          type: "danger",
        });
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

  return (
    <DataContext.Provider value={{ saveFormData, getSentData }}>
      {children}
    </DataContext.Provider>
  );
};
