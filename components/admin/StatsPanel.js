// components/admin/StatsPanel.js
import React from "react";
import { FaBox, FaTags, FaUsers, FaShoppingBag } from "react-icons/fa";

// components/admin/StatsPanel.js
export function StatsPanel({ stats }) {
  const { productsCount, categoriesCount, usersCount, ordersCount, isLoading } =
    stats;

  const statItems = [
    {
      name: "Total Products",
      value: productsCount,
      icon: FaBox,
      color: "bg-blue-500",
    },
    {
      name: "Categories",
      value: categoriesCount,
      icon: FaTags,
      color: "bg-green-500",
    },
    {
      name: "Registered Users",
      value: usersCount,
      icon: FaUsers,
      color: "bg-purple-500",
    },
    {
      name: "Total Orders",
      value: ordersCount,
      icon: FaShoppingBag,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-4 gap-4">
          {statItems.map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-lg shadow p-4 flex items-center"
            >
              <div className={`${item.color} p-3 rounded-lg text-white mr-4`}>
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{item.name}</p>
                <p className="text-2xl font-semibold">
                  {isLoading ? (
                    <div className="animate-pulse h-8 w-16 bg-gray-200 rounded" />
                  ) : (
                    item.value || 0
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
