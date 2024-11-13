"use client";
import { useState, useEffect } from "react";
import {
  FaBox,
  FaTags,
  FaUsers,
  FaShoppingBag,
  FaCreditCard,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { TabButton } from "@/components/admin/TabButton";
import { ProductsTab } from "@/components/admin/ProductsTab";
import { CategoriesTab } from "@/components/admin/CategoriesTab";
import { UsersTab } from "@/components/admin/UsersTab";
import { ProductModal } from "@/components/admin/Modals/ProductModal";
import { CategoryModal } from "@/components/admin/Modals/CategoryModal";
import { UserModal } from "@/components/admin/Modals/UserModal";
import { StatsPanel } from "@/components/admin/StatsPanel";
import { OrdersTab } from "@/components/admin/OrdersTab";
import { PaymentsTab } from "@/components/admin/PaymentsTab";

export default function AdminDashboard() {
  // State management
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Form states
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    brand: "",
    price: "",
    description: "",

    category_id: "",
    stock_quantity: "",
  });

  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    description: "",
    slug: "",
  });

  const [selectedUser, setSelectedUser] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "user",
    email_verified: false,
  });

  const [image, setImage] = useState(null);

  // Hooks
  const router = useRouter();

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchUsers(),
          fetchOrders(),
        ]);
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Fetch functions
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };
  // In your AdminDashboard component
  const handleEditUser = async (updatedUser) => {
    try {
      const response = await fetch(`/api/users/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      await fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      await fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    }
  };

  // Add this function to handle order updates
  const handleUpdateOrder = async (updatedOrder) => {
    try {
      const updatedOrders = orders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error updating order in state:", error);
    }
  };

  // Product handlers
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      let image_url = currentProduct.image_url;

      if (image) {
        const base64Image = await convertToBase64(image);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: base64Image }),
        });
        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          image_url = uploadData.url;
        }
      }

      const productData = {
        ...currentProduct,
        price: parseFloat(currentProduct.price) || 0,
        stock_quantity: parseInt(currentProduct.stock_quantity) || 0,
        image_url,
      };

      const method = currentProduct.id ? "PUT" : "POST";
      const url = currentProduct.id
        ? `/api/products` // For both create and update, use the same endpoint
        : `/api/products`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save product");
      }

      const data = await response.json();

      // Update local state
      if (currentProduct.id) {
        setProducts(
          products.map((p) => (p.id === data.data.id ? data.data : p))
        );
      } else {
        setProducts([data.data, ...products]);
      }

      // Reset form and close modal
      setIsProductModalOpen(false);
      setCurrentProduct({
        name: "",
        brand: "",
        price: "",
        description: "",
        category_id: "",
        stock_quantity: "",
      });
      setImage(null);

      // Show success message
      alert(data.message || "Product saved successfully");
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This will also remove it from all orders."
      )
    ) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to delete product");
        }

        // Update local state
        setProducts(products.filter((product) => product.id !== id));
        alert("Product deleted successfully");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert(error.message);
      }
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add feedback messages
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Category handlers
  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name"
        ? {
            slug: value
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, ""),
          }
        : {}),
    }));
  };

  // In AdminDashboard.js
  const handleCategorySubmit = async (e, categoryData) => {
    e.preventDefault();
    try {
      const url = categoryData.id
        ? `/api/categories/${categoryData.id}`
        : "/api/categories";
      const method = categoryData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error("Failed to save category");
      }

      setIsCategoryModalOpen(false);
      setCurrentCategory({
        name: "",
        description: "",
        slug: "",
        image_url: "",
      });
      await fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      throw error; // Re-throw the error to be handled by the modal
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          await fetchCategories();
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  // User handlers
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedUser.id
        ? `/api/users/${selectedUser.id}`
        : "/api/users";
      const method = selectedUser.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to save user");
      }

      setIsUserModalOpen(false);
      setSelectedUser({
        email: "",
        first_name: "",
        last_name: "",
        role: "user",
        email_verified: false,
      });
      await fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      alert(error.message);
    }
  };

  // Navigation items
  const navItems = [
    { id: "products", icon: FaBox, label: "Products" },
    { id: "categories", icon: FaTags, label: "Categories" },
    { id: "users", icon: FaUsers, label: "Users" },
    { id: "orders", icon: FaShoppingBag, label: "Orders" },
    { id: "payments", icon: FaCreditCard, label: "Payments" },
  ];

  // Render tab content
  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "products":
        return (
          <ProductsTab
            products={products}
            onEdit={(product) => {
              setCurrentProduct(product);
              setIsProductModalOpen(true);
            }}
            onDelete={handleDeleteProduct}
            onAddNew={() => {
              setCurrentProduct({
                name: "",
                brand: "",
                price: "",
                description: "",
                rating: "",
                category_id: "",
                stock_quantity: "",
              });
              setIsProductModalOpen(true);
            }}
          />
        );
      case "categories":
        return (
          <CategoriesTab
            categories={categories}
            products={products}
            onEdit={(category) => {
              setCurrentCategory(category);
              setIsCategoryModalOpen(true);
            }}
            onDelete={handleDeleteCategory}
            onAddNew={() => {
              setCurrentCategory({ name: "", description: "", slug: "" });
              setIsCategoryModalOpen(true);
            }}
          />
        );
      case "users":
        return (
          <UsersTab
            users={users}
            onEdit={(user) => {
              setSelectedUser(user);
              setIsUserModalOpen(true);
            }}
            onDelete={handleDeleteUser}
          />
        );
      case "orders":
        return <OrdersTab orders={orders} onUpdateOrder={handleUpdateOrder} />;
      case "payments":
        return <PaymentsTab orders={orders} />;
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Select a tab to view content
            </h2>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {feedback.message && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
            feedback.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {feedback.message}
        </div>
      )}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-56 bg-white shadow-lg">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-indigo-800">Admin Panel</h1>
          </div>
          <nav className="mt-4">
            {navItems.map((item) => (
              <TabButton
                key={item.id}
                active={activeTab === item.id}
                icon={item.icon}
                label={item.label}
                onClick={() => setActiveTab(item.id)}
              />
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">{renderTabContent()}</div>

        {/* Modals */}
        {!isLoading && (
          <>
            <ProductModal
              isOpen={isProductModalOpen}
              onClose={() => setIsProductModalOpen(false)}
              currentProduct={currentProduct}
              handleInputChange={handleProductInputChange}
              handleSubmit={handleProductSubmit}
              handleImageChange={handleImageChange}
              categories={categories}
              isSubmitting={isSubmitting}
            />

            <CategoryModal
              isOpen={isCategoryModalOpen}
              onClose={() => setIsCategoryModalOpen(false)}
              currentCategory={currentCategory}
              handleInputChange={handleCategoryInputChange}
              handleSubmit={handleCategorySubmit}
            />

            <UserModal
              isOpen={isUserModalOpen}
              onClose={() => setIsUserModalOpen(false)}
              currentUser={selectedUser}
              handleSubmit={handleUserSubmit}
              handleInputChange={(e) => {
                const { name, value, type, checked } = e.target;
                setSelectedUser((prev) => ({
                  ...prev,
                  [name]: type === "checkbox" ? checked : value,
                }));
              }}
            />
          </>
        )}

        {/* Stats Panel */}
        <StatsPanel
          stats={{
            productsCount: products?.length || 0,
            categoriesCount: categories?.length || 0,
            usersCount: users?.length || 0,
            ordersCount: orders?.length || 0,
            isLoading,
          }}
        />
      </div>
    </div>
  );
}
