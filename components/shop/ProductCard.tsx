"use client"

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/cartStore'
import { useAddToCart } from '@/lib/hooks/useCart'
import { useProductStore } from '@/store/productStore'
import type { Product as CatalogProduct } from '../../lib/hooks/useProducts'
import type { Product as StoreProduct } from '@/types'

type ProductCardProps = {
  product: StoreProduct | CatalogProduct
  compact?: boolean
}

function isStoreProduct(product: StoreProduct | CatalogProduct): product is StoreProduct {
  return 'name' in product && 'unit' in product && 'image' in product
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const toggleFavorite = useProductStore((state) => state.toggleFavorite)
  const favorites = useProductStore((state) => state.favorites)

  if (!isStoreProduct(product)) {
    return (
      <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">{product.title}</h3>
        <p className="mt-1 text-xs text-gray-500">{product.slug}</p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <span className="text-gray-500">Stock: {product.stock}</span>
        </div>
        <div className="mt-3">
          <AddToCartButton product={product} compact />
        </div>
      </article>
    )
  }

  const isFavorite = useMemo(() => favorites.has(product.id), [favorites, product.id])

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative mb-3 h-32 w-full overflow-hidden rounded-xl bg-gray-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="200px"
            className="object-contain"
          />
          <button
            type="button"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80"
            onClick={(event) => {
              event.preventDefault()
              toggleFavorite(product.id)
              if (isFavorite) {
                toast.success(`${product.name} removed from favorites`)
              } else {
                toast.success(`${product.name} added to favorites`)
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
          {!compact && <AddToCartButton product={product} />}
        </div>
      </div>
    </div>
  )
}

export default ProductCard

  function AddToCartButton({ product, compact = false }: { product: any; compact?: boolean }) {
    const addItem = useCartStore((state) => state.addItem)
    const mutation = useAddToCart()

    const handle = async () => {
      try {
        addItem(product)
        await mutation.mutateAsync({ product, qty: 1 })
        toast.success(`${product.name} added to cart`)
      } catch (e) {
        toast.error('Failed to add to cart')
      }
    }

    return (
      <button
        type="button"
        className={`${compact ? 'w-full rounded-xl px-4 py-2 text-sm font-semibold' : 'flex h-9 w-9 items-center justify-center rounded-full'} bg-[#53B175] text-white`}
        aria-label="Add to cart"
        onClick={handle}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Adding...' : compact ? 'Add to cart' : '+'}
      </button>
    )
  }

