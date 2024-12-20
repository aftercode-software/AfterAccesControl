export interface Movimiento {
  id: number;
  chapa: string;
  nombre: string;
  fechaIngreso: string;
  horaIngreso: string;
  cedula: string;
  marca: string;
  vehiculo: "transganado" | "camion" | "camioneta";
  destino: string;
  pago: "efectivo" | "boleta" | "falta pagar";
  boleta?: string;
  monto?: number;
  observaciones?: string;
  fechaSalida?: string;
  horaSalida?: string;
}
