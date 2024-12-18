import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Definimos el tipo de usuario
interface User {
  username: string;
  token: string;
}

// Definimos el tipo del contexto
interface AuthContextType {
  user: User | null;
  login: ( username: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  
}

// Creamos el contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Componente proveedor
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Función para iniciar sesión
  const login = async ( username: string): Promise<void> => {
    try {
      const response = await axios.post("https://backend-afteraccess.vercel.app/login", { username });
      const token = response.data.token;
      await SecureStore.setItemAsync("userToken", token);
      setUser({ username, token });
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error("No se pudo iniciar sesión. Verifica tus credenciales.");
    }
  };

  // Función para cerrar sesión
  const logout = async (): Promise<void> => {
    await SecureStore.deleteItemAsync("userToken");
    setUser(null);
  };

  // Recuperar el usuario al cargar la app
  useEffect(() => {
    const loadUser = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        setUser({ username: "casucha3", token }); // Ajusta según tu lógica de recuperación
      }
    };
    loadUser();
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
