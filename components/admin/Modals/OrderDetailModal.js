// components/admin/Modals/OrderDetailModal.js
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import {
  FiX,
  FiPackage,
  FiTruck,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

export function OrderDetailModal({ isOpen, onClose, order, onUpdateOrder }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(
    order?.trackingNumber || ""
  );

  if (!order) return null;

  // Format currency helper function
  const formatCurrency = (amount) => {
    // Convert string to number if needed
    const number = typeof amount === "string" ? parseFloat(amount) : amount;
    return `GH₵${Number(number).toFixed(2)}`;
  };

  // Calculate item total
  const calculateItemTotal = (item) => {
    const price =
      typeof item.priceAtTime === "string"
        ? parseFloat(item.priceAtTime)
        : item.priceAtTime;
    return price * item.quantity;
  };

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) throw new Error("Failed to update order");

      const updated = await response.json();
      onUpdateOrder(updated.data);
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  // In OrderDetailModal.js, update the handleUpdateTracking function
  const handleUpdateTracking = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/orders/${order.id}/shipping`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Add this
        body: JSON.stringify({
          trackingNumber,
          status: "PROCESSING",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update shipping");
      }

      const updated = await response.json();
      onUpdateOrder(updated.data);
    } catch (error) {
      console.error("Error updating shipping:", error);
      alert("Failed to update shipping information");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Order Details #{order.id.slice(-6).toUpperCase()}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Status */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Order Status
                    </h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleUpdateStatus("PROCESSING")}
                        disabled={isUpdating || order.status === "PROCESSING"}
                        className={`w-full flex items-center justify-center px-4 py-2 border rounded-md ${
                          order.status === "PROCESSING"
                            ? "bg-blue-100 text-blue-800"
                            : "hover:bg-blue-50"
                        }`}
                      >
                        <FiPackage className="mr-2" />
                        Processing
                      </button>
                      <button
                        onClick={() => handleUpdateStatus("COMPLETED")}
                        disabled={isUpdating || order.status === "COMPLETED"}
                        className={`w-full flex items-center justify-center px-4 py-2 border rounded-md ${
                          order.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : "hover:bg-green-50"
                        }`}
                      >
                        <FiCheck className="mr-2" />
                        Completed
                      </button>
                      <button
                        onClick={() => handleUpdateStatus("CANCELLED")}
                        disabled={isUpdating || order.status === "CANCELLED"}
                        className={`w-full flex items-center justify-center px-4 py-2 border rounded-md ${
                          order.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "hover:bg-red-50"
                        }`}
                      >
                        <FiAlertCircle className="mr-2" />
                        Cancelled
                      </button>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Shipping Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Tracking Number
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                            placeholder="Enter tracking number"
                          />
                          <button
                            onClick={handleUpdateTracking}
                            disabled={isUpdating || !trackingNumber}
                            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                          >
                            <FiTruck className="mr-2" />
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Customer Information
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Name:</span>{" "}
                        {order.user.name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span>{" "}
                        {order.user.email}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Order Items
                    </h4>
                    <div className="space-y-4">
                      {order.orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-2 border-b"
                        >
                          <div className="flex items-center">
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(calculateItemTotal(item))}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>{formatCurrency(order.shippingCost)}</span>
                      </div>
                      <div className="flex justify-between text-base font-medium">
                        <span>Total</span>
                        <span>{formatCurrency(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Shipping Address
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>{order.shippingAddress.streetAddress}</p>
                      {order.shippingAddress.apartment && (
                        <p>{order.shippingAddress.apartment}</p>
                      )}
                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                      <p>Phone: {order.shippingAddress.phone}</p>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Payment Information
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Status:</span>{" "}
                        {order.paymentStatus}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Method:</span>{" "}
                        {order.paymentMethod || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Reference:</span>{" "}
                        {order.paymentReference || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
