import { FaEdit, FaTrash, FaPlus, FaImage, FaBoxOpen } from "react-icons/fa";
import { useState } from "react";

export const ProductsTab = ({ products, onEdit, onDelete, onAddNew }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category?.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await onDelete(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-indigo-800">
          Products Management ({filteredProducts.length})
        </h2>
        <button
          onClick={onAddNew}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200 flex items-center"
        >
          <FaPlus className="mr-2" /> Add New Product
        </button>
      </div>

      <div className="mb-6 flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded-md w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <FaBoxOpen className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600">
            {searchTerm || selectedCategory
              ? "No products found matching your criteria."
              : "No products found. Add your first product!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-6 rounded-lg shadow-md transition duration-200 hover:shadow-lg"
            >
              <div className="relative w-full h-48 mb-4 bg-gray-100 rounded-md overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaImage className="text-gray-400 text-4xl" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600">{product.brand}</p>
                <p className="text-indigo-600 font-bold">
                  GH₵{parseFloat(product.price).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  Stock: {product.stockQuantity}
                </p>
                {product.category && (
                  <span className="inline-block bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded">
                    {product.category.name}
                  </span>
                )}
                <p className="text-gray-700 line-clamp-2 text-sm">
                  {product.description}
                </p>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => onEdit(product)}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 flex items-center"
                  title="Edit product"
                >
                  <FaEdit className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 flex items-center"
                  title="Delete product"
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
