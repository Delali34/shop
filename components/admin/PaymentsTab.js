// components/admin/PaymentsTab.js
import { useState, useEffect } from "react";
import {
  FaCalendar,
  FaChartLine,
  FaMoneyBill,
  FaChartBar,
  FaDownload,
} from "react-icons/fa";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const formatPaymentMethod = (method) => {
  if (!method) return "Unknown";

  const methodMap = {
    CARD: "Card Payment",
    BANK_TRANSFER: "Bank Transfer",
    MOBILE_MONEY: "Mobile Money",
  };

  return methodMap[method] || method;
};

const getPaymentStatusStyle = (status) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "FAILED":
      return "bg-red-100 text-red-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800";
    case "REFUNDED":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export const PaymentsTab = ({ orders }) => {
  const [dateRange, setDateRange] = useState("today");
  const [customRange, setCustomRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [stats, setStats] = useState({
    totalRevenue: 0,
    successfulPayments: 0,
    failedPayments: 0,
    averageOrderValue: 0,
    revenueByPaymentMethod: {},
  });
  const [chartData, setChartData] = useState([]);

  // Calculate statistics based on date range
  useEffect(() => {
    const calculateStats = () => {
      let filteredOrders = [...orders];

      // Apply date filtering
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));

      switch (dateRange) {
        case "today":
          filteredOrders = orders.filter(
            (order) => new Date(order.createdAt) >= startOfDay
          );
          break;
        case "thisWeek":
          const startOfWeek = new Date(
            today.setDate(today.getDate() - today.getDay())
          );
          filteredOrders = orders.filter(
            (order) => new Date(order.createdAt) >= startOfWeek
          );
          break;
        case "thisMonth":
          const startOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          );
          filteredOrders = orders.filter(
            (order) => new Date(order.createdAt) >= startOfMonth
          );
          break;
        case "thisYear":
          const startOfYear = new Date(today.getFullYear(), 0, 1);
          filteredOrders = orders.filter(
            (order) => new Date(order.createdAt) >= startOfYear
          );
          break;
        case "custom":
          if (customRange.startDate && customRange.endDate) {
            filteredOrders = orders.filter((order) => {
              const orderDate = new Date(order.createdAt);
              return (
                orderDate >= new Date(customRange.startDate) &&
                orderDate <= new Date(customRange.endDate)
              );
            });
          }
          break;
      }

      // Calculate basic stats
      const totalRevenue = filteredOrders.reduce(
        (sum, order) => sum + Number(order.totalAmount),
        0
      );

      const successfulPayments = filteredOrders.filter(
        (order) => order.paymentStatus === "COMPLETED"
      ).length;

      const failedPayments = filteredOrders.filter(
        (order) => order.paymentStatus === "FAILED"
      ).length;

      const averageOrderValue = totalRevenue / (filteredOrders.length || 1);

      // Calculate revenue by payment method
      const revenueByPaymentMethod = filteredOrders.reduce((acc, order) => {
        const method = formatPaymentMethod(order.paymentMethod);
        acc[method] = (acc[method] || 0) + Number(order.totalAmount);
        return acc;
      }, {});

      // Prepare chart data
      const dailyRevenue = filteredOrders.reduce((acc, order) => {
        const date = format(new Date(order.createdAt), "yyyy-MM-dd");
        acc[date] = (acc[date] || 0) + Number(order.totalAmount);
        return acc;
      }, {});

      const chartData = Object.entries(dailyRevenue)
        .map(([date, amount]) => ({
          date,
          amount,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setStats({
        totalRevenue,
        successfulPayments,
        failedPayments,
        averageOrderValue,
        revenueByPaymentMethod,
      });

      setChartData(chartData);
    };

    calculateStats();
  }, [orders, dateRange, customRange]);

  const handleExportData = () => {
    // Create CSV content
    const headers = ["Date", "Reference", "Amount", "Payment Method", "Status"];
    const csvContent = [
      headers.join(","),
      ...orders.map((order) =>
        [
          format(new Date(order.createdAt), "yyyy-MM-dd"),
          order.paymentReference,
          order.totalAmount,
          formatPaymentMethod(order.paymentMethod),
          order.paymentStatus,
        ].join(",")
      ),
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payments Overview</h2>
        <button
          onClick={handleExportData}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <FaDownload /> Export Report
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <button
          onClick={() => setDateRange("today")}
          className={`px-4 py-2 rounded-lg ${
            dateRange === "today"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setDateRange("thisWeek")}
          className={`px-4 py-2 rounded-lg ${
            dateRange === "thisWeek"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setDateRange("thisMonth")}
          className={`px-4 py-2 rounded-lg ${
            dateRange === "thisMonth"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setDateRange("thisYear")}
          className={`px-4 py-2 rounded-lg ${
            dateRange === "thisYear"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          This Year
        </button>
        <div className="flex gap-2">
          <input
            type="date"
            value={customRange.startDate}
            onChange={(e) =>
              setCustomRange((prev) => ({
                ...prev,
                startDate: e.target.value,
              }))
            }
            className="px-3 py-2 border rounded-lg"
          />
          <input
            type="date"
            value={customRange.endDate}
            onChange={(e) =>
              setCustomRange((prev) => ({
                ...prev,
                endDate: e.target.value,
              }))
            }
            className="px-3 py-2 border rounded-lg"
          />
          <button
            onClick={() => setDateRange("custom")}
            className={`px-4 py-2 rounded-lg ${
              dateRange === "custom"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <FaMoneyBill className="text-green-500 text-3xl" />
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">
                GH₵{stats.totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <FaChartLine className="text-blue-500 text-3xl" />
            <div>
              <p className="text-sm text-gray-600">Successful Payments</p>
              <p className="text-2xl font-bold">{stats.successfulPayments}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <FaChartBar className="text-red-500 text-3xl" />
            <div>
              <p className="text-sm text-gray-600">Failed Payments</p>
              <p className="text-2xl font-bold">{stats.failedPayments}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <FaCalendar className="text-purple-500 text-3xl" />
            <div>
              <p className="text-sm text-gray-600">Average Order Value</p>
              <p className="text-2xl font-bold">
                GH₵{stats.averageOrderValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#4F46E5"
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Revenue by Payment Method
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.entries(stats.revenueByPaymentMethod).map(
                  ([method, amount]) => ({
                    method,
                    amount,
                  })
                )}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="method" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#4F46E5" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <h3 className="text-lg font-semibold p-6 border-b">Recent Payments</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Provider Ref
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 10)
                .map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(order.createdAt), "PP")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user?.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      GH₵{Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {formatPaymentMethod(order.paymentMethod)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${getPaymentStatusStyle(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.paymentReference || "N/A"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination or Load More button */}
        {orders.length > 10 && (
          <div className="px-6 py-4 border-t text-center">
            <button className="text-sm text-indigo-600 hover:text-indigo-900">
              View All Payments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsTab;
