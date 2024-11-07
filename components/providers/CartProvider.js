"use client";
import { useEffect, useState } from "react";
import useCartStore from "@/store/cartStore";

export default function CartProvider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Rehydrate cart from localStorage
    const storedCart = localStorage.getItem("cart-storage");
    if (storedCart) {
      try {
        const { state } = JSON.parse(storedCart);
        useCartStore.setState(state);
      } catch (error) {
        console.error("Failed to hydrate cart:", error);
      }
    }
  }, []);

  return mounted ? children : null;
}
