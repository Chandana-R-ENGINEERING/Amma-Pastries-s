import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BusinessInfo } from './components/BusinessInfo';
import { FeaturedProducts } from './components/FeaturedProducts';
import { MenuSection } from './components/MenuSection';
import { CustomCakeBuilder } from './components/CustomCakeBuilder';
import { WhyChooseUs } from './components/WhyChooseUs';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { OrderSchedulerModal } from './components/OrderSchedulerModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { CartDrawer } from './components/CartDrawer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { Product, Category, BusinessSettings, GalleryItem, Review } from './types';
import { api } from './services/api';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BakeryAppContent />
      </CartProvider>
    </AuthProvider>
  );
}

function BakeryAppContent() {
  const { isOrderSchedulerOpen, setIsOrderSchedulerOpen, openOrderScheduler } = useCart();

  // App state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [prods, cats, sett, gall, revs] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getSettings(),
        api.getGallery(),
        api.getReviews(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setSettings(sett);
      setGalleryItems(gall);
      setReviews(revs);
    } catch (err) {
      console.error('Failed to load bakery initial data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLocation = () => {
    const el = document.getElementById('location');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#241A15] flex flex-col font-sans selection:bg-[#EAD7C5] selection:text-[#241A15]">
      {/* 1. Navbar */}
      <Navbar
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          onExploreMenu={scrollToMenu}
          onOrderCake={() => openOrderScheduler('Regular Cake Order')}
        />

        {/* 3. Business Information Strip */}
        <BusinessInfo
          settings={settings}
          onOpenLocation={scrollToLocation}
        />

        {/* 4. Featured Cakes & Pastries */}
        <FeaturedProducts
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onViewAllMenu={scrollToMenu}
        />

        {/* 5. Menu Categories & Filterable Grid */}
        <MenuSection
          products={products}
          categories={categories}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />

        {/* 6. Custom Cake Builder Experience */}
        <CustomCakeBuilder />

        {/* 7. Why Choose Us */}
        <WhyChooseUs />

        {/* 8. Gallery */}
        <GallerySection galleryItems={galleryItems} />

        {/* 9. Verified Reviews */}
        <ReviewsSection
          reviews={reviews}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* 10. Location & Opening Hours */}
        <LocationSection settings={settings} />
      </main>

      {/* 11. Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* Sticky Mobile Action Bar */}
      <MobileStickyBar settings={settings} />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Modals */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <OrderSchedulerModal
        products={products}
        isOpen={isOrderSchedulerOpen}
        onClose={() => setIsOrderSchedulerOpen(false)}
      />

      <CustomerAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        settings={settings}
        onRefreshSettings={loadInitialData}
      />
    </div>
  );
}
