import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface User {
  username: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
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
      throw new Error("No se pudo iniciar sesión. Verifica tus credenciales.");
    }
  };

  const logout = async (): Promise<void> => {
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("username");
    setUser(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      const username = await SecureStore.getItemAsync("username");
      if (token && username) {
        setUser({ username, token });
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
