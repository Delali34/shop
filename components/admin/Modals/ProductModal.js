import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

export const ProductModal = ({
  isOpen,
  onClose,
  currentProduct,
  handleInputChange,
  handleSubmit,
  handleImageChange,
  categories,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(
    currentProduct?.imageUrl || null
  );

  if (!isOpen) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await handleSubmit(e);
      onClose();
    } catch (error) {
      setError(error.message || "Failed to save product. Please try again.");
      console.error("Product submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        // 5MB limit
        setError("Image size should be less than 5MB");
        return;
      }

      handleImageChange(e);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto p-4">
      <div className="bg-white p-8 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          disabled={isSubmitting}
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-indigo-800">
          {currentProduct.id ? "Edit Product" : "Add New Product"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name*
            </label>
            <input
              type="text"
              name="name"
              value={currentProduct.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand*
            </label>
            <input
              type="text"
              name="brand"
              value={currentProduct.brand}
              onChange={handleInputChange}
              placeholder="Enter brand name"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category*
            </label>
            <select
              name="category_id"
              value={currentProduct.category_id}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
              disabled={isSubmitting}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price*
            </label>
            <input
              type="number"
              name="price"
              value={currentProduct.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              step="0.01"
              min="0"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity*
            </label>
            <input
              type="number"
              name="stock_quantity"
              value={currentProduct.stock_quantity}
              onChange={handleInputChange}
              placeholder="Enter stock quantity"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              min="0"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={currentProduct.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              rows="3"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <input
              type="file"
              onChange={onImageChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              accept="image/*"
              disabled={isSubmitting}
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-40 object-cover rounded"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  {currentProduct.id ? "Updating..." : "Adding..."}
                </>
              ) : currentProduct.id ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
