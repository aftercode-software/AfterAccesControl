const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

if (!configuredApiUrl) {
  throw new Error(
    "Falta configurar EXPO_PUBLIC_API_URL en el archivo .env del frontend."
  );
}

const apiUrlWithProtocol = /^https?:\/\//i.test(configuredApiUrl)
  ? configuredApiUrl
  : `http://${configuredApiUrl}`;

export const API_BASE_URL = apiUrlWithProtocol.replace(/\/+$/, "");
