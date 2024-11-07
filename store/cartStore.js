import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id
          );

          // Ensure price is a number
          const price =
            typeof product.price === "string"
              ? parseFloat(product.price)
              : Number(product.price);

          const normalizedProduct = {
            id: product.id,
            name: product.name,
            price: price,
            imageUrl: product.imageUrl,
            brand: product.brand,
          };

          if (existingItem) {
            const updatedItems = state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
            return { items: updatedItems };
          }

          return {
            items: [...state.items, { ...normalizedProduct, quantity }],
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price =
            typeof item.price === "string"
              ? parseFloat(item.price)
              : Number(item.price);
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: false,
      partialize: (state) => ({
        items: state.items.map((item) => ({
          ...item,
          price: Number(item.price), // Ensure price is stored as number
        })),
      }),
    }
  )
);

export default useCartStore;
