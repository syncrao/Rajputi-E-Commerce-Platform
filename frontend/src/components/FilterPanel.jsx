import { useState } from "react";
import { X } from "lucide-react";

export default function FilterPanel({
  show,
  onClose,
  selectedCategory,
  setSelectedCategory,
  selectedPrice,
  setSelectedPrice,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
}) {
  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-72 bg-brand-contentBg shadow-xl p-6 z-50 transform transition-transform duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-brand-title">Filter</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-brand-secondary transition"
          >
            <X className="w-5 h-5 text-brand-title" />
          </button>
        </div>

        {/* Category */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-brand-title mb-2">Category</h3>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border border-brand-liteGray rounded p-2 text-sm"
          >
            <option value="all">All</option>
            <option value="lehenga">Lehengas</option>
            <option value="saree">Sarees</option>
            <option value="kurti">Kurtis</option>
          </select>
        </div>

        {/* Price */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-brand-title mb-2">Price Range</h3>
          <div className="flex gap-2">
            <input
              type="number"
              value={selectedPrice[0]}
              onChange={(e) => setSelectedPrice([+e.target.value, selectedPrice[1]])}
              placeholder="Min"
              className="w-1/2 border border-brand-liteGray rounded p-2 text-sm"
            />
            <input
              type="number"
              value={selectedPrice[1]}
              onChange={(e) => setSelectedPrice([selectedPrice[0], +e.target.value])}
              placeholder="Max"
              className="w-1/2 border border-brand-liteGray rounded p-2 text-sm"
            />
          </div>
        </div>

        {/* Size */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-brand-title mb-2">Size</h3>
          <div className="flex flex-wrap gap-2">
            {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 border rounded text-sm transition ${
                  selectedSize === size
                    ? "bg-brand-primary text-brand-primaryText"
                    : "border-brand-liteGray hover:bg-brand-secondary"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-brand-title mb-2">Color</h3>
          <div className="flex flex-wrap gap-2">
            {["Red", "Blue", "Green", "Black"].map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-3 py-1 border rounded text-sm transition ${
                  selectedColor === color
                    ? "bg-brand-primary text-brand-primaryText"
                    : "border-brand-liteGray hover:bg-brand-secondary"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedPrice([0, 5000]);
              setSelectedSize("");
              setSelectedColor("");
            }}
            className="px-4 py-2 border border-brand-liteGray rounded text-sm hover:bg-brand-secondary transition"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-primary text-brand-primaryText rounded text-sm hover:bg-brand-black transition"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}
