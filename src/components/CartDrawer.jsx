import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, Anchor, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Tasa de cambio: 1 USD = 36.5 Córdobas nicaragüenses
const USD_TO_NIO = 36.5;

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onCheckout
}) {
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0); // in percent
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'MINIMAL10') {
      setPromoDiscount(10);
      setPromoApplied(true);
      setPromoError('');
    } else if (promoCode.trim().toUpperCase() === 'SHEIN20') {
      setPromoDiscount(20);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Código de cupón inválido. Verifica e intenta de nuevo.');
      setTimeout(() => setPromoError(''), 3000);
    }
  };

  const shippingCost = 0;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * promoDiscount) / 100;
  const total = subtotal - discountAmount + shippingCost;

  // Córdoba conversions
  const subtotalNIO = subtotal * USD_TO_NIO;
  const totalNIO = total * USD_TO_NIO;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/55 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="w-screen max-w-md bg-[#FAF9F6] dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-100 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="px-4 sm:px-6 py-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-zinc-800 dark:text-zinc-200" />
                  <h2 className="text-lg font-light tracking-widest uppercase text-zinc-900 dark:text-white">
                    Bolsa de Compra
                  </h2>
                  <span className="text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold px-2 py-0.5 rounded-full">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto py-4 px-4 sm:px-6 divide-y divide-zinc-200 dark:divide-zinc-800">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-4 bg-zinc-100 dark:bg-zinc-950 rounded-full border border-zinc-200 dark:border-zinc-800">
                      <ShoppingBag size={32} className="text-zinc-400 dark:text-zinc-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold tracking-wide">Tu bolsa está vacía</p>
                      <p className="text-xs text-zinc-500 font-light">Agrega algunas de nuestras hermosas prendas para comenzar.</p>
                    </div>
                    <button
                      onClick={onClose}
                      className="bg-black dark:bg-white text-[#FAF9F6] dark:text-[#0A0A0A] hover:bg-zinc-800 dark:hover:bg-zinc-200 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest cursor-pointer"
                    >
                      Continuar Comprando
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const variant = item.product_variants?.find(v => v.color_name === item.selectedColor?.name);
                    const currentStock = variant?.stock_by_size?.[item.selectedSize] ?? 999;

                    return (
                      <div key={`${item.id}-${item.selectedSize}-${item.selectedColor?.name}`} className="py-4 flex gap-4">
                        {/* Image Thumbnail */}
                        <div className="w-20 aspect-[3/4] bg-zinc-100 dark:bg-zinc-950 overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover object-center"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>

                        {/* Info & Quantity controls */}
                        <div className="flex-1 flex flex-col justify-between text-left">
                          <div className="space-y-0.5">
                            <div className="flex justify-between">
                              <h3 className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-white line-clamp-1 uppercase tracking-wide">
                                {item.name}
                              </h3>
                              <div className="pl-2 text-right">
                                <span className="text-xs sm:text-sm font-semibold text-zinc-950 dark:text-white block">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                                  C${(item.price * item.quantity * USD_TO_NIO).toFixed(0)}
                                </span>
                              </div>
                            </div>

                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                              Talla: <span className="text-zinc-700 dark:text-zinc-300 font-bold mr-3">{item.selectedSize}</span>
                              Color: <span className="text-zinc-700 dark:text-zinc-300 font-bold">{item.selectedColor?.name}</span>
                            </p>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                              ${item.price.toFixed(2)} c/u
                            </p>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-zinc-200 dark:border-zinc-800">
                              <button
                                onClick={() => onUpdateQty(item.id, item.selectedSize, item.selectedColor?.name, item.quantity - 1)}
                                className="px-2.5 py-1 text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="w-6 text-center text-xs font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => {
                                  if (item.quantity < currentStock) {
                                    onUpdateQty(item.id, item.selectedSize, item.selectedColor?.name, item.quantity + 1);
                                  }
                                }}
                                disabled={item.quantity >= currentStock}
                                className={`px-2.5 py-1 ${item.quantity >= currentStock ? 'text-zinc-300 dark:text-zinc-800 cursor-not-allowed' : 'text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer'}`}
                                aria-label="Increase quantity"
                              >
                                <Plus size={10} />
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(item.id, item.selectedSize, item.selectedColor?.name)}
                              className="text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 p-1 cursor-pointer transition-colors"
                              aria-label="Delete item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Summary & Checkout */}
              {cartItems.length > 0 && (
                <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-950/40 space-y-4">

                  {/* Coupon Area */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Ingresa tu código de cupón"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={promoApplied}
                        className="w-full text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 py-2.5 pl-8 pr-3 focus:outline-none focus:border-black dark:focus:border-white rounded-none disabled:bg-zinc-100 dark:disabled:bg-zinc-800 text-zinc-950 dark:text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={promoApplied}
                      className="bg-zinc-900 dark:bg-zinc-100 hover:bg-black dark:hover:bg-white text-white dark:text-zinc-950 text-xs px-4 py-2.5 font-bold uppercase tracking-wider disabled:opacity-55 cursor-pointer transition-all"
                    >
                      Aplicar
                    </button>
                  </form>

                  {/* Coupon feedback */}
                  {promoApplied && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium text-left">
                      ✓ Cupón aplicado con éxito. Descuento del {promoDiscount}% incluido.
                    </p>
                  )}
                  {promoError && (
                    <p className="text-[11px] text-rose-500 font-medium text-left">✗ {promoError}</p>
                  )}

                  {/* Calculations breakdown */}
                  <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-light">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <div className="text-right">
                        <span className="font-medium text-zinc-900 dark:text-white block">${subtotal.toFixed(2)} USD</span>
                        <span className="text-[10px] text-zinc-400">C${subtotalNIO.toFixed(0)} NIO</span>
                      </div>
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                        <span>Descuento ({promoDiscount}%)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}


                    <div className="flex justify-between text-sm text-zinc-900 dark:text-white font-bold pt-2 border-t border-zinc-200 dark:border-zinc-800">
                      <span>Total estimado</span>
                      <div className="text-right">
                        <span className="block">${total.toFixed(2)} USD</span>
                        <span className="text-[10px] font-normal text-zinc-400">C${totalNIO.toFixed(0)} NIO</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    onClick={() => {
                      onClose();
                      onCheckout(total, promoDiscount, 'none', 0);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-colors active:scale-[0.98]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      width="14"
                      height="14"
                      fill="currentColor"
                    >
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                    Pedir por WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
