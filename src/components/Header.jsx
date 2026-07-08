import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Sun, Moon, Menu, X, Check, ChevronDown } from 'lucide-react';
import { MENU_STRUCTURE } from '../data/products';

export default function Header({
  cartCount,
  favoritesCount,
  onOpenCart,
  onOpenFavorites,
  darkMode,
  setDarkMode,
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategory,
  setSelectedCategory,
  isAdmin
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Banner Message */}
     

      {/* Main Navbar */}
      <div className="w-full bg-[#FAF9F6]/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/60 dark:border-zinc-900/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo & Mobile Trigger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <a href="#" className="text-2xl sm:text-3xl font-light tracking-[0.25em] text-zinc-900 dark:text-white uppercase select-none">
              AURA
            </a>
          </div>

          {/* Desktop Categories Menu */}
          <nav className="hidden lg:flex space-x-6 text-sm font-medium tracking-widest uppercase items-center">
            <button
              onClick={() => setSelectedCategory('Todos')}
              className={`pb-1 border-b transition-all duration-300 cursor-pointer ${
                selectedCategory === 'Todos'
                  ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Inicio
            </button>
            {Object.keys(MENU_STRUCTURE).map((mainCat) => {
              const subcats = MENU_STRUCTURE[mainCat];
              const hasSubs = subcats && subcats.length > 0;
              const isActive = selectedCategory === mainCat || selectedCategory.startsWith(`${mainCat} -`);

              return (
                <div key={mainCat} className="relative group">
                  <button
                    onClick={() => {
                      if (!hasSubs) setSelectedCategory(mainCat);
                    }}
                    className={`flex items-center gap-1 pb-1 border-b transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white'
                        : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {mainCat}
                    {hasSubs && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
                  </button>
                  
                  {hasSubs && (
                    <div className="absolute left-0 top-full pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl min-w-[200px] py-2 flex flex-col">
                        <button
                          onClick={() => setSelectedCategory(mainCat)}
                          className={`text-left px-4 py-2 text-xs uppercase tracking-wider hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                            selectedCategory === mainCat ? 'font-bold text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          Ver Todo {mainCat}
                        </button>
                        <div className="my-1 border-t border-zinc-100 dark:border-zinc-800"></div>
                        {subcats.map(sub => {
                          const fullCat = `${mainCat} - ${sub}`;
                          return (
                            <button
                              key={sub}
                              onClick={() => setSelectedCategory(fullCat)}
                              className={`text-left px-4 py-2 text-xs uppercase tracking-wider hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                                selectedCategory === fullCat ? 'font-bold text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400'
                              }`}
                            >
                              {sub}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Actions & Search */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search toggler / input */}
            <div className="relative flex items-center">
              {showSearch ? (
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-200/55 dark:border-zinc-800">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar ropa..."
                    className="bg-transparent text-xs w-28 sm:w-44 focus:outline-none text-zinc-950 dark:text-white"
                    autoFocus
                  />
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearch(false);
                    }}
                    className="text-zinc-400 hover:text-zinc-800 dark:hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Favorites Icon */}
            {!isAdmin && (
              <button
                onClick={onOpenFavorites}
                className="relative text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
                aria-label="Favorites"
              >
                <Heart size={18} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold scale-100 animate-pulse">
                    {favoritesCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart Icon */}
            {!isAdmin && (
              <button
                onClick={onOpenCart}
                className="relative text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black dark:bg-white text-[#FAF9F6] dark:text-[#0A0A0A] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold transition-colors">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-900 bg-[#FAF9F6] dark:bg-zinc-950 px-4 py-4 space-y-2 transition-all duration-300 max-h-[70vh] overflow-y-auto">
            <button
              onClick={() => {
                setSelectedCategory('Todos');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-3 px-3 rounded-lg text-sm tracking-wide uppercase flex justify-between items-center ${
                selectedCategory === 'Todos'
                  ? 'bg-zinc-200/50 dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50'
              }`}
            >
              Inicio
              {selectedCategory === 'Todos' && <Check size={14} className="text-zinc-900 dark:text-white" />}
            </button>
            
            {Object.keys(MENU_STRUCTURE).map((mainCat) => {
              const subcats = MENU_STRUCTURE[mainCat];
              const hasSubs = subcats && subcats.length > 0;
              
              return (
                <div key={mainCat} className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(mainCat);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2 px-3 rounded-lg text-sm tracking-wide uppercase font-bold flex justify-between items-center ${
                      selectedCategory === mainCat
                        ? 'text-zinc-950 dark:text-white bg-zinc-200/50 dark:bg-zinc-900'
                        : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900/50'
                    }`}
                  >
                    {mainCat}
                    {selectedCategory === mainCat && !hasSubs && <Check size={14} className="text-zinc-900 dark:text-white" />}
                  </button>
                  
                  {hasSubs && (
                    <div className="pl-4 pr-2 mt-1 space-y-1 border-l-2 border-zinc-200 dark:border-zinc-800 ml-3">
                      {subcats.map(sub => {
                        const fullCat = `${mainCat} - ${sub}`;
                        return (
                          <button
                            key={sub}
                            onClick={() => {
                              setSelectedCategory(fullCat);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full text-left py-1.5 px-3 rounded-lg text-xs tracking-wide uppercase flex justify-between items-center ${
                              selectedCategory === fullCat
                                ? 'bg-zinc-200/50 dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold'
                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/50'
                            }`}
                          >
                            {sub}
                            {selectedCategory === fullCat && <Check size={14} className="text-zinc-900 dark:text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
