"use client";
import { useState, useRef, useEffect } from "react";
import {
  BiSearch,
  BiUser,
  BiShoppingBag,
  BiX,
  BiLogOut,
  BiHistory,
} from "react-icons/bi";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import SearchOverlay from "@/components/search/SearchOverlay";
import SearchResults from "@/components/search/SearchResults";
import CartModal from "@/components/cart/CartModal";
import { useSearch } from "@/hooks/useSearch";
import useCartStore from "@/store/cartStore";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const profileMenuRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const getItemCount = useCartStore((state) => state.getItemCount);

  useEffect(() => {
    setMounted(true);

    // Close profile menu when clicking outside
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    setSearchResults,
  } = useSearch();

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
    setIsProfileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className="bg-black border-b font-luxury sticky top-0 z-50 border-gray-700">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <span className="md:text-xl font-script text-sm text-gold">
                  OpulenceTies
                </span>
              </Link>
            </div>

            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-white hover:text-gold">
                Home
              </Link>
              <Link href="/about" className="text-white hover:text-gold">
                About Us
              </Link>
              <Link href="/product" className="text-white hover:text-gold">
                Shop
              </Link>
              <Link href="/" className="text-white hover:text-gold">
                Custom
              </Link>
              <Link href="/contact" className="text-white hover:text-gold">
                Contact
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <BiSearch
                onClick={() => setIsSearchOpen(true)}
                className="h-6 w-6 text-white hover:text-gold cursor-pointer"
              />

              <div
                className="relative cursor-pointer"
                onClick={() => setIsCartOpen(true)}
              >
                <BiShoppingBag className="h-6 w-6 text-white hover:text-gold" />
                {mounted && items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {getItemCount()}
                  </span>
                )}
              </div>

              {/* Auth Menu */}
              <div className="relative" ref={profileMenuRef}>
                {session ? (
                  <div className="flex items-center">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center"
                    >
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || ""}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <BiUser className="h-6 w-6 text-white hover:text-gold" />
                      )}
                    </button>

                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 top-8 bg-white rounded-md shadow-lg py-1 z-50">
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm text-gray-700">Signed in as</p>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {session.user.email}
                          </p>
                        </div>

                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Profile
                        </Link>

                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <div className="flex items-center">
                            <BiHistory className="mr-2" />
                            Order History
                          </div>
                        </Link>

                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <div className="flex items-center">
                            <BiLogOut className="mr-2" />
                            Sign Out
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login" className="text-white hover:text-gold">
                    Sign In
                  </Link>
                )}
              </div>

              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gold focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={
                        isOpen
                          ? "M6 18L18 6M6 6l12 12"
                          : "M4 6h16M4 12h16m-7 6h7"
                      }
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden ${
            isOpen ? "block" : "hidden"
          } bg-black border-t border-gray-700`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gold"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gold"
              onClick={closeMobileMenu}
            >
              About us
            </Link>
            <Link
              href="/product"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gold"
              onClick={closeMobileMenu}
            >
              Shop
            </Link>
            <Link
              href=""
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gold"
              onClick={closeMobileMenu}
            >
              Custom
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gold"
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
            {session && (
              <>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gold"
                  onClick={closeMobileMenu}
                >
                  Profile
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gold"
                  onClick={closeMobileMenu}
                >
                  Order History
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    closeMobileMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:text-gold"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <SearchOverlay isOpen={isSearchOpen} onClose={handleCloseSearch}>
        <div className="flex flex-col h-full">
          <div className="border-b sticky top-0 bg-white z-10">
            <div className="max-w-[1380px] mx-auto">
              <div className="flex items-center px-4 py-4">
                <BiSearch className="text-gray-400 w-6 h-6" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH..."
                  className="flex-1 px-4 text-lg focus:outline-none font-luxury"
                />
                <button
                  onClick={handleCloseSearch}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <BiX className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-[1380px] mx-auto">
              <SearchResults
                searchResults={searchResults}
                loading={loading}
                onClose={handleCloseSearch}
              />
            </div>
          </div>
        </div>
      </SearchOverlay>
    </>
  );
}
