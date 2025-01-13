export interface DataContextProps {
  pendingData: Movimiento[];
  saveFormData: (data: Movimiento) => Promise<void>;
  getSentData: () => Promise<MovimientoServer[]>;
  marcarSalida: (id: number) => Promise<void>;
  updateSentData: () => Promise<void>;
  getEstadisticas: (opcion: "mensuales" | "hoy") => Promise<Estadisticas>;
  retryPendingData: () => Promise<void>;
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
}

export interface Estadisticas {
  cantidadIngresos: number;
  cantidadSalidas: number;
  cantidadEfectivo: number;
  cantidadBoletas: number;
}
