import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { ShoppingBag, Heart, Menu, X, Plus, Image as ImageIcon, Sparkles, Filter, CreditCard, ChevronRight, Check, CheckCircle2, ChevronDown, Trash2, ArrowLeft, Package, Truck, Phone, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MENU_STRUCTURE } from './data/products';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // State management
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Supabase products data
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [session, setSession] = useState(null);

  // Hero and Editing states
  const [productToEdit, setProductToEdit] = useState(null);
  const [heroSettings, setHeroSettings] = useState({
    hero_title: 'NUEVA COLECCIÓN MÍNIMA',
    hero_subtitle: 'Siluetas limpias, tonos neutros y cortes contemporáneos diseñados para durar.',
    hero_cta: 'Explorar Colección'
  });

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutShippingType, setCheckoutShippingType] = useState('maritimo');
  const [checkoutShippingCost, setCheckoutShippingCost] = useState(4);

  // Filters and Sorting
  const [selectedSize, setSelectedSize] = useState('Todas');
  const [selectedColor, setSelectedColor] = useState('Todos');
  const [sortBy, setSortBy] = useState('default');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variants(*)');
      
      if (error) throw error;
      setProductsList(data || []);
    } catch (err) {
      console.error('Error fetching products from Supabase:', err.message);
      // Fallback to empty array
      setProductsList([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch site settings from Supabase
  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      if (data && data.length > 0) {
        const settingsObj = {};
        data.forEach(item => {
          settingsObj[item.key] = item.value;
        });
        setHeroSettings(prev => ({ ...prev, ...settingsObj }));
      }
    } catch (err) {
      console.error('Error fetching settings from Supabase:', err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, [isAdminOpen]); // Refetch products & settings when admin panel closes

  // Check auth session and listen to changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = session?.user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  // Listen to URL path/hash to open admin login
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (
        path === '/login' || 
        path === '/login/' || 
        hash === '#/login' || 
        hash === '#login' || 
        path.startsWith('/login')
      ) {
        setIsAdminOpen(true);
      }
    };

    handleUrlRoute();

    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);

    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
    };
  }, []);

  // Update dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Sync cart and favorites to local storage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Cart operations
  const handleAddToCart = (product, quantity = 1, size = null, color = null) => {
    const variants = product.product_variants || [];
    
    // Determine color & size defaults based on active variant
    const itemColor = color || (variants.length > 0 ? { name: variants[0].color_name, hex: variants[0].color_hex } : null);
    const itemSize = size || (variants.length > 0 ? variants[0].sizes[0] : 'XS');

    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(
        item => item.id === product.id && 
                item.selectedSize === itemSize && 
                item.selectedColor?.name === itemColor?.name
      );

      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, {
          ...product,
          quantity,
          selectedSize: itemSize,
          selectedColor: itemColor,
          image: variants.find(v => v.color_name === itemColor?.name)?.image_url || product.image || '/images/trench_coat.png'
        }];
      }
    });
  };

  const handleUpdateCartQty = (id, size, colorName, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id, size, colorName);
      return;
    }
    setCart(prev => prev.map(item => 
      (item.id === id && item.selectedSize === size && item.selectedColor?.name === colorName)
        ? { ...item, quantity: newQty }
        : item
    ));
  };

  const handleRemoveCartItem = (id, size, colorName) => {
    setCart(prev => prev.filter(item => 
      !(item.id === id && item.selectedSize === size && item.selectedColor?.name === colorName)
    ));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Favorites operations
  const handleToggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const handleToggleShowOnlyFavorites = () => {
    setShowOnlyFavorites(!showOnlyFavorites);
    if (!showOnlyFavorites) {
      setSelectedCategory('Todos');
    }
  };

  // Filtered and Sorted products
  const filteredProducts = productsList.filter(product => {
    const matchesSearch = searchQuery.trim() === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'Todos' || 
      product.category === selectedCategory || 
      (product.category && product.category.startsWith(`${selectedCategory} -`));
    const matchesFavorites = !showOnlyFavorites || favorites.includes(product.id);

    return matchesSearch && matchesCategory && matchesFavorites;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const handleResetFilters = () => {
    setSelectedSize('Todas');
    setSelectedColor('Todos');
    setSortBy('default');
    setSearchQuery('');
    setSelectedCategory('Todos');
    setShowOnlyFavorites(false);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto? Se borrarán también todas sus variantes.')) return;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      if (error) throw error;
      setProductsList(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Error al eliminar producto:', err.message);
      alert('Error al eliminar producto: ' + err.message);
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    setProductToEdit(null); // Clear editing product state
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path.startsWith('/login')) {
      window.history.pushState(null, '', '/');
    }
    if (hash === '#/login' || hash === '#login') {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  const handleOpenCheckout = (total, discount, shippingType = 'maritimo', shippingCost = 4) => {
    setCheckoutTotal(total);
    setCheckoutDiscount(discount);
    setCheckoutShippingType(shippingType);
    setCheckoutShippingCost(shippingCost);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Admin Control Bar */}
      {isAdmin && (
        <div className="bg-zinc-950 text-zinc-100 text-[11px] sm:text-xs px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between border-b border-zinc-900 tracking-wider z-50">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span className="font-bold uppercase text-white">Sesión de Administrador Activa</span>
            <span className="text-zinc-400 font-light">| {session.user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-medium tracking-widest uppercase text-zinc-300 border border-zinc-700/50 rounded-full hover:text-white hover:border-zinc-400 hover:bg-white/5 transition-all cursor-pointer"
            >
              <Sparkles size={12} />
              Panel Admin
            </button>
            <button
              onClick={async () => {
                if (window.confirm('¿Estás seguro de que quieres cerrar la sesión de administrador?')) {
                  await supabase.auth.signOut();
                }
              }}
              className="px-4 py-1.5 text-[10px] font-medium tracking-widest uppercase text-rose-400/80 border border-rose-900/30 rounded-full hover:text-rose-300 hover:border-rose-700/50 hover:bg-rose-950/20 transition-all cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      {/* Header navbar */}
      <Header
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        favoritesCount={favorites.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFavorites={handleToggleShowOnlyFavorites}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          setShowOnlyFavorites(false);
        }}
        isAdmin={isAdmin}
      />

      {/* Hero Header Section */}
      <Hero 
        onExploreClick={() => {
          const element = document.getElementById('catalog');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }} 
        featuredProducts={productsList.filter(p => p.is_featured === true)}
        settings={heroSettings}
        onOpenDetail={(prod) => setSelectedProduct(prod)}
      />

      {/* Main Catalog Shop */}
      <main id="catalog" className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Title and Filters Toggle Row */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-zinc-200 dark:border-zinc-900 pb-5 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-light tracking-widest uppercase">
              {showOnlyFavorites ? 'Mis Favoritos' : selectedCategory === 'Todos' ? 'Colección General' : selectedCategory}
            </h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-light mt-1">
              Mostrando {filteredProducts.length} de {productsList.length} productos
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={`flex items-center gap-2 px-4 py-2 border text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                showFiltersPanel || selectedSize !== 'Todas' || selectedColor !== 'Todos'
                  ? 'bg-black border-black text-[#FAF9F6] dark:bg-white dark:border-white dark:text-zinc-955 hover:text-white'
                  : 'border-zinc-300 dark:border-zinc-800 hover:border-black dark:hover:border-white'
              }`}
            >
              <SlidersHorizontal size={12} />
              Filtros {selectedSize !== 'Todas' || selectedColor !== 'Todos' ? '(Activos)' : ''}
            </button>

            {/* Sorting Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border border-zinc-300 dark:border-zinc-800 text-xs px-3 py-2 focus:outline-none focus:border-black dark:focus:border-white uppercase font-semibold tracking-wider rounded-none cursor-pointer text-zinc-805 dark:text-zinc-200"
            >
              <option value="default" className="bg-[#FAF9F6] dark:bg-zinc-900">Ordenar por: Relevancia</option>
              <option value="price-asc" className="bg-[#FAF9F6] dark:bg-zinc-900">Precio: Bajo a Alto</option>
              <option value="price-desc" className="bg-[#FAF9F6] dark:bg-zinc-900">Precio: Alto a Bajo</option>
              <option value="rating" className="bg-[#FAF9F6] dark:bg-zinc-900">Mejor Valorados</option>
            </select>
          </div>
        </div>

        {/* Collapsible Advanced Filters Panel */}
        <AnimatePresence>
          {showFiltersPanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-b border-zinc-200 dark:border-zinc-900 mb-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-6 text-left">
                
                {/* Dynamic Category Filter */}
                <div className="space-y-2 lg:col-span-2">
                  <span className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                    {selectedCategory === 'Todos' 
                      ? 'Filtrar por Categoría Principal' 
                      : (!selectedCategory.includes('-') ? `Filtrar subcategorías de ${selectedCategory}` : 'Subcategoría Seleccionada')}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory === 'Todos' && Object.keys(MENU_STRUCTURE).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 border text-xs font-medium transition-all cursor-pointer border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white text-zinc-650 dark:text-zinc-400`}
                      >
                        {cat}
                      </button>
                    ))}

                    {selectedCategory !== 'Todos' && !selectedCategory.includes('-') && MENU_STRUCTURE[selectedCategory]?.map(sub => (
                      <button
                        key={sub}
                        onClick={() => setSelectedCategory(`${selectedCategory} - ${sub}`)}
                        className={`px-3 py-1.5 border text-xs font-medium transition-all cursor-pointer border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white text-zinc-650 dark:text-zinc-400`}
                      >
                        {sub}
                      </button>
                    ))}
                    
                    {selectedCategory.includes('-') && (
                      <button
                        onClick={() => setSelectedCategory(selectedCategory.split(' - ')[0])}
                        className={`px-3 py-1.5 border text-xs font-medium transition-all cursor-pointer bg-black border-black text-white dark:bg-white dark:border-white dark:text-zinc-950`}
                      >
                        {selectedCategory.split(' - ')[1]} (Quitar filtro)
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Info / Reset */}
                <div className="space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase block mb-1">Limpieza rápida</span>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                      Si quieres ver toda la variedad de productos de nuevo sin restricciones, presiona el botón.
                    </p>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="w-full text-center py-2 bg-zinc-205 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Restablecer Filtros
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active badges list */}
        {(selectedSize !== 'Todas' || selectedColor !== 'Todos' || showOnlyFavorites || searchQuery !== '') && (
          <div className="flex flex-wrap gap-2 mb-6 items-center">
            <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mr-1">Filtros Activos:</span>
            {selectedCategory !== 'Todos' && (
              <span className="inline-flex items-center gap-1 bg-zinc-200 dark:bg-zinc-900 text-xs px-2.5 py-1 rounded-full text-zinc-800 dark:text-zinc-350">
                Categoría: {selectedCategory}
                <X size={12} className="cursor-pointer hover:text-black dark:hover:text-white" onClick={() => setSelectedCategory('Todos')} />
              </span>
            )}
            {showOnlyFavorites && (
              <span className="inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-955/25 text-rose-600 dark:text-rose-455 text-xs px-2.5 py-1 rounded-full">
                <Heart size={10} fill="currentColor" /> Solo Favoritos
                <X size={12} className="cursor-pointer hover:text-rose-850" onClick={() => setShowOnlyFavorites(false)} />
              </span>
            )}
            {searchQuery !== '' && (
              <span className="inline-flex items-center gap-1 bg-zinc-200 dark:bg-zinc-900 text-xs px-2.5 py-1 rounded-full text-zinc-800 dark:text-zinc-350">
                Búsqueda: "{searchQuery}"
                <X size={12} className="cursor-pointer hover:text-black dark:hover:text-white" onClick={() => setSearchQuery('')} />
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-[10px] text-zinc-400 dark:text-zinc-550 hover:text-black dark:hover:text-white underline tracking-wide uppercase font-semibold cursor-pointer ml-2"
            >
              Borrar todos
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full"
            />
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">Cargando colección AURA...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty state */
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full">
              <SlidersHorizontal size={36} className="text-zinc-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold uppercase tracking-wider">No se encontraron prendas</h3>
              <p className="text-sm text-zinc-500 font-light max-w-sm">Prueba ajustando los filtros o la búsqueda para encontrar lo que necesitas.</p>
            </div>
            <button
              onClick={handleResetFilters}
              className="bg-black dark:bg-white text-white dark:text-zinc-950 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest cursor-pointer hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Mostrar todo
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={handleToggleFavorite}
                onOpenDetail={(prod) => setSelectedProduct(prod)}
                onAddToCart={(prod, qty, size, color) => {
                  handleAddToCart(prod, qty, size, color);
                  setIsCartOpen(true);
                }}
                isAdmin={isAdmin}
                onDelete={handleDeleteProduct}
                onEdit={(prod) => {
                  setProductToEdit(prod);
                  setIsAdminOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer Design */}
      {!isAdmin && (
        <footer className="bg-zinc-100 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-850 py-16 px-4 transition-colors duration-300">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-10 text-left">
            
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-light tracking-[0.25em] uppercase text-zinc-900 dark:text-white">AURA</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed max-w-xs">
                Tienda de ropa inspirada en el minimalismo contemporáneo. Curando las mejores siluetas esenciales de Shein con un diseño limpio y una experiencia prémium.
              </p>
              <div className="text-[10px] text-zinc-450 dark:text-zinc-500 font-mono flex items-center flex-wrap">
                <span>© {new Date().getFullYear()} AURA Inc. Todos los derechos reservados.</span>
              </div>
            </div>

            {/* Column 2: Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-450 dark:text-zinc-500">Colecciones</h4>
              <ul className="space-y-2 text-xs font-light text-zinc-650 dark:text-zinc-400">
                <li><button onClick={() => setSelectedCategory('Abrigos')} className="hover:text-black dark:hover:text-white cursor-pointer transition-colors uppercase">Abrigos</button></li>
                <li><button onClick={() => setSelectedCategory('Tops')} className="hover:text-black dark:hover:text-white cursor-pointer transition-colors uppercase">Tops & Suéteres</button></li>
                <li><button onClick={() => setSelectedCategory('Vestidos')} className="hover:text-black dark:hover:text-white cursor-pointer transition-colors uppercase">Vestidos</button></li>
                <li><button onClick={() => setSelectedCategory('Pantalones')} className="hover:text-black dark:hover:text-white cursor-pointer transition-colors uppercase">Pantalones</button></li>
              </ul>
            </div>

            {/* Column 3: Help */}
            <div className="space-y-3">
            
              <ul className="space-y-2 text-xs font-light text-zinc-600 dark:text-zinc-400">
                <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Politica de privacidad</a></li>
                <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Políticas de Cookies</a></li>

              </ul>
            </div>

            
          </div>
        </footer>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        isFavorite={selectedProduct ? favorites.includes(selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
        isAdmin={isAdmin}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleOpenCheckout}
      />

      {/* Checkout Wizard Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={checkoutTotal}
        discountPercent={checkoutDiscount}
        shippingType={checkoutShippingType}
        shippingCost={checkoutShippingCost}
        cartItems={cart}
        onClearCart={handleClearCart}
      />

      {/* Full Admin Panel Drawer */}
      {isAdminOpen && (
        <AdminPanel 
          onClose={handleCloseAdmin}
          productToEdit={productToEdit}
          onClearEdit={() => setProductToEdit(null)}
          onEdit={(prod) => setProductToEdit(prod)}
          heroSettings={heroSettings}
          onUpdateSettings={(newSettings) => setHeroSettings(newSettings)}
        />
      )}

    </div>
  );
}
