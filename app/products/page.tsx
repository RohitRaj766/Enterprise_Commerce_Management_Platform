"use client"
import { useMemo } from 'react'
import ProductCard from '../../components/shop/ProductCard'
import { useProducts } from '../../lib/hooks/useProducts'
import { useRecommendations } from '../../lib/hooks/useRecommendations'

export default function ProductsPage() {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useProducts(6)

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  )
  const recommendations = useRecommendations(4, products.map((product) => product.id))

  if (isLoading) return <div className="p-6">Loading products...</div>
  if (isError) return <div className="p-6">Failed to load products.</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <section className="mt-10 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Recommendations</p>
          <h2 className="text-xl font-bold text-gray-900">Picked for you</h2>
        </div>

        {recommendations.isLoading ? (
          <div className="text-sm text-gray-500">Loading recommendations...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.data?.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        )}
      </section>

      {hasNextPage && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="rounded-full bg-[#53B175] px-5 py-3 text-white disabled:opacity-50"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  )
}
