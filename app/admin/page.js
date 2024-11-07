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
    rating: "",
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
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.success) {
        setUsers(data.data.filter((user) => user.role === "user")); // Only show users, not admins
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const res = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
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
        rating: parseFloat(currentProduct.rating) || 0,
        stock_quantity: parseInt(currentProduct.stock_quantity) || 0,
        image_url,
      };

      const url = currentProduct.id
        ? `/api/products/${currentProduct.id}`
        : "/api/products";
      const method = currentProduct.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      setIsProductModalOpen(false);
      setCurrentProduct({
        name: "",
        brand: "",
        price: "",
        description: "",
        rating: "",
        category_id: "",
        stock_quantity: "",
      });
      setImage(null);
      await fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          await fetchProducts();
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

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

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          await fetchUsers();
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
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
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
            {/* Implement OrdersTab component */}
          </div>
        );
      case "payments":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Payments coming soon...
            </h2>
          </div>
        );
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
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
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
