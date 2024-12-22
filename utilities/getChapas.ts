import { Movimiento } from "@/interfaces/interfaces";
import axios from "axios";

export const getAllChapas = async (
  token: string
): Promise<Movimiento[] | null> => {
  try {
    if (!token) {
      throw new Error("Token no proporcionado.");
    }

    const response = await axios.get<Movimiento[]>(
      "https://backend-afteraccess.vercel.app/buscar-chapa/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        `Error del servidor: ${response.status} ${response.statusText}`
      );
    }

    return response.data;
  } catch (error: any) {
    console.error("Error al obtener chapas:", error.message || error);
    throw new Error(
      error.response?.data?.message ||
        "Error al obtener datos de chapas. Intenta de nuevo."
    );
  }
};
