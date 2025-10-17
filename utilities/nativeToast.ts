import { Platform, ToastAndroid } from "react-native";

const show = async (msg: string, type: "success" | "warning" | "danger") => {
  if (Platform.OS === "android") {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
    return;
  }

  const { Toast } = await import("toastify-react-native");
  if (type === "success") Toast.success(msg);
  else if (type === "warning") Toast.warn(msg);
  else Toast.error(msg);
};

export const toast = {
  success: (m: string) => show(m, "success"),
  warn: (m: string) => show(m, "warning"),
  error: (m: string) => show(m, "danger"),
};
