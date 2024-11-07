"use client";
import Image from "next/image";
import Link from "next/link";
import { BiSearch } from "react-icons/bi";

const SearchResults = ({ searchResults, loading, onClose }) => (
  <div className="px-4 py-6 overflow-y-auto flex-1">
    {loading ? (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 mb-4"></div>
            <div className="h-4 bg-gray-200 w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 w-1/2"></div>
          </div>
        ))}
      </div>
    ) : searchResults.length > 0 ? (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {searchResults.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            onClick={onClose}
            className="group block"
          >
            <div className="aspect-[3/4] bg-white mb-4 overflow-hidden shadow-md">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={300}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BiSearch className="text-gray-400 text-xl" />
                </div>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-sm uppercase tracking-wider mb-2 font-luxury">
                {product.name}
              </h3>
              <div className="flex items-center justify-center gap-3 text-sm">
                {product.original_price && (
                  <span className="text-gray-400 line-through">
                    ${parseFloat(product.original_price).toFixed(2)}
                  </span>
                )}
                <span className="text-red-500">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <p className="text-gray-500 font-luxury">No products found</p>
      </div>
    )}
  </div>
);

export default SearchResults;
