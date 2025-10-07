import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
  UserIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";

const navigation = {
  pages: [
    { name: "Products", href: "/products" },
    { name: "My Orders", href: "/orders" },
  ],
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { authTokens } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.products);
  const navigate = useNavigate();

  // Filter products by query
  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower) ||
        p.fabric.toLowerCase().includes(lower)
    );
  }, [query, products]);

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 text-gray-400"
              >
                <XMarkIcon className="size-6" />
              </button>
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <Link
                  key={page.name}
                  to={page.href}
                  onClick={() => setOpen(false)}
                  className="block p-2 font-medium text-gray-900"
                >
                  {page.name}
                </Link>
              ))}
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {authTokens ? (
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  <UserIcon className="size-6 text-gray-500" />
                  <span>Profile</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="block p-2 font-medium text-gray-900"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="block p-2 font-medium text-gray-900"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Navbar */}
      <div className="border-b border-gray-200 w-full z-10 fixed top-0 left-0 bg-white">
        <header className="relative bg-white">
          <p className="flex h-6 items-center justify-center border-b px-4 text-sm text-gray-600">
            Get free delivery on orders over ₹499
          </p>

          <nav
            aria-label="Top"
            className="px-4 sm:px-6 lg:px-8 transition-all duration-100"
          >
            <div className="flex h-14 items-center relative">
              {/* Left section for mobile */}
              <div className="flex items-center lg:hidden">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="p-2 text-gray-400"
                >
                  <Bars3Icon className="size-6" />
                </button>

                <button
                  className="ml-2 p-2 text-gray-400 hover:text-gray-500"
                  onClick={() => setSearchOpen((s) => !s)}
                >
                  <MagnifyingGlassIcon className="size-6" />
                </button>
              </div>

              {/* Centered logo for mobile */}
              <div className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:translate-x-0">
                <Link to="/" className="text-lg font-semibold text-gray-800">
                  SyncRao
                </Link>
              </div>

              {/* Desktop Nav Links */}
              <div className="hidden lg:flex lg:items-center lg:space-x-8 ml-8">
                {navigation.pages.map((page) => (
                  <Link
                    key={page.name}
                    to={page.href}
                    className="text-sm text-gray-500 hover:text-gray-800"
                  >
                    {page.name}
                  </Link>
                ))}
              </div>

              {/* Right section */}
              <div className="ml-auto flex items-center">
                {/* Desktop search button */}
                <div className="hidden lg:flex lg:ml-6">
                  <button
                    className="p-2 text-gray-500 hover:text-gray-800"
                    onClick={() => setSearchOpen((s) => !s)}
                  >
                    <MagnifyingGlassIcon className="size-6" />
                  </button>
                </div>

                {/* Wishlist */}
                <div className="ml-4">
                  <Link to="/wishlist">
                    <HeartIcon className="size-6 text-gray-500 hover:text-red-800" />
                  </Link>
                </div>

                {/* Cart */}
                <Link to="/cart" className="ml-4 relative">
                  <ShoppingBagIcon className="size-6 text-gray-500 hover:text-gray-800" />
                  <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[12px] font-bold text-white">
                    {cartItems.length}
                  </span>
                </Link>

                {/* Desktop profile only */}
                {authTokens && (
                  <div className="hidden lg:flex ml-4">
                    <Link to="/profile">
                      <UserIcon className="size-6 text-gray-500 hover:text-gray-800" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Search dropdown */}
          {searchOpen && (
            <div className="absolute left-0 right-0 bg-white border-t shadow-lg px-4 sm:px-6 lg:px-8 z-50">
              <div className="max-w-3xl mx-auto py-2 relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                >
                  <XMarkIcon className="size-5" />
                </button>

                {query && (
                  <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    {filtered.length > 0 ? (
                      filtered.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="flex items-center gap-3 p-2 hover:bg-gray-100"
                          onClick={() => {
                            setSearchOpen(false);
                            setQuery("");
                          }}
                        >
                          <img
                            src={
                              product.images.find((img) => img.is_main)?.image ||
                              product.images[0]?.image
                            }
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-md"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ₹{product.price} | {product.category}
                            </p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 p-3">
                        No results found for “{query}”
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </header>
      </div>

      <div className="h-20" />
    </div>
  );
}
