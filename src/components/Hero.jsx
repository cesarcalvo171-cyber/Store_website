import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const USD_TO_NIO = 36.5;

export default function Hero({ onExploreClick, featuredProducts = [], settings = {}, onOpenDetail }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const hasFeatured = featuredProducts && featuredProducts.length > 0;

  // Auto-play slideshow every 1.25 seconds
  useEffect(() => {
    if (!hasFeatured || featuredProducts.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % featuredProducts.length);
    }, 1250);

    return () => clearInterval(interval);
  }, [featuredProducts, hasFeatured]);

  // Reset index if featured products list changes length
  useEffect(() => {
    setCurrentIdx(0);
  }, [featuredProducts.length]);

  // Determine active product & image
  const activeProduct = hasFeatured ? featuredProducts[currentIdx] : null;
  const displayImage = activeProduct?.product_variants?.[0]?.image_url || activeProduct?.image || '/images/trench_coat.png';

  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left z-10">
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-500">
                Colección Exclusiva AURA
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-zinc-950 dark:text-white leading-tight uppercase">
                {settings?.hero_title || 'Estética Esencial'}
              </h1>
            </div>
            
            <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base font-light leading-relaxed max-w-xl">
              {settings?.hero_subtitle || 'Líneas puras, cortes contemporáneos y tonos neutros. Una curaduría de prendas versátiles diseñadas para integrarse sin esfuerzo en tu armario diario.'}
            </p>
            
            <div className="pt-2">
              <button
                onClick={onExploreClick}
                className="group relative inline-flex items-center gap-3 bg-[#0A0A0A] dark:bg-[#FAF9F6] hover:bg-zinc-800 dark:hover:bg-white text-[#FAF9F6] dark:text-[#0A0A0A] px-6 sm:px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] rounded-none transition-all duration-300 shadow-lg cursor-pointer"
              >
                {settings?.hero_cta || 'Explorar Colección'}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Micro details / Brand values */}
            <div className="pt-8 border-t border-zinc-200 dark:border-zinc-900 grid grid-cols-3 gap-4 text-[10px] sm:text-xs font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
              <div>
                <p className="font-bold text-zinc-800 dark:text-zinc-200">01 / CALIDAD</p>
                <p className="font-light mt-0.5">Tejidos selectos</p>
              </div>
              <div>
                <p className="font-bold text-zinc-800 dark:text-zinc-200">02 / CORTE</p>
                <p className="font-light mt-0.5">Ajuste perfecto</p>
              </div>
              <div>
                <p className="font-bold text-zinc-800 dark:text-zinc-200">03 / DISEÑO</p>
                <p className="font-light mt-0.5">Estilo atemporal</p>
              </div>
            </div>
          </div>

          {/* Visual Showcase (Featured Slideshow Image with overlay info card) */}
          <div className="lg:col-span-6 relative flex justify-center">
            {/* Background decorative shape */}
            <div className="absolute inset-4 -right-2 -bottom-2 bg-zinc-200 dark:bg-zinc-900 border border-zinc-300/40 dark:border-zinc-800/40 transition-colors duration-300"></div>

            {hasFeatured ? (
              /* Image Container — only shown when there ARE featured products */
              <div className="relative w-full max-w-md aspect-[4/5] overflow-hidden border border-zinc-200 dark:border-zinc-900/50 shadow-xl transition-all duration-300 hover:shadow-2xl bg-zinc-100 dark:bg-zinc-900">
                <img
                  src={displayImage}
                  alt={activeProduct.name}
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 cursor-pointer"
                  onClick={() => onOpenDetail && onOpenDetail(activeProduct)}
                />

                {/* Details card floating on slide */}
                <div
                  className="absolute bottom-4 left-4 bg-[#FAF9F6]/90 dark:bg-zinc-900/90 backdrop-blur-sm p-4 border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer hover:bg-white dark:hover:bg-zinc-900"
                  onClick={() => onOpenDetail && onOpenDetail(activeProduct)}
                >
                  <p className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-500">
                    Destacado
                  </p>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white uppercase mt-0.5">
                    {activeProduct.name}
                  </p>
                  <div className="flex flex-col mt-1 font-mono">
                    <span className="text-xs font-semibold text-zinc-950 dark:text-white">
                      ${activeProduct.price.toFixed(2)} USD
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-500 font-light">
                      C${(activeProduct.price * USD_TO_NIO).toFixed(0)} NIO
                    </span>
                  </div>
                </div>

                {/* Slideshow Navigation Dots */}
                {featuredProducts.length > 1 && (
                  <div className="absolute bottom-4 right-4 flex gap-1.5 bg-black/45 backdrop-blur-sm px-2.5 py-1.5 rounded-full z-10">
                    {featuredProducts.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIdx(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                          currentIdx === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Empty state — no featured products yet */
              <div className="relative w-full max-w-md aspect-[4/5] border border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 text-center px-8">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 dark:text-zinc-500">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Sin destacados</p>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-light mt-1 leading-relaxed">
                    Marca productos como "Destacado" desde el panel de administrador para que aparezcan aquí.
                  </p>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}
