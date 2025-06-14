"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaShoppingBag, FaArrowRight } from "react-icons/fa";

// Loading Skeleton Component
const CategorySkeleton = () => (
  <div className="relative h-[400px] animate-pulse bg-gray-200">
    <div className="absolute bottom-0 left-0 right-0 p-8">
      <div className="p-6">
        <div className="space-y-4">
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
          <div className="h-8 w-48 bg-gray-300 rounded"></div>
          <div className="h-4 w-64 bg-gray-300 rounded"></div>
          <div className="h-10 w-36 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

// Error State Component
const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50">
    <div className="text-center p-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default function Trends() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch categories");
      }
      setCategories(data.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    try {
      router.push(`/category/${category.slug}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="bg-white font-sans2 py-16">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((item) => (
              <CategorySkeleton key={item} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-white font-sans2 py-16">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorState error={error} onRetry={fetchCategories} />
        </div>
      </div>
    );
  }

  // No Categories State
  if (categories.length === 0) {
    return (
      <div className="bg-white font-sans2 py-16">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Categories Found
            </h2>
            <p className="text-gray-600">
              Please check back later for our collections.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white font-luxury py-16">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="lg:text-4xl text-3xl font-bold text-gray-900 mb-4">
            Our Collections
          </h2>
          <p className="text-gray-600">
            Discover your favorite collections and accessories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="cursor-pointer"
            >
              <div className="relative h-[400px] group overflow-hidden shadow-lg">
                {/* Image Section */}
                <div className="relative w-full h-full">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      width={640}
                      height={400}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      priority={index < 2}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                      <FaShoppingBag className="text-gray-400 text-6xl" />
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
                </div>

                {/* Content Section */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="p-4 backdrop-blur-sm bg-black/20 rounded-lg transform transition-transform duration-300 group-hover:translate-y-[-10px]">
                    <div className="text-white">
                      <p className="text-sm uppercase tracking-wider mb-2 text-gold">
                        Collection
                      </p>
                      <h3 className="text-lg font-bold mb-4">
                        {category.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center bg-white text-black md:px-6 px-4 py-2 text-[10px] uppercase tracking-wider hover:bg-gray-200 transition-colors duration-300 rounded">
                          VIEW COLLECTION
                          <FaArrowRight className="ml-2" />
                        </div>
                        <span className="text-gold lg:text-sm text-xs">
                          {category.product_count || 0} Products
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Counter */}
                <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded">
                  {String(index + 1).padStart(2, "0")}/
                  {String(categories.length).padStart(2, "0")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes kenburns {
          0% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
