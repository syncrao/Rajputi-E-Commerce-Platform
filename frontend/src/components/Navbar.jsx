import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
  UserIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";

const navigation = {
  pages: [
    { name: "Products", href: "/products/all" },
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
  const dispatch = useDispatch()

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
    <div className="bg-brand-contentBg text-brand-secondaryText">
      {/* Mobile Menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-brand-black/40" />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-brand-contentBg pb-12 shadow-xl">

            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 text-brand-liteGray hover:text-brand-black"
              >
                <XMarkIcon className="size-6" />
              </button>
            </div>

               <div className="space-y-6 border-t border-brand-liteGray/30 px-4 py-6">
              {authTokens ? (
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-2 text-sm font-medium text-brand-secondaryText hover:text-brand-primary"
                >
                  <UserIcon className="size-6 text-brand-liteGray" />
                  <span>Profile</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="block p-2 font-medium text-brand-title hover:text-brand-primary"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="block p-2 font-medium text-brand-title hover:text-brand-primary"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>

            <div className="space-y-6 border-t border-brand-liteGray/30 px-4 py-6">
              {navigation.pages.map((page) => (
                <Link
                  key={page.name}
                  to={page.href}
                  onClick={() => setOpen(false)}
                  className="block p-2 font-medium text-brand-title hover:text-brand-primary"
                >
                  {page.name}
                </Link>
              ))}
            </div>

     

            {authTokens && (
              <div className="mt-auto px-4 pb-6">
                <button
                  onClick={() => {
                    dispatch(logout());
                    setOpen(false);
                  }}
                  className="w-full bg-red-500 text-brand-primaryText font-semibold py-3 rounded-xl shadow-lg hover:bg-brand-highlight transition duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop Navbar */}
      <div className="border-b border-brand-liteGray/30 w-full z-10 fixed top-0 left-0 bg-brand-contentBg">
        <header className="relative">
          <nav
            aria-label="Top"
            className="px-4 sm:px-6 lg:px-8 transition-all duration-100"
          >
            <div className="flex h-14 items-center relative">
              {/* Mobile buttons */}
              <div className="flex items-center lg:hidden">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="p-2 text-brand-liteGray hover:text-brand-black"
                >
                  <Bars3Icon className="size-6" />
                </button>

                <button
                  className="ml-2 p-2 text-brand-liteGray hover:text-brand-black"
                  onClick={() => setSearchOpen((s) => !s)}
                >
                  <MagnifyingGlassIcon className="size-6" />
                </button>
              </div>

              {/* Logo */}
              <div className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:translate-x-0">
                <Link
                  to="/"
                  className="text-lg font-bold text-brand-title tracking-wide"
                >
                  Raj Suits
                </Link>
              </div>

              {/* Navigation links */}
              <div className="hidden lg:flex lg:items-center lg:space-x-8 ml-8">
                {navigation.pages.map((page) => (
                  <Link
                    key={page.name}
                    to={page.href}
                    className="text-sm text-brand-subtext hover:text-brand-primary transition"
                  >
                    {page.name}
                  </Link>
                ))}
              </div>

              {/* Right-side icons */}
              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:ml-6">
                  <button
                    className="p-2 text-brand-liteGray hover:text-brand-black"
                    onClick={() => setSearchOpen((s) => !s)}
                  >
                    <MagnifyingGlassIcon className="size-6" />
                  </button>
                </div>

                <div className="ml-4">
                  <Link to="/wishlist">
                    <HeartIcon className="size-6 text-brand-liteGray hover:text-red-700 transition" />
                  </Link>
                </div>

                <Link to="/cart" className="ml-4 relative">
                  <ShoppingBagIcon className="size-6 text-brand-liteGray hover:text-brand-black" />
                  <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[12px] font-bold text-brand-primaryText">
                    {cartItems.length}
                  </span>
                </Link>

                {authTokens && (
                  <div className="hidden lg:flex ml-4">
                    <Link to="/profile">
                      <UserIcon className="size-6 text-brand-liteGray hover:text-brand-black" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Search dropdown */}
          {searchOpen && (
            <div className="absolute left-0 right-0 bg-brand-contentBg border-t border-brand-liteGray/30 shadow-lg px-4 sm:px-6 lg:px-8 z-50">
              <div className="max-w-3xl mx-auto py-2 relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full p-2 border border-brand-liteGray rounded-md focus:ring-2 focus:ring-brand-primary outline-none"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-liteGray hover:text-brand-black"
                >
                  <XMarkIcon className="size-5" />
                </button>

                {query && (
                  <div className="absolute mt-2 w-full bg-brand-contentBg border border-brand-liteGray rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    {filtered.length > 0 ? (
                      filtered.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="flex items-center gap-3 p-2 hover:bg-brand-secondary transition"
                          onClick={() => {
                            setSearchOpen(false);
                            setQuery("");
                          }}
                        >
                          <img
                            src={
                              product.images.find((img) => img.is_main)
                                ?.image || product.images[0]?.image
                            }
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-md"
                          />
                          <div>
                            <p className="text-sm font-medium text-brand-title">
                              {product.name}
                            </p>
                            <p className="text-xs text-brand-subtext">
                              ₹{product.price} | {product.category}
                            </p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-center text-brand-subtext p-3">
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

      {/* Spacer to avoid overlap */}
      <div className="h-14" />
    </div>
  );
}
