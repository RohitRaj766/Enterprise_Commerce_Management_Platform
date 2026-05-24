import { useInfiniteQuery } from '@tanstack/react-query'
import { fetcher } from '../apiClient'
import type { Product } from '@/types'

export type ProductPage = {
  items: Product[]
  nextCursor: string | null
  total: number
}

export function useProducts(limit = 6) {
  return useInfiniteQuery<ProductPage>({
    queryKey: ['products', limit],
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
      const searchParams = new URLSearchParams()
      searchParams.set('limit', String(limit))
      if (pageParam) searchParams.set('cursor', pageParam)
      return fetcher(`/api/products?${searchParams.toString()}`)
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
  })
}
