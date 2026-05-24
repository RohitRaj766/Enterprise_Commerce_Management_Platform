'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';

const CART_COUPON_STORAGE_KEY = 'nectar-applied-coupon';

type AppliedCoupon = {
  code: string;
  title: string;
  type: 'percent' | 'flat';
  value: number;
  discountAmount: number;
};

export default function PaymentGatewayPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_COUPON_STORAGE_KEY);
      if (raw) {
        setAppliedCoupon(JSON.parse(raw) as AppliedCoupon);
      }
    } catch {
      setAppliedCoupon(null);
    }
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );
  const couponDiscount = appliedCoupon?.discountAmount ?? 0;
  const total = Math.max(0, subtotal - couponDiscount);

  const placeOrder = async () => {
    if (isPlacingOrder || items.length === 0) return;
    setIsPlacingOrder(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            unit: item.product.unit,
            price: item.product.price,
            quantity: item.quantity,
          })),
          coupon: appliedCoupon,
          simulateFailure,
        }),
      });

      if (!res.ok) throw new Error('Checkout failed');

      clear();
      localStorage.removeItem(CART_COUPON_STORAGE_KEY);
      toast.success('Order placed successfully');
      router.push('/order-success');
    } catch {
      toast.error('Checkout failed');
      router.push('/order-failure');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18L9 12L15 6" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900 mx-auto lg:mx-0">Payment Gateway</h1>
        </div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-2xl w-full mx-auto space-y-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Checkout summary</h2>
              <p className="text-sm text-gray-500">Review your cart before placing the order.</p>
            </div>
            <span className="text-sm font-semibold text-gray-700">{items.length} item(s)</span>
          </div>

          <div className="space-y-2 pt-2">
            {items.length === 0 ? (
              <p className="text-sm text-gray-500">Your cart is empty.</p>
            ) : (
              items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-gray-500">Qty: {quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">${(product.price * quantity).toFixed(2)}</p>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-500">Subtotal</p>
            <p className="text-lg font-bold text-gray-900">${subtotal.toFixed(2)}</p>
          </div>

          {appliedCoupon && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-2">
              <div>
                <p className="text-sm text-gray-500">Discount</p>
                <p className="text-xs font-medium text-[#53B175]">{appliedCoupon.code}</p>
              </div>
              <p className="text-lg font-bold text-[#53B175]">- ${couponDiscount.toFixed(2)}</p>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-100 pt-2">
            <p className="text-sm font-semibold text-gray-900">Total</p>
            <p className="text-lg font-bold text-gray-900">${total.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#53B175]/10 flex items-center justify-center text-[#53B175] font-bold text-xl">
              ✓
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Mock payment gateway</h2>
              <p className="text-sm text-gray-600 mt-1">Submit the order to the checkout endpoint and continue to the accepted screen.</p>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(event) => setSimulateFailure(event.target.checked)}
            />
            Force failure for demo
          </label>
          <Button variant="primary" onClick={placeOrder} isLoading={isPlacingOrder} disabled={items.length === 0}>
            Place order
          </Button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-500 font-bold text-xl">
              !
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Failure path</h2>
              <p className="text-sm text-gray-600 mt-1">Toggle failure and submit to mirror a failed transaction.</p>
            </div>
          </div>
          <Button variant="secondary" onClick={placeOrder} isLoading={isPlacingOrder} disabled={items.length === 0}>
            Submit checkout
          </Button>
        </div>
      </main>
    </div>
  );
}
