'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/layout/BottomNav';
import { DesktopNav } from '@/components/layout/DesktopNav';
import { ProductCard } from '@/components/shop/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const router = useRouter();
  const { products, favorites } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const favoriteProducts = products.filter((p) => favorites.has(p.id));

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

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 lg:pb-12">
        <div className="max-w-6xl mx-auto lg:px-6 lg:pt-6 lg:pb-10">
          {isAuthenticated && <DesktopNav />}
          <div className="hidden lg:flex items-center justify-between bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-4 mb-6">
            <Skeleton variant="text" width={150} height={28} />
          </div>
          <header className="px-5 pt-4 pb-4 bg-white shadow-sm lg:hidden">
            <Skeleton variant="text" width={120} height={28} className="mx-auto" />
          </header>
          <main className="bg-white mt-4 lg:mt-0 lg:bg-transparent">
            <div className="divide-y divide-gray-100 lg:hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <Skeleton variant="rectangular" width={64} height={64} className="rounded-xl" />
                  <div className="flex-1">
                    <Skeleton variant="text" width="70%" className="mb-2" />
                    <Skeleton variant="text" width="50%" />
                  </div>
                  <Skeleton variant="text" width={60} height={20} />
                </div>
              ))}
            </div>
            <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <Skeleton variant="text" width={200} height={24} className="mb-6" />
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} variant="rectangular" height={200} className="w-full rounded-2xl" />
                ))}
              </div>
            </div>
          </main>
        </div>
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>
    );
  }

  const handleAddAllToCart = () => {
    favoriteProducts.forEach((product) => {
      addItem(product);
    });
    toast.success(`${favoriteProducts.length} items added to cart`);
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-12">
      <div className="max-w-6xl mx-auto lg:px-6 lg:pt-6 lg:pb-10">
        {isAuthenticated && <DesktopNav />}
        
        {/* Desktop header */}
        <div className="hidden lg:flex items-center justify-between bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-4 mb-6">
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
              <p className="text-xs text-gray-500">Saved Items</p>
              <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>
            </div>
          </div>
          {favoriteProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{favoriteProducts.length} items</span>
              <button
                type="button"
                onClick={handleAddAllToCart}
                className="px-4 py-2 bg-[#53B175] text-white rounded-xl font-semibold text-sm hover:bg-[#45a065] transition-colors"
              >
                Add All To Cart
              </button>
            </div>
          )}
        </div>

        {/* Mobile header */}
        <header className="px-5 pt-4 pb-4 bg-white shadow-sm lg:hidden">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Favorurite</h1>
        </header>

        <main className="bg-white mt-4 lg:mt-0 lg:bg-transparent">
          {favoriteProducts.length === 0 ? (
            <div className="bg-white lg:rounded-3xl lg:shadow-sm lg:border border-gray-100 lg:p-12">
              <div className="text-center text-gray-500 py-20 lg:py-12">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="text-lg font-medium mb-2">No favourites yet</p>
                <p className="text-sm text-gray-400">Start adding products to your favorites!</p>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile list view */}
              <div className="divide-y divide-gray-100 lg:hidden">
                {favoriteProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{product.unit}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Desktop grid view */}
              <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {favoriteProducts.length} {favoriteProducts.length === 1 ? 'Favorite Item' : 'Favorite Items'}
                  </h2>
                </div>
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                  {favoriteProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>

              {/* Mobile add all button */}
              <div className="px-5 py-4 pb-6 lg:hidden">
                <button
                  type="button"
                  onClick={handleAddAllToCart}
                  className="w-full py-4 bg-[#53B175] text-white rounded-2xl font-semibold text-base shadow-lg hover:bg-[#45a065] transition-colors"
                >
                  Add All To Cart
                </button>
              </div>
            </>
          )}
        </main>
      </div>

      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}

