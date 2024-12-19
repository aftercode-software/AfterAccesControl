import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import * as SecureStore from "expo-secure-store";

interface User {
  username: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const tokenFijo = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzM0NjQ4Mjk2fQ.WekA71rmsSoS9SBJjyMm6h4iBqYZn5pFL54hnJoC6r0";

  const login = async (username: string): Promise<void> => {
    try {
      // Guardamos token y usuario en almacenamiento seguro
      await SecureStore.setItemAsync("userToken", tokenFijo);
      await SecureStore.setItemAsync("username", username);
      setUser({ username, token: tokenFijo });
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      throw new Error("No se pudo iniciar sesión. Verifica tus credenciales.");
    }
  };

  const logout = async (): Promise<void> => {
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("username");
    setUser(null);
  };

  // Cargar usuario y token desde almacenamiento seguro al iniciar la app
  useEffect(() => {
    const loadUser = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      const username = await SecureStore.getItemAsync("username");

      // Si el token no existe, usamos el token fijo para desarrollo
      if (!token || !username) {
        setUser({ username: "UsuarioFijo", token: tokenFijo });
      } else {
        setUser({ username, token });
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
