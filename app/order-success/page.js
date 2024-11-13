"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!reference) {
          window.location.href = "/";
          return;
        }

        const response = await fetch(
          `/api/orders/get-by-reference/${reference}`
        );
        if (!response.ok) throw new Error("Failed to fetch order");

        const data = await response.json();
        // Convert decimal strings to numbers
        const processedOrder = {
          ...data.order,
          subtotal: Number(data.order.subtotal),
          shippingCost: Number(data.order.shippingCost),
          totalAmount: Number(data.order.totalAmount),
          orderItems: data.order.orderItems.map((item) => ({
            ...item,
            priceAtTime: Number(item.priceAtTime),
          })),
        };
        setOrder(processedOrder);

        // Send email notification
        const emailResponse = await fetch("/api/send-order-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: processedOrder.id,
            reference: processedOrder.paymentReference,
          }),
        });

        if (emailResponse.ok) {
          setEmailSent(true);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [reference]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-luxury mb-4">Order Not Found</h1>
        <p className="mb-8">We couldn't find your order details.</p>
        <a
          href="/"
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Return to Home
        </a>
      </div>
    );
  }

  // Helper function to format currency
  const formatPrice = (price) => {
    return Number(price).toFixed(2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-luxury mb-4">Order Successful!</h1>
          <p className="text-gray-600 mb-2">
            Thank you for your purchase. We'll send you an email with your order
            details.
          </p>
          <p className="text-sm text-gray-500">
            Order Reference: {order.paymentReference}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-luxury mb-4">Order Details</h2>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2"
                  >
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      GH₵{formatPrice(item.priceAtTime * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>GH₵{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>GH₵{formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>GH₵{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            <div className="border-t mt-6 pt-6 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-luxury mb-2">Shipping Address</h3>
                <div className="text-sm text-gray-600">
                  <p>{order.shippingAddress.streetAddress}</p>
                  {order.shippingAddress.apartment && (
                    <p>{order.shippingAddress.apartment}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="font-luxury mb-2">Billing Address</h3>
                <div className="text-sm text-gray-600">
                  <p>{order.billingAddress.streetAddress}</p>
                  {order.billingAddress.apartment && (
                    <p>{order.billingAddress.apartment}</p>
                  )}
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state}{" "}
                    {order.billingAddress.postalCode}
                  </p>
                  <p>{order.billingAddress.country}</p>
                  <p>Phone: {order.billingAddress.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors inline-block"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
}
