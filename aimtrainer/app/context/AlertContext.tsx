"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export const AlertTypes = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
} as const;

type AlertType = (typeof AlertTypes)[keyof typeof AlertTypes];

interface AlertContextType {
  type: AlertType | null;
  message: string | null;
  show: (alertType: AlertType, message: string) => void;
  clear: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertType, setAlertType] = useState<AlertType | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);


  const show = (alertType: AlertType, message: string) => {
    setAlertType(alertType);
    setAlertMessage(message);
  };

  const clear = () => {
    setAlertType(null);
    setAlertMessage(null);
  };

  return (
    <AlertContext.Provider value={{ type: alertType, message: alertMessage, show, clear }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};