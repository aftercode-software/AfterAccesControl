import axios from "axios";

export function getAxiosErrorMessage(err: unknown) {
  if (axios.isAxiosError(err)) {
    return (
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Error de autenticación"
    );
  }
  return (err as Error)?.message || "Ocurrió un error inesperado";
}
