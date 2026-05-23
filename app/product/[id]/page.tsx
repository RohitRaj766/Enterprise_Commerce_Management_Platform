'use client';

import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { use, useEffect, useMemo, useState } from 'react';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { DesktopNav } from '@/components/layout/DesktopNav';
import { Skeleton } from '@/components/ui/Skeleton';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { products, toggleFavorite, favorites } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated } = useAuthStore();
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDetailExpanded, setIsDetailExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // All hooks must be called before any early returns
  const isFavorite = useMemo(() => {
    if (!product) return false;
    return favorites.has(product.id);
  }, [favorites, product]);

  // Use the same product image for all three carousel slides
  const productImages = useMemo(() => {
    if (!product) return [];
    return [product.image, product.image, product.image];
  }, [product]);

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

  // Auto-play carousel
  useEffect(() => {
    if (productImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [productImages.length]);

  // Early returns after all hooks
  if (!product) return notFound();

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 lg:pb-12">
        <div className="max-w-6xl mx-auto px-5 lg:px-6 lg:pt-8">
          <Skeleton variant="rectangular" height={300} className="w-full rounded-2xl mb-4" />
          <div className="flex gap-2 justify-center mb-6">
            <Skeleton variant="circular" width={8} height={8} />
            <Skeleton variant="circular" width={8} height={8} />
            <Skeleton variant="circular" width={8} height={8} />
          </div>
          <Skeleton variant="text" width="80%" height={28} className="mb-2" />
          <Skeleton variant="text" width="60%" height={20} className="mb-4" />
          <Skeleton variant="text" width="40%" height={24} className="mb-6" />
          <div className="flex items-center gap-4 mb-6">
            <Skeleton variant="text" width={100} height={20} />
            <Skeleton variant="rectangular" width={120} height={40} className="rounded-lg" />
          </div>
          <Skeleton variant="rectangular" height={56} className="w-full rounded-2xl mb-6" />
          <div className="space-y-4">
            <Skeleton variant="text" width={150} height={24} />
            <Skeleton variant="text" width="100%" height={16} />
            <Skeleton variant="text" width="90%" height={16} />
            <Skeleton variant="text" width="95%" height={16} />
          </div>
        </div>
      </div>
    );
  }

  // Generate product-specific description
  const getProductDescription = () => {
    const descriptions: Record<string, string> = {
      'apple-red': 'Apples Are Nutritious. Apples May Be Good For Weight Loss. Apples May Be Good For Your Heart. As Part Of A Healtful And Varied Diet.',
      'banana-organic': 'Bananas Are Rich In Potassium And Fiber. They Support Heart Health And Digestive Wellness. Perfect As A Natural Energy Source. Include Bananas In Your Daily Nutrition.',
      'bell-pepper-red': 'Red Bell Peppers Are Packed With Vitamin C And Antioxidants. They Support Immune Health And Eye Function. Great For Adding Color And Flavor To Your Meals.',
      'ginger': 'Ginger Has Anti-Inflammatory Properties And Aids Digestion. It Can Help Reduce Nausea And Muscle Pain. A Versatile Spice For Cooking And Wellness.',
      'egg-chicken-red': 'Fresh Eggs Are An Excellent Source Of Protein And Essential Nutrients. They Support Muscle Development And Brain Health. Perfect For A Balanced Breakfast.',
      'coca-cola-can': 'Refreshing Carbonated Beverage. Enjoy Cold For Best Taste. Perfect For Parties And Gatherings.',
      'pepsi-can': 'Classic Cola Flavor. Refreshing And Energizing. Best Served Cold.',
      'sprite-can': 'Lemon-Lime Flavored Soft Drink. Crisp And Refreshing. Perfect Thirst Quencher.',
      'mayonnaise-eggless': 'Creamy Eggless Mayonnaise. Perfect For Sandwiches And Salads. Made With Quality Ingredients.',
      'egg-noodles': 'Premium Egg Noodles. Quick And Easy To Prepare. Great For Various Recipes.',
      'beef-bone': 'Fresh Beef Bones. Rich In Flavor And Nutrients. Perfect For Soups And Broths.',
      'broiler-chicken': 'Fresh Broiler Chicken. Tender And Juicy. Great For Various Cooking Methods.',
    };
    return descriptions[product.id] || `${product.name} is a high-quality product. Fresh and carefully selected for your satisfaction. Perfect addition to your shopping list.`;
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i += 1) {
      addItem(product);
    }
    router.push('/cart');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} - $${product.price.toFixed(2)}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      <div className="max-w-6xl mx-auto lg:px-6 lg:pt-8">
        {isAuthenticated && <DesktopNav />}
        <div className="bg-white lg:rounded-3xl lg:shadow-sm lg:border border-gray-100 overflow-hidden">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Product Image Section */}
            <div className="relative h-72 lg:h-[420px] bg-white overflow-hidden">
              <div className="hidden lg:flex items-center gap-3 absolute top-4 left-4 z-10">
                <button
                  onClick={() => router.back()}
                  className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50"
                  aria-label="Back"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => router.back()}
                className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50"
                aria-label="Back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50"
                aria-label="Share"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              
              {/* Carousel Container */}
              <div className="relative w-full h-full">
                <div
                  className="flex transition-transform duration-300 ease-in-out h-full"
                  style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                >
                  {productImages.map((image, index) => (
                    <div
                      key={index}
                      className="min-w-full h-full flex items-center justify-center bg-white"
                    >
                      <div className="relative w-full h-full flex items-center justify-center p-8">
                        <Image
                          src={image}
                          alt={`${product.name} - Image ${index + 1}`}
                          width={360}
                          height={360}
                          className="object-contain max-w-full max-h-full"
                          priority={index === 0}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-1 rounded-full transition-all ${
                      index === currentImageIndex ? 'w-8 bg-[#53B175]' : 'w-1 bg-gray-300'
                    }`}
                    aria-label={`Image ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Product Details Section */}
            <main className="px-5 py-6 space-y-6 bg-white lg:px-8 lg:py-8 lg:bg-transparent">
              {/* Product Name and Favorite */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{product.name}</h1>
                    <button
                      onClick={() => {
                        toggleFavorite(product.id);
                        if (isFavorite) {
                          toast.success(`${product.name} removed from favorites`);
                        } else {
                          toast.success(`${product.name} added to favorites`);
                        }
                      }}
                      className="flex-shrink-0"
                      aria-label="Toggle favorite"
                    >
                      {isFavorite ? (
                        <svg className="w-6 h-6 fill-red-500" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 stroke-gray-400" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{product.unit}</p>
                </div>
              </div>

              {/* Quantity Selector and Price */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-12 text-center text-base font-semibold border border-gray-300 rounded-lg py-1 bg-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 rounded-full bg-[#53B175] text-white flex items-center justify-center hover:bg-[#45a065]"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl lg:text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ${product.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Detail Section */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <button
                  onClick={() => setIsDetailExpanded(!isDetailExpanded)}
                  className="w-full flex items-center justify-between"
                >
                  <h3 className="text-base font-semibold text-gray-900">Product Detail</h3>
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      isDetailExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDetailExpanded && (
                  <p className="text-sm text-gray-600 leading-6 mt-2">
                    {getProductDescription()}
                  </p>
                )}
              </div>

              {/* Nutritions Section */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Nutritions</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">100gr</span>
                  <button aria-label="View nutrition details">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Review Section */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-gray-900">Review</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 fill-red-500"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <button aria-label="View all reviews">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Desktop CTA */}
              <div className="hidden lg:flex justify-end">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="mt-2 inline-flex px-6 py-3 bg-[#53B175] text-white rounded-xl font-semibold shadow-sm hover:bg-[#45a065] transition-colors"
                >
                  Add To Basket
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Add To Basket Button - mobile */}
      <div className="fixed bottom-4 left-0 right-0 px-5 lg:hidden">
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full py-4 bg-[#53B175] text-white rounded-2xl font-semibold text-base shadow-lg hover:bg-[#45a065] transition-colors"
        >
          Add To Basket
        </button>
      </div>
    </div>
  );
}

