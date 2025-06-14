import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useToast } from "react-native-toast-notifications";
import { User } from "@/interfaces/interfaces";
import { AuthContextType } from "@/interfaces/interfaces";

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await axios.post(
        "https://backend-afteraccess.vercel.app/login",
        { username, password }
      );

      const { token } = response.data;

      await SecureStore.setItemAsync("userToken", token);
      await SecureStore.setItemAsync("username", username);
      setUser({ username, token });
      return true;
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error("Usuario o contraseña incorrectos");
    }
  };

  const logout = async (): Promise<void> => {
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("username");
    setUser(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const username = await SecureStore.getItemAsync("username");
        if (token && username) {
          setUser({ username, token });
        }
      } catch (error) {
        toast.show("Error al cargar usuario", { type: "danger" });
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
