// app/products/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegSadTear, FaFilter, FaTimes } from "react-icons/fa";

// Enhanced filter options
const filterOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name: A-Z", value: "name_asc" },
  { label: "Name: Z-A", value: "name_desc" },
];

const priceRanges = [
  { label: "Under GH₵50", min: 0, max: 50 },
  { label: "GH₵50 - GH₵100", min: 50, max: 100 },
  { label: "GH₵100 - GH₵200", min: 100, max: 200 },
  { label: "GH₵200 - GH₵500", min: 200, max: 500 },
  { label: "Over GH₵500", min: 500, max: Infinity },
];

const ProductsSkeleton = () => (
  <div className="animate-pulse">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-100 h-[400px]">
            <div className="h-[300px] bg-gray-200 mb-4"></div>
            <div className="px-4">
              <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProductCard = ({ product }) => (
  <Link href={`/product/${product.id}`} className="block">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <div className="relative aspect-[3/4] mb-4">
        <Image
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300"
        />
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        <h3 className="text-sm uppercase tracking-wider mb-2 font-sans2">
          {product.name}
        </h3>
        <div className="flex items-center justify-center gap-3 text-sm">
          <span className="text-red-500">
            GH₵{Number(product.price).toFixed(2)}
          </span>
        </div>
        {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
          <p className="text-xs text-orange-500 mt-2">
            Only {product.stockQuantity} left in stock!
          </p>
        )}
        {product.stockQuantity === 0 && (
          <p className="text-xs text-red-500 mt-2">Out of Stock</p>
        )}
      </div>
    </motion.div>
  </Link>
);

const MobileFilters = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  categories,
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />

        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 500 }}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] overflow-auto"
        >
          <div className="flex justify-center p-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <div className="px-6 pt-2 pb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Filters</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            {/* Sort Options */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Sort By</h4>
              <div className="grid grid-cols-1 gap-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilters({
                        ...filters,
                        sortBy:
                          option.value === filters.sortBy ? null : option.value,
                      });
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      filters.sortBy === option.value
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Price Range</h4>
              <div className="grid grid-cols-1 gap-2">
                {priceRanges.map((range) => (
                  <button
                    key={`${range.min}-${range.max}`}
                    onClick={() => {
                      setFilters({
                        ...filters,
                        priceRange:
                          filters.priceRange?.min === range.min ? null : range,
                      });
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      filters.priceRange?.min === range.min
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Categories</h4>
              <div className="grid grid-cols-1 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setFilters({
                        ...filters,
                        categoryId:
                          filters.categoryId === category.id
                            ? null
                            : category.id,
                      });
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      filters.categoryId === category.id
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Status Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Stock Status</h4>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    setFilters({
                      ...filters,
                      inStock: filters.inStock === true ? null : true,
                    });
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    filters.inStock === true
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  In Stock Only
                </button>
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setFilters({});
                onClose();
              }}
              className="w-full mt-4 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (!productsResponse.ok) throw new Error("Failed to fetch products");
        if (!categoriesResponse.ok)
          throw new Error("Failed to fetch categories");

        setProducts(productsData.data);
        setCategories(categoriesData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterProducts = (products) => {
    let filtered = [...products];

    // Category filter
    if (filters.categoryId) {
      filtered = filtered.filter(
        (product) => product.categoryId === filters.categoryId
      );
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter((product) => {
        const price = Number(product.price);
        return (
          price >= filters.priceRange.min && price <= filters.priceRange.max
        );
      });
    }

    // Stock status filter
    if (filters.inStock) {
      filtered = filtered.filter((product) => product.stockQuantity > 0);
    }

    // Sort
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case "price_asc":
            return Number(a.price) - Number(b.price);
          case "price_desc":
            return Number(b.price) - Number(a.price);
          case "name_asc":
            return a.name.localeCompare(b.name);
          case "name_desc":
            return b.name.localeCompare(a.name);
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          default:
            return 0;
        }
      });
    }

    return filtered;
  };

  if (loading) return <ProductsSkeleton />;

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <FaRegSadTear className="mx-auto text-6xl text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/"
            className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const filteredProducts = filterProducts(products);

  return (
    <div className="min-h-screen font-luxury bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 border-b">
        <nav className="text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">All Products</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <h2 className="text-lg font-medium mb-6">Filters</h2>

            {/* Sort Options */}
            <div className="mb-8">
              <h3 className="text-sm font-medium mb-4">Sort By</h3>
              <div className="space-y-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilters({
                        ...filters,
                        sortBy:
                          option.value === filters.sortBy ? null : option.value,
                      });
                    }}
                    className={`block w-full text-left py-2 text-sm transition-colors ${
                      filters.sortBy === option.value
                        ? "text-gray-900 font-medium"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-8">
              <h3 className="text-sm font-medium mb-4">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <button
                    key={`${range.min}-${range.max}`}
                    onClick={() => {
                      setFilters({
                        ...filters,
                        priceRange:
                          filters.priceRange?.min === range.min ? null : range,
                      });
                    }}
                    className={`block w-full text-left py-2 text-sm transition-colors ${
                      filters.priceRange?.min === range.min
                        ? "text-gray-900 font-medium"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="text-sm font-medium mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setFilters({
                        ...filters,
                        categoryId:
                          filters.categoryId === category.id
                            ? null
                            : category.id,
                      });
                    }}
                    className={`block w-full text-left py-2 text-sm transition-colors ${
                      filters.categoryId === category.id
                        ? "text-gray-900 font-medium"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Status Filter */}
            <div className="mb-8">
              <h3 className="text-sm font-medium mb-4">Stock Status</h3>
              <button
                onClick={() => {
                  setFilters({
                    ...filters,
                    inStock: filters.inStock === true ? null : true,
                  });
                }}
                className={`block w-full text-left py-2 text-sm transition-colors ${
                  filters.inStock === true
                    ? "text-gray-900 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                In Stock Only
              </button>
            </div>

            {/* Clear Filters */}
            {Object.keys(filters).length > 0 && (
              <button
                onClick={() => setFilters({})}
                className="text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 md:pl-8">
            {/* Mobile Filter Button */}
            <div className="md:hidden flex justify-between items-center mb-6">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm"
              >
                <FaFilter className="text-gray-600" />
                <span>Filters</span>
              </button>
              <div className="text-sm text-gray-600">
                {filteredProducts.length} Products
              </div>
            </div>

            {/* Active Filters Display */}
            {Object.keys(filters).length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {filters.categoryId && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
                    Category:{" "}
                    {categories.find((c) => c.id === filters.categoryId)?.name}
                    <button
                      onClick={() =>
                        setFilters({ ...filters, categoryId: null })
                      }
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.priceRange && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
                    Price: {filters.priceRange.label}
                    <button
                      onClick={() =>
                        setFilters({ ...filters, priceRange: null })
                      }
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.inStock && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
                    In Stock Only
                    <button
                      onClick={() => setFilters({ ...filters, inStock: null })}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* No Results Message */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={() => setFilters({})}
                  className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Products Count - Desktop */}
                <div className="hidden md:flex justify-between items-center mb-6">
                  <div className="text-sm text-gray-600">
                    {filteredProducts.length} Products
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <MobileFilters
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filters={filters}
        setFilters={setFilters}
        categories={categories}
      />
    </div>
  );
}
