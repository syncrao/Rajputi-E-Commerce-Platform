import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
  UserIcon,
  HeartIcon, // <-- Added HeartIcon
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";

const navigation = {
  pages: [{ name: "Products", href: "/products" }],
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { authTokens } = useSelector((state) => state.auth);

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Mobile nav links */}
            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <Link
                    to={page.href}
                    onClick={() => setOpen(false)}
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    {page.name}
                  </Link>
                </div>
              ))}
            </div>

            {/* Mobile auth */}
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
                  <div className="flow-root">
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      Sign in
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      Create account
                    </Link>
                  </div>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Top bar */}
      <div className="border-b border-gray-200">
        <header className="relative bg-white">
          <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
            Get free delivery on orders over ₹499
          </p>

          <nav
            aria-label="Top"
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <div className="flex h-14 items-center">
              {/* Mobile menu + Search (left side) */}
              <div className="flex items-center lg:hidden">
                {/* Menu toggle */}
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="relative rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon aria-hidden="true" className="size-6" />
                </button>

                {/* Search (mobile only) */}
                <button className="ml-2 p-2 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Search</span>
                  <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Logo + Products (desktop) */}
              <div className="flex flex-1 items-center justify-center lg:justify-start space-x-8">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                  SyncRao
                </Link>

                {/* Products (desktop only) */}
                <div className="hidden lg:flex space-x-8">
                  {navigation.pages.map((page) => (
                    <Link
                      key={page.name}
                      to={page.href}
                      className="text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right side */}
              <div className="ml-auto flex items-center">
                {/* Auth */}
                <div className="hidden lg:flex lg:items-center lg:space-x-6">
                  {authTokens ? (
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      <UserIcon className="size-6 text-gray-500" />
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      Sign in
                    </Link>
                  )}
                </div>

                {/* Search (desktop only) */}
                <div className="hidden lg:flex lg:ml-6">
                  <button className="p-2 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon
                      aria-hidden="true"
                      className="size-6"
                    />
                  </button>
                </div>

                {/* Favorites */}
                <div className="ml-4 flow-root lg:ml-6">
                  <button className="group -m-2 flex items-center p-2">
                    <HeartIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-gray-400 group-hover:text-red-500"
                    />
                  </button>
                </div>

                {/* Cart */}
                <div className="ml-4 mb-1 flow-root lg:ml-6 relative">
                  <button className="group -m-2 flex items-center p-2 relative">
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                    {/* Badge */}
                    <span className="absolute -top-0 -right-0 flex h-3 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                      {91}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </header>
      </div>
    </div>
  );
}
