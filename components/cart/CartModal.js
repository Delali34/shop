// components/CartModal.js
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiX, BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import useCartStore from "@/store/cartStore";
import { useSession } from "next-auth/react";

const CartModal = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const { updateQuantity, removeItem, getSubtotal } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getSubtotal();

  const formatPrice = (price) => {
    const numberPrice =
      typeof price === "string" ? parseFloat(price) : Number(price);
    return numberPrice.toFixed(2);
  };

  const handleCheckout = () => {
    if (!session) {
      // If user is not logged in, redirect to login with callback
      router.push(`/login?callbackUrl=${encodeURIComponent("/checkout")}`);
    } else {
      // If user is logged in, go directly to checkout
      router.push("/checkout");
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-white z-50 shadow-xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-luxury">Shopping Cart</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <BiX className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {items.length > 0 ? (
                  <div className="divide-y">
                    {items.map((item) => (
                      <div key={item.id} className="p-4 flex gap-4">
                        <div className="w-24 h-24 flex-shrink-0 bg-gray-100">
                          <Image
                            src={item.imageUrl || "/placeholder.png"}
                            alt={item.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <Link
                            href={`/product/${item.id}`}
                            className="font-luxury hover:text-gray-600"
                            onClick={onClose}
                          >
                            {item.name}
                          </Link>
                          {item.brand && (
                            <div className="text-sm text-gray-500">
                              {item.brand}
                            </div>
                          )}
                          <div className="mt-1 text-sm text-gray-500">
                            GH₵{formatPrice(item.price)}
                          </div>

                          <div className="flex items-center mt-2 space-x-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <BiMinus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <BiPlus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1 hover:bg-gray-100 rounded ml-2"
                            >
                              <BiTrash className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-medium">
                            GH₵{(Number(item.price) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                    <Link
                      href="/categories"
                      className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
                      onClick={onClose}
                    >
                      Continue Shopping
                    </Link>
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t p-6 space-y-4">
                  <div className="flex justify-between text-lg font-luxury">
                    <span>Subtotal</span>
                    <span>₵{subtotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors font-luxury"
                  >
                    {session ? "Proceed to Checkout" : "Sign in to Checkout"}
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full bg-white text-black border border-black py-3 hover:bg-gray-50 transition-colors font-luxury"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
