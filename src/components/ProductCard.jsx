import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Trash2, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';

// Tasa de cambio: 1 USD = 36.5 Córdobas nicaragüenses
const USD_TO_NIO = 36.5;

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onOpenDetail,
  onAddToCart,
  isAdmin,
  onDelete,
  onEdit
}) {
  const { name, price, originalPrice, category, rating } = product;

  // Handle Supabase structure vs Fallback static data
  const variants = product.product_variants || [];
  const hasVariants = variants.length > 0;

  // Track active color variant index
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const activeVariant = hasVariants ? variants[activeVariantIdx] : null;

  // Active image & colors
  const displayImage = activeVariant ? activeVariant.image_url : (product.image || '/images/trench_coat.png');

  // Available sizes for the active variant
  const availableSizes = activeVariant ? activeVariant.sizes : (product.sizes || []);
  const [selectedSize, setSelectedSize] = useState(null);

  // Auto-select first size if none is selected
  const activeSize = selectedSize && availableSizes.includes(selectedSize)
    ? selectedSize 
    : (availableSizes[0] || 'Única');

  // Calculate discount percentage
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  // Calculate total product stock
  const totalStock = hasVariants 
    ? variants.reduce((acc, variant) => {
        const sizesStock = Object.values(variant.stock_by_size || {}).reduce((sAcc, s) => sAcc + Number(s), 0);
        return acc + sizesStock;
      }, 0)
    : 999;
  const isCompletelyOut = hasVariants && totalStock === 0;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (isCompletelyOut) return;
    
    const selectedColorObj = null;

    onAddToCart(product, 1, activeSize, selectedColorObj);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`group flex flex-col w-full relative ${isCompletelyOut ? 'opacity-80 grayscale-[30%]' : ''}`}
    >
      {/* Image Showcase */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-900/50 transition-colors">
        
        {/* Out of Stock Badge */}
        {isCompletelyOut ? (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-zinc-950/80 text-white text-xs sm:text-sm font-bold px-6 py-2 uppercase tracking-[0.2em] shadow-2xl backdrop-blur-sm whitespace-nowrap rotate-[-5deg]">
            Agotado
          </div>
        ) : discount > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
            -{discount}%
          </span>
        )}

        {/* Favorite Button */}
        {!isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
            className="absolute top-3 right-3 z-10 p-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-full text-zinc-600 dark:text-zinc-300 hover:text-rose-500 dark:hover:text-rose-400 hover:scale-110 active:scale-95 transition-all shadow-sm cursor-pointer"
            aria-label="Add to favorites"
          >
            <Heart size={16} fill={isFavorite ? '#f43f5e' : 'none'} className={isFavorite ? 'text-rose-500' : ''} />
          </button>
        )}

        {/* Admin Actions Bar */}
        {isAdmin && (
          <div className="absolute top-3 right-12 z-10 flex gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center"
              title="Editar producto"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product.id);
              }}
              className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center"
              title="Eliminar producto"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}

        {/* Product Image */}
        <img
          src={displayImage}
          alt={name}
          className="h-full w-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out cursor-pointer"
          onClick={() => onOpenDetail(product)}
        />

        {/* Quick View Hover Bar */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden sm:block bg-gradient-to-t from-black/50 to-transparent">
          <button
            onClick={() => onOpenDetail(product)}
            className="w-full bg-[#FAF9F6] text-[#0A0A0A] hover:bg-[#FAF9F6]/95 text-xs font-semibold py-2.5 uppercase tracking-widest rounded-none shadow-md cursor-pointer transition-colors"
          >
            Vista Rápida
          </button>
        </div>
      </div>

      {/* Product Details Info */}
      <div className="mt-4 flex flex-col flex-grow text-left space-y-1">
        
        {/* Category & Rating */}
        

        {/* Name */}
        <h3 
          onClick={() => onOpenDetail(product)}
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-500 dark:hover:text-zinc-400 cursor-pointer line-clamp-1 transition-colors uppercase tracking-wide"
        >
          {name}
        </h3>

        {/* Image Variants Thumbnails */}
        {hasVariants && variants.length > 1 && (
          <div className="flex gap-1.5 py-1">
            {variants.map((variant, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveVariantIdx(idx);
                }}
                className={`w-6 h-8 rounded-sm border overflow-hidden transition-all cursor-pointer ${
                  activeVariantIdx === idx
                    ? 'border-black dark:border-white scale-110 shadow-sm z-10'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 opacity-70 hover:opacity-100'
                }`}
                title="Ver esta variante"
              >
                <img src={variant.image_url} alt={`Variante ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Interactive Sizes selection bar directly on the card! */}
        <div className="flex flex-wrap gap-1 py-1">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSize(size);
              }}
              className={`text-[9px] font-bold px-1.5 py-0.5 border cursor-pointer transition-all ${
                activeSize === size
                  ? 'bg-black text-[#FAF9F6] border-black dark:bg-white dark:text-zinc-950 dark:border-white font-bold'
                  : 'border-zinc-200 dark:border-zinc-850 text-zinc-450 hover:border-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Price & Add to Cart button */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-zinc-950 dark:text-white">
                ${price.toFixed(2)} USD
              </span>
              {originalPrice && (
                <span className="text-xs text-zinc-400 dark:text-zinc-650 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-light">
              C${(price * USD_TO_NIO).toFixed(0)} NIO
            </span>
          </div>

          {!isAdmin && (
            <button
              onClick={handleQuickAdd}
              className="p-2 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-full cursor-pointer transition-all duration-300 flex items-center gap-1 text-[10px] uppercase font-bold"
              aria-label="Add to cart"
            >
              <ShoppingBag size={12} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
