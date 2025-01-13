import { DataContext } from "@/context/DataContext";
import { DataContextProps } from "@/interfaces/interfaces";
import { useContext } from "react";

export const useData = (): DataContextProps => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
