"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiUser, FiShoppingBag, FiMapPin, FiEdit, FiBox } from "react-icons/fi";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!session) {
    return null;
  }

  const TABS = [
    {
      id: "profile",
      label: "Profile Details",
      icon: FiUser,
    },
    {
      id: "orders",
      label: "Order History",
      icon: FiShoppingBag,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || ""}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                  <FiUser className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold">
                  {session.user.name || "No name set"}
                </h2>
                <p className="text-gray-600">{session.user.email}</p>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Account Details</h3>
                {/* <button className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm">
                  <FiEdit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </button> */}
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="mt-1 text-gray-900">{session.user.name}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-gray-900 break-all">
                      {session.user.email}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <label className="block text-sm font-medium text-gray-700">
                      Account Created
                    </label>
                    <p className="mt-1 text-gray-900">
                      {new Date(
                        session.user.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "orders":
        return <OrderHistory />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Tab Selection */}
        <div className="block sm:hidden mb-6">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {TABS.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden md:block md:col-span-1">
            <nav className="space-y-1 sticky top-6">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 ${
                        activeTab === tab.id
                          ? "text-indigo-600"
                          : "text-gray-400"
                      }`}
                    />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white shadow rounded-lg">
              <div className="p-4 sm:p-6">{renderTabContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Order History Component
function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders/get-user-orders");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch orders");
      }

      // Convert decimal strings to numbers
      const processedOrders = data.orders.map((order) => ({
        ...order,
        totalAmount: Number(order.totalAmount),
        subtotal: Number(order.subtotal),
        shippingCost: Number(order.shippingCost),
        orderItems: order.orderItems.map((item) => ({
          ...item,
          priceAtTime: Number(item.priceAtTime),
        })),
      }));

      setOrders(processedOrders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <FiBox className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No orders yet
        </h3>
        <p className="mt-2 text-gray-500">
          Start shopping to see your orders here.
        </p>
        <div className="mt-6">
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
          >
            <FiShoppingBag className="mr-2 -ml-1" />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Order History</h3>
        <span className="text-sm text-gray-500">{orders.length} orders</span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {/* Order Header */}
            <div className="p-4 sm:p-6 border-b bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Order #{order.id}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Ref: {order.paymentReference}
                  </p>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-full sm:w-20 h-20 relative rounded overflow-hidden bg-gray-100">
                        <Image
                          src={item.product.imageUrl || "/placeholder.png"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        GH₵{(item.priceAtTime * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      GH₵{order.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      GH₵{order.shippingCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-medium pt-2 border-t">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      GH₵{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="mt-6 border-t pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Shipping Address */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <FiMapPin className="mr-2" />
                      Shipping Address
                    </h4>
                    <div className="text-sm text-gray-500 space-y-1">
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
                      <p className="font-medium">
                        Phone: {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <FiMapPin className="mr-2" />
                      Billing Address
                    </h4>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>{order.billingAddress.streetAddress}</p>
                      {order.billingAddress.apartment && (
                        <p>{order.billingAddress.apartment}</p>
                      )}
                      <p>
                        {order.billingAddress.city},{" "}
                        {order.billingAddress.state}{" "}
                        {order.billingAddress.postalCode}
                      </p>
                      <p>{order.billingAddress.country}</p>
                      <p className="font-medium">
                        Phone: {order.billingAddress.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
