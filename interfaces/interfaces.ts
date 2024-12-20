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
  monto?: number;
  observaciones?: string;
  fechaSalida?: string;
  horaSalida?: string;
}

export interface MovimientoServer extends Movimiento {
  id: number;
}
