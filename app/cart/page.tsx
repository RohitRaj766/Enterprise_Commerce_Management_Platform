'use client';

import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { BottomNav } from '@/components/layout/BottomNav';
import { DesktopNav } from '@/components/layout/DesktopNav';
import { CartItemSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export default function CartPage() {
  const router = useRouter();
  const { items, increment, decrement, removeItem, totalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

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
  const total = useMemo(() => totalPrice().toFixed(2), [items, totalPrice]);

  const openCheckout = () => {
    if (items.length === 0) return;
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => setIsCheckoutOpen(false);

  const handlePlaceOrder = () => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);
    setTimeout(() => {
      setIsCheckoutOpen(false);
      router.push('/payment-gateway');
    }, 900);
  };

  const CheckoutSummary = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div>
          <p className="text-sm font-semibold text-gray-900">Delivery</p>
          <p className="text-xs text-gray-500 mt-0.5">Select Method</p>
        </div>
        <button
          type="button"
          className="text-sm font-semibold text-gray-700 flex items-center gap-1"
          aria-label="Choose delivery method"
        >
          Select
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div>
          <p className="text-sm font-semibold text-gray-900">Payment</p>
          <p className="text-xs text-gray-500 mt-0.5">Select Method</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span className="inline-block w-5 h-3 rounded-sm bg-gradient-to-r from-blue-600 to-red-500" />
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div>
          <p className="text-sm font-semibold text-gray-900">Promo Code</p>
          <p className="text-xs text-gray-500 mt-0.5">Pick discount</p>
        </div>
        <button
          type="button"
          className="text-sm font-semibold text-gray-700 flex items-center gap-1"
          aria-label="Apply promo code"
        >
          Add
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between py-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">Total Cost</p>
          <p className="text-xs text-gray-500 mt-0.5">Including VAT</p>
        </div>
        <p className="text-lg font-bold text-gray-900">${total}</p>
      </div>

      <p className="text-xs text-gray-500">
        By placing an order you agree to our{' '}
        <span className="text-gray-900 font-semibold">Terms and Conditions</span>
      </p>

      <Button variant="primary" onClick={handlePlaceOrder} disabled={items.length === 0} isLoading={isPlacingOrder}>
        Place Order
      </Button>
    </div>
  );

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pb-32 lg:pb-12">
        <div className="max-w-6xl mx-auto lg:px-6">
          <header className="px-5 pt-4 pb-4 bg-white shadow-sm border-b border-gray-100 lg:rounded-3xl lg:border lg:mt-6">
            <Skeleton variant="text" width={120} height={28} className="mx-auto" />
          </header>
          <main className="bg-white mt-4 pb-28 lg:pb-10 lg:px-4 lg:rounded-3xl lg:shadow-sm lg:border border-gray-100">
            <CartItemSkeleton />
            <CartItemSkeleton />
            <CartItemSkeleton />
          </main>
          <div className="fixed bottom-20 left-0 right-0 px-5 z-10 lg:hidden">
            <Skeleton variant="rectangular" height={56} className="w-full rounded-2xl" />
          </div>
        </div>
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>
    );
  }

  const handleIncrement = (productId: string, productName: string) => {
    increment(productId);
    toast.success(`${productName} added`);
  };

  const handleDecrement = (productId: string, productName: string) => {
    decrement(productId);
    toast.success(`${productName} removed`);
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeItem(productId);
    toast.success(`${productName} removed from cart`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-12">
      <div className="max-w-6xl mx-auto lg:px-6 lg:pt-6 lg:pb-10">
        {isAuthenticated && <DesktopNav />}
        {/* Desktop header */}
        <div className="hidden lg:flex items-center justify-between bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-4 mb-4">
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
              <p className="text-xs text-gray-500">Checkout</p>
              <h1 className="text-2xl font-bold text-gray-900">My Cart</h1>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total items</p>
            <p className="text-lg font-semibold text-gray-900">{items.length} products</p>
          </div>
        </div>

        {/* Mobile header */}
        <header className="px-5 pt-4 pb-4 bg-white shadow-sm border-b border-gray-100 lg:hidden">
          <h1 className="text-2xl font-bold text-gray-900 text-center">My Cart</h1>
        </header>

        <div className="lg:grid lg:grid-cols-[1.7fr_1fr] lg:gap-6">
          <main className="bg-white mt-4 pb-28 lg:pb-6 lg:mt-0 lg:rounded-3xl lg:shadow-sm lg:border border-gray-100">
            {items.length === 0 && (
              <div className="text-center text-gray-500 py-20">Your cart is empty</div>
            )}
            {items.length > 0 && (
              <div className="divide-y divide-gray-100">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="relative px-5 py-4 bg-gray-50 flex items-center gap-3 border-b border-gray-200"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(product.id, product.name)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-lg"
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{product.unit}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                          <button
                            type="button"
                            onClick={() => handleDecrement(product.id, product.name)}
                            className="px-3 py-1.5 text-gray-600 hover:text-gray-900"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="px-3 py-1.5 text-sm font-semibold text-gray-900 min-w-[2rem] text-center">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIncrement(product.id, product.name)}
                            className="px-3 py-1.5 text-[#53B175] hover:text-[#45a065]"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <p className="text-sm font-bold text-gray-900">${(product.price * quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* Desktop summary */}
          <aside className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="text-lg font-semibold text-gray-900">${total}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Delivery</p>
              <p className="text-sm font-medium text-gray-900">Free</p>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <p className="text-base font-semibold text-gray-900">Total</p>
              <p className="text-xl font-bold text-gray-900">${total}</p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <CheckoutSummary />
            </div>
          </aside>
        </div>

        {items.length > 0 && (
          <div className="fixed bottom-20 left-0 right-0 px-5 z-10 lg:hidden">
            <button
              type="button"
              onClick={openCheckout}
              className="w-full bg-[#53B175] text-white rounded-2xl py-4 px-4 flex items-center justify-between font-semibold hover:bg-[#45a065] transition-colors"
            >
              <span>Go to Checkout</span>
              <span className="bg-[#45a065] rounded-xl px-4 py-2 font-semibold">
                ${total}
              </span>
            </button>
          </div>
        )}
      </div>

      {isCheckoutOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-end lg:hidden"
          onClick={closeCheckout}
        >
          <div
            className="bg-white w-full rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Checkout</h2>
              <button
                type="button"
                onClick={closeCheckout}
                aria-label="Close checkout"
                className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="px-5 pb-6 pt-4">
              <CheckoutSummary />
            </div>
          </div>
        </div>
      )}

      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}

