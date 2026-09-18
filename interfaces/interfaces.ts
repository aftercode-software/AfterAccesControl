export interface DataContextProps {
  connectionStatus: ConnectionStatus;
  pendingData: PendingMovimiento[];
  pendingExits: PendingSalida[];
  refreshConnection: () => Promise<boolean>;
  saveFormData: (data: Movimiento) => Promise<void>;
  getSentData: () => Promise<MovimientoServer[]>;
  marcarSalida: (id: number, localId?: string) => Promise<void>;
  updateSentData: () => Promise<void>;
  getEstadisticas: (opcion: "mensuales" | "hoy") => Promise<Estadisticas>;
  retryPendingData: () => Promise<void>;
}

export type ConnectionStatus =
  | "checking"
  | "connected"
  | "offline"
  | "server-unavailable";

export interface PendingMovimiento extends Movimiento {
  localId: string;
  serverId?: number;
}

export interface PendingSalida {
  id: number;
  fechaSalida: string;
  horaSalida: string;
  movimiento?: MovimientoServer;
}

export interface Movimiento {
  chapa: string;
  nombre: string;
  fechaIngreso: string;
  horaIngreso: string;
  cedula: string;
  marca: string;
  vehiculo: "" | "transganado" | "camion" | "camioneta";
  destino: string;
  pago: "" | "efectivo" | "boleta" | "falta pagar";
  boleta?: string;
  monto?: number | "";
  observaciones?: string;
  fechaSalida?: string;
  horaSalida?: string;
}

export interface MovimientoServer extends Movimiento {
  id: number;
  localId?: string;
  isPending?: boolean;
}

export interface Estadisticas {
  cantidadIngresos: number;
  cantidadSalidas: number;
  cantidadEfectivo: number;
  cantidadBoletas: number;
}

export interface User {
  username: string;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}
