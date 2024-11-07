"use client";
import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "white",
          color: "black",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "0.5rem",
          padding: "1rem",
        },
        success: {
          iconTheme: {
            primary: "#10B981",
            secondary: "white",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "white",
          },
        },
      }}
    />
  );
};

export default ToastProvider;
