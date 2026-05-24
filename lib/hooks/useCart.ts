import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetcher } from '../apiClient'
import type { Product } from '@/types'

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const data = await fetcher('/api/cart')
      return data?.cart?.items ?? []
    },
  })
}

export function useAddToCart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { product: Product; qty: number }) => {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': '1' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}
