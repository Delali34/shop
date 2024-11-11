"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaRegSadTear,
  FaStar,
  FaImage,
  FaCheck,
} from "react-icons/fa";
import toast from "react-hot-toast";
import useCartStore from "@/store/cartStore";

const SuccessNotification = ({ message }) => (
  <div className="flex items-center gap-2 bg-white shadow-lg rounded-lg p-4">
    <div className="bg-green-100 rounded-full p-1">
      <FaCheck className="text-green-500 w-4 h-4" />
    </div>
    <p className="text-gray-800">{message}</p>
  </div>
);

const RelatedProductCard = ({ product, onProductClick }) => (
  <Link
    href={`/product/${product.id}`}
    className="block group"
    onClick={onProductClick}
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-md overflow-hidden"
    >
      <div className="bg-white shadow-md overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder.png";
            }}
          />
        ) : (
          <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center">
            <FaImage className="text-gray-400 text-4xl" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm uppercase tracking-wider mb-2 font-luxury">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-red-500 font-medium">
            GH₵{parseFloat(product.price).toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  </Link>
);

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProduct, setRelatedProduct] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addItem } = useCartStore();

  const fetchProductData = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch product data");
      }

      const productData = {
        ...result.data,
        category_slug: result.data.category?.slug || "uncategorized",
        category_name: result.data.category?.name || "Uncategorized",
      };

      setProduct(productData);

      if (productData.categoryId) {
        const relatedResponse = await fetch(
          `/api/products/related?category=${productData.categoryId}&exclude=${productData.id}`
        );

        if (relatedResponse.ok) {
          const relatedResult = await relatedResponse.json();
          if (relatedResult.success && relatedResult.data) {
            const relatedProductData = {
              ...relatedResult.data,
              category_slug:
                relatedResult.data.category?.slug || "uncategorized",
              category_name:
                relatedResult.data.category?.name || "Uncategorized",
            };
            setRelatedProduct(relatedProductData);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchProductData(params.id);
    }
  }, [params.id]);

  const handleAddToCart = async () => {
    if (product && !addingToCart) {
      setAddingToCart(true);

      try {
        addItem(product, quantity);
        toast.custom((t) => (
          <SuccessNotification message={`${product.name} added to cart`} />
        ));
        setQuantity(1);
      } catch (error) {
        toast.error("Failed to add item to cart");
      } finally {
        setAddingToCart(false);
      }
    }
  };

  const handleRelatedProductClick = () => {
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="animate-pulse max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 w-full"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 w-3/4"></div>
            <div className="h-6 bg-gray-200 w-1/4"></div>
            <div className="h-24 bg-gray-200"></div>
            <div className="h-12 bg-gray-200 w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <FaRegSadTear className="mx-auto text-6xl text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/categories"
            className="inline-block bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen font-luxury font-medium bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 border-b">
        <nav className="text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link
            href="/categories"
            className="text-gray-500 hover:text-gray-900"
          >
            Categories
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          {product.category && (
            <>
              <Link
                href={`/category/${product.category_slug}`}
                className="text-gray-500 hover:text-gray-900"
              >
                {product.category_name}
              </Link>
              <span className="mx-2 text-gray-400">/</span>
            </>
          )}
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            className="bg-white shadow-md overflow-hidden"
            layoutId={`product-image-${product.id}`}
          >
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={1000}
                height={1000}
                className="w-full h-full object-cover"
                priority
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder.png";
                }}
              />
            ) : (
              <div className="w-full h-full aspect-square bg-gray-200 flex items-center justify-center">
                <FaImage className="text-gray-400 text-4xl" />
              </div>
            )}
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-luxury mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-2">{product.brand}</p>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-red-500 font-medium">
                  GH₵{parseFloat(product.price).toFixed(2)}
                </span>
              </div>
              {product.rating && (
                <div className="flex items-center mb-4">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-gray-600">
                    {parseFloat(product.rating).toFixed(1)} / 5.0
                  </span>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="prose prose-sm"
            >
              <p className="text-gray-600">{product.description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-4"
            >
              <span className="text-sm text-gray-600">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  -
                </button>
                <span className="px-4 py-2 text-gray-800 min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="w-full md:w-auto px-8 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FaShoppingCart />
              {addingToCart ? "Adding..." : "Add to Cart"}
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="border-t pt-6 mt-8"
            >
              <h3 className="text-sm font-medium mb-4">PRODUCT DETAILS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Brand:</span>
                  <span className="ml-2 text-gray-900">{product.brand}</span>
                </div>
                {product.category && (
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2 text-gray-900">
                      {product.category_name}
                    </span>
                  </div>
                )}
                {product.rating && (
                  <div>
                    <span className="text-gray-600">Rating:</span>
                    <span className="ml-2 text-gray-900 flex items-center gap-1">
                      <FaStar className="text-yellow-400" />
                      {parseFloat(product.rating).toFixed(1)} / 5.0
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {relatedProduct && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-7xl mx-auto px-4 py-12"
        >
          <h2 className="text-2xl font-luxury mb-8">
            {relatedProduct.category_slug === product.category_slug
              ? "More From This Category"
              : "You May Also Like"}
          </h2>
          <div className="max-w-sm mx-auto">
            <RelatedProductCard
              product={relatedProduct}
              onProductClick={handleRelatedProductClick}
            />
          </div>
        </motion.div>
      )}

      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence />
      </div>
    </div>
  );
}
