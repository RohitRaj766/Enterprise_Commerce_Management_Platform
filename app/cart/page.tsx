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
import { useRecommendations } from '@/lib/hooks/useRecommendations';

const CART_COUPON_STORAGE_KEY = 'nectar-applied-coupon';

export default function CartPage() {
  const router = useRouter();
  const { items, increment, decrement, removeItem, totalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    title: string;
    type: 'percent' | 'flat';
    value: number;
    discountAmount: number;
  } | null>(null);

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
  const subtotal = useMemo(() => totalPrice(), [items, totalPrice]);
  const couponDiscount = appliedCoupon?.discountAmount ?? 0;
  const total = useMemo(() => Math.max(0, subtotal - couponDiscount), [subtotal, couponDiscount]);
  const subtotalText = subtotal.toFixed(2);
  const totalText = total.toFixed(2);
  const recommendations = useRecommendations(4, items.map((item) => item.product.id));

  const handleApplyCoupon = async () => {
    setCouponMessage(null);
    setCouponError(null);

    const trimmed = couponCode.trim();
    if (!trimmed) {
      setCouponError('Enter a coupon code to apply a discount.');
      return;
    }

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed, subtotal }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? 'Invalid coupon');
      }

      setAppliedCoupon(data.coupon);
      localStorage.setItem(CART_COUPON_STORAGE_KEY, JSON.stringify(data.coupon));
      setCouponMessage(`${data.coupon.code} applied successfully.`);
      toast.success(`Coupon ${data.coupon.code} applied`);
    } catch (error) {
      setAppliedCoupon(null);
      localStorage.removeItem(CART_COUPON_STORAGE_KEY);
      const message = error instanceof Error ? error.message : 'Failed to apply coupon';
      setCouponError(message);
      toast.error(message);
    }
  };

  const handleClearCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    localStorage.removeItem(CART_COUPON_STORAGE_KEY);
    setCouponError(null);
    setCouponMessage(null);
  };

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
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
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
                            aria-label={`Decrease quantity for ${product.name}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="min-w-8 px-3 py-1.5 text-center text-sm font-semibold text-gray-900">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIncrement(product.id, product.name)}
                            className="px-3 py-1.5 text-[#53B175] hover:text-[#45a065]"
                            aria-label={`Increase quantity for ${product.name}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0">
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
              <p className="text-lg font-semibold text-gray-900">${subtotalText}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Delivery</p>
              <p className="text-sm font-medium text-gray-900">Free</p>
            </div>
            {appliedCoupon && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Discount ({appliedCoupon.code})</p>
                <p className="text-sm font-medium text-[#53B175]">- ${couponDiscount.toFixed(2)}</p>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <p className="text-base font-semibold text-gray-900">Total</p>
              <p className="text-xl font-bold text-gray-900">${totalText}</p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <CheckoutSummary
                items={items}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                appliedCoupon={appliedCoupon}
                couponMessage={couponMessage}
                couponError={couponError}
                couponDiscount={couponDiscount}
                subtotalText={subtotalText}
                totalText={totalText}
                handleApplyCoupon={handleApplyCoupon}
                handleClearCoupon={handleClearCoupon}
                handlePlaceOrder={handlePlaceOrder}
                isPlacingOrder={isPlacingOrder}
              />
            </div>
          </aside>
        </div>

        <section className="mt-6 bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Recommendations</p>
              <h2 className="text-lg font-semibold text-gray-900">You might also like</h2>
            </div>
          </div>

          {recommendations.isLoading ? (
            <p className="mt-4 text-sm text-gray-500">Loading recommendations...</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recommendations.data?.map((product) => (
                <div key={product.id} className="rounded-2xl border border-gray-100 p-2">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={160}
                    height={120}
                    className="mx-auto object-contain"
                  />
                  <div className="p-2">
                    <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {items.length > 0 && (
          <div className="fixed bottom-20 left-0 right-0 px-5 z-10 lg:hidden">
            <button
              type="button"
              onClick={openCheckout}
              className="w-full bg-[#53B175] text-white rounded-2xl py-4 px-4 flex items-center justify-between font-semibold hover:bg-[#45a065] transition-colors"
            >
              <span>Go to Checkout</span>
              <span className="bg-[#45a065] rounded-xl px-4 py-2 font-semibold">
                ${totalText}
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
              <CheckoutSummary
                items={items}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                appliedCoupon={appliedCoupon}
                couponMessage={couponMessage}
                couponError={couponError}
                couponDiscount={couponDiscount}
                subtotalText={subtotalText}
                totalText={totalText}
                handleApplyCoupon={handleApplyCoupon}
                handleClearCoupon={handleClearCoupon}
                handlePlaceOrder={handlePlaceOrder}
                isPlacingOrder={isPlacingOrder}
              />
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

type CheckoutSummaryProps = {
  items: Array<{
    product: {
      id: string;
      name: string;
      unit: string;
      price: number;
    };
    quantity: number;
  }>;
  couponCode: string;
  setCouponCode: (value: string) => void;
  appliedCoupon: {
    code: string;
    title: string;
    type: 'percent' | 'flat';
    value: number;
    discountAmount: number;
  } | null;
  couponMessage: string | null;
  couponError: string | null;
  couponDiscount: number;
  subtotalText: string;
  totalText: string;
  handleApplyCoupon: () => void | Promise<void>;
  handleClearCoupon: () => void;
  handlePlaceOrder: () => void;
  isPlacingOrder: boolean;
};

function CheckoutSummary({
  items,
  couponCode,
  setCouponCode,
  appliedCoupon,
  couponMessage,
  couponError,
  couponDiscount,
  subtotalText,
  totalText,
  handleApplyCoupon,
  handleClearCoupon,
  handlePlaceOrder,
  isPlacingOrder,
}: CheckoutSummaryProps) {
  return (
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
          <span className="inline-block h-3 w-5 rounded-sm bg-linear-to-r from-blue-600 to-red-500" aria-hidden="true" />
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
        {appliedCoupon ? (
          <div className="text-right">
            <p className="text-sm font-semibold text-[#53B175]">{appliedCoupon.code}</p>
            <button type="button" onClick={handleClearCoupon} className="text-xs font-semibold text-gray-500 underline">
              Remove
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
              placeholder="SAVE10"
              className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#53B175] focus:outline-none"
              aria-label="Coupon code"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {couponMessage && <p className="text-xs text-[#53B175]">{couponMessage}</p>}
      {couponError && <p className="text-xs text-red-500">{couponError}</p>}

      {appliedCoupon && (
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">Discount</p>
          <p className="text-sm font-bold text-[#53B175]">- ${couponDiscount.toFixed(2)}</p>
        </div>
      )}

      <div className="flex items-center justify-between py-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">Total Cost</p>
          <p className="text-xs text-gray-500 mt-0.5">Including VAT</p>
        </div>
        <p className="text-lg font-bold text-gray-900">${totalText}</p>
      </div>

      <p className="text-xs text-gray-500">
        By placing an order you agree to our{' '}
        <span className="text-gray-900 font-semibold">Terms and Conditions</span>
      </p>

      <Button variant="primary" onClick={handlePlaceOrder} disabled={items.length === 0} isLoading={isPlacingOrder}>
        Place Order
      </Button>
    </div>
  )
}

