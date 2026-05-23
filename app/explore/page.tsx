'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { BottomNav } from '@/components/layout/BottomNav';
import { CategoryCard } from '@/components/shop/CategoryCard';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductCardSkeleton, CategoryCardSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { DesktopNav } from '@/components/layout/DesktopNav';
import { useRouter, useSearchParams } from 'next/navigation';
import { Brand, ProductCategory } from '@/types';

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="px-5 pt-6 pb-6 bg-white shadow-sm">
          <Skeleton variant="text" width={150} height={28} className="mx-auto mb-4" />
          <Skeleton variant="rectangular" height={40} className="w-full rounded-3xl" />
        </div>
        <div className="px-4 space-y-6 mt-5">
          <div className="grid grid-cols-2 gap-4">
            <CategoryCardSkeleton />
            <CategoryCardSkeleton />
            <CategoryCardSkeleton />
            <CategoryCardSkeleton />
          </div>
          <div className="space-y-3">
            <Skeleton variant="text" width={100} height={24} />
            <div className="grid grid-cols-2 gap-3">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
          </div>
        </div>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const { isAuthenticated } = useAuthStore();
  const totalItemsCount = useCartStore((state) => state.totalItems());
  const {
    categories,
    filteredProducts,
    setSearchTerm,
    searchTerm,
    toggleCategory,
    toggleBrand,
    selectedCategories,
    selectedBrands,
  } = useProductStore();
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isClearingRef = useRef(false);
  const processedCategoryRef = useRef<string | null>(null);

  const products = filteredProducts();
  const brandOptions = Object.values(Brand);

  const handleCategoryToggle = (categoryId: ProductCategory, categoryName: string) => {
    const wasSelected = selectedCategories.has(categoryId);
    toggleCategory(categoryId);
    if (wasSelected) {
      toast.success(`${categoryName} removed`);
    } else {
      toast.success(`${categoryName} selected`);
    }
  };

  const handleBrandToggle = (brand: Brand) => {
    const wasSelected = selectedBrands.has(brand);
    toggleBrand(brand);
    if (wasSelected) {
      toast.success(`${brand} removed`);
    } else {
      toast.success(`${brand} selected`);
    }
  };

  const clearFilters = () => {
    // Set flag to prevent useEffect from re-adding categories
    isClearingRef.current = true;
    processedCategoryRef.current = null;
    
    // Clear all selected categories and brands first
    Array.from(selectedCategories).forEach((cat) => toggleCategory(cat));
    Array.from(selectedBrands).forEach((brand) => toggleBrand(brand));
    setSearchTerm('');
    
    // Remove category query param
    router.replace('/explore');
    
    // Reset flag after a short delay to allow URL update
    setTimeout(() => {
      isClearingRef.current = false;
    }, 100);
    
    toast.success('Filters cleared');
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace('/login');
      return undefined;
    }
    if (isAuthenticated === true) {
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isAuthenticated, router]);

  // Sync category query param to filter selection
  useEffect(() => {
    // Don't sync if we're in the process of clearing filters
    if (isClearingRef.current) return;
    
    if (!categoryParam) {
      processedCategoryRef.current = null;
      return;
    }
    
    const cat = categoryParam as ProductCategory;
    
    // Only process if this is a new category param (not already processed)
    if (processedCategoryRef.current !== categoryParam && !selectedCategories.has(cat)) {
      toggleCategory(cat);
      const category = categories.find((c) => c.id === cat);
      if (category) {
        toast.success(`${category.name} selected`);
        processedCategoryRef.current = categoryParam;
      }
    }
  }, [categoryParam, toggleCategory, categories]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 lg:pb-12">
        <div className="max-w-6xl mx-auto lg:px-6">
          {isAuthenticated && <DesktopNav />}
          <header className="px-5 pt-6 pb-6 bg-white shadow-sm lg:rounded-3xl lg:border border-gray-100">
            <Skeleton variant="text" width={150} height={28} className="mx-auto mb-4" />
            <div className="mt-4 flex items-center gap-3">
              <Skeleton variant="rectangular" height={40} className="flex-1 rounded-3xl" />
              <Skeleton variant="circular" width={40} height={40} />
            </div>
          </header>
          <main className="px-4 space-y-6 mt-5 lg:px-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <CategoryCardSkeleton />
              <CategoryCardSkeleton />
              <CategoryCardSkeleton />
              <CategoryCardSkeleton />
            </div>
            <div className="space-y-3 pb-10">
              <Skeleton variant="text" width={100} height={24} />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const FiltersContent = () => (
    <>
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-gray-900">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => {
            const checked = selectedCategories.has(cat.id);
            return (
              <label
                key={cat.id}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded-sm border-2 appearance-none checked:bg-[#53B175] checked:border-[#53B175] border-gray-300 focus:ring-0 focus:ring-offset-0"
                    checked={checked}
                    onChange={() => handleCategoryToggle(cat.id, cat.name)}
                  />
                  {checked && (
                    <svg
                      className="absolute top-0 left-0 h-5 w-5 pointer-events-none"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 10l3 3 7-7"
                      />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${checked ? 'text-[#53B175] font-medium' : 'text-gray-800'}`}>{cat.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-semibold text-gray-900">Brand</h3>
        <div className="space-y-2">
          {brandOptions.map((brand) => {
            const checked = selectedBrands.has(brand);
            return (
              <label
                key={brand}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded-sm border-2 appearance-none checked:bg-[#53B175] checked:border-[#53B175] border-gray-300 focus:ring-0 focus:ring-offset-0"
                    checked={checked}
                    onChange={() => handleBrandToggle(brand)}
                  />
                  {checked && (
                    <svg
                      className="absolute top-0 left-0 h-5 w-5 pointer-events-none"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 10l3 3 7-7"
                      />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${checked ? 'text-[#53B175] font-medium' : 'text-gray-800'}`}>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-12">
      <div className="max-w-6xl mx-auto lg:px-6 lg:pt-6 lg:pb-10">
        {isAuthenticated && <DesktopNav />}
        {/* Desktop header */}
        <div className="hidden lg:flex items-center justify-between bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18L9 12L15 6" />
              </svg>
            </button>
            <div>
              <p className="text-xs text-gray-500">Catalog</p>
              <h1 className="text-2xl font-bold text-gray-900">Find Products</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 w-1/2">
            <div className="relative flex-1">
              <input
                className="w-full rounded-xl bg-gray-100 px-4 py-3 pl-11 pr-10 text-sm text-gray-700 outline-none border border-transparent focus:border-[#53B175] transition"
                placeholder="Search Store"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Image src="/assets/searchicon.png" alt="Search icon" width={16} height={16} />
              </span>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="button"
              className="px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:border-[#53B175] hover:text-[#53B175] transition"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-6 lg:mt-6">
          {/* Desktop filters */}
          <aside className="hidden lg:block sticky top-6 self-start">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-[#53B175] font-medium"
                >
                  Clear all
                </button>
              </div>
              <FiltersContent />
              <button
                type="button"
                className="w-full py-3 rounded-2xl bg-[#53B175] text-white font-semibold"
                onClick={() => toast.success('Filters applied')}
              >
                Apply Filters
              </button>
            </div>
          </aside>

          <div className="bg-white lg:rounded-3xl lg:shadow-sm lg:border border-gray-100">
            {/* Mobile header */}
            <header className="px-5 pt-6 pb-6 bg-white shadow-sm lg:hidden">
              <h1 className="text-2xl font-bold text-gray-900 text-center">Find Products</h1>
              <div className="mt-4 flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    className="w-full rounded-3xl bg-gray-100 px-4 py-3 pl-12 pr-10 text-sm text-gray-700 outline-none shadow-sm"
                    placeholder="Search Store"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Image src="/assets/searchicon.png" alt="Search icon" width={16} height={16} />
                  </span>
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Clear search"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gray-100 shadow-sm"
                  aria-label="Filter products"
                  onClick={() => setShowFilters(true)}
                >
                  <Image src="/assets/filtericon.png" alt="Filter icon" width={18} height={18} />
                </button>
              </div>
            </header>

            <main className="px-4 space-y-6 mt-5 lg:px-8 lg:py-8">
              <section>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categories.map((cat) => (
                    <CategoryCard
                      key={cat.id}
                      id={cat.id}
                      name={cat.name}
                      icon={cat.icon}
                      href={`/explore?category=${cat.id}`}
                    />
                  ))}
                </div>
              </section>

              <section className="space-y-3 pb-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Products</h2>
                  {categoryParam && (
                    <span className="text-sm text-gray-500">Filtered by category</span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <BottomNav />
      </div>

      {/* Desktop floating cart shortcut */}
      <Link
        href="/cart"
        className="hidden lg:inline-flex items-center gap-3 fixed bottom-8 right-8 bg-[#53B175] text-white px-5 py-3 rounded-2xl shadow-lg hover:bg-[#45a065] transition-colors"
      >
        <span className="font-semibold">Go to Cart</span>
        <span className="bg-white/15 rounded-xl px-3 py-1 text-sm font-medium">
          {totalItemsCount} items
        </span>
      </Link>

      {showFilters && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden">
          <div className="h-full w-full flex flex-col p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                type="button"
                className="text-gray-500 text-xl"
                onClick={() => setShowFilters(false)}
                aria-label="Close filters"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              <FiltersContent />
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 font-semibold"
                onClick={clearFilters}
              >
                Clear All
              </button>
              <button
                type="button"
                className="flex-1 py-3 rounded-2xl bg-[#53B175] text-white font-semibold"
                onClick={() => {
                  setShowFilters(false);
                  toast.success('Filters applied');
                }}
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

