'use client';

import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard = ({ product, compact = false }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const toggleFavorite = useProductStore((state) => state.toggleFavorite);
  const favorites = useProductStore((state) => state.favorites);

  const isFavorite = useMemo(() => favorites.has(product.id), [favorites, product.id]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative w-full h-32 mb-3 overflow-hidden rounded-xl bg-gray-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="200px"
            className="object-contain"
          />
          <button
            type="button"
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(product.id);
              if (isFavorite) {
                toast.success(`${product.name} removed from favorites`);
              } else {
                toast.success(`${product.name} added to favorites`);
              }
            }}
            aria-label="Toggle favorite"
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
      </Link>
      <div className="space-y-1">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
        </Link>
        <p className="text-xs text-gray-500">{product.unit}</p>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${product.oldPrice.toFixed(2)}
              </span>
            )}
          </div>
          {!compact && (
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-[#53B175] text-white flex items-center justify-center"
              aria-label="Add to cart"
              onClick={() => {
                addItem(product);
                toast.success(`${product.name} added to cart`);
              }}
            >
              +
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

