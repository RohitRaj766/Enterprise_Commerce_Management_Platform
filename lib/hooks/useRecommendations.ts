import { useQuery } from '@tanstack/react-query'
import { fetcher } from '../apiClient'
import type { Product } from '@/types'

export function useRecommendations(limit = 4, exclude: string[] = []) {
  return useQuery({
    queryKey: ['recommendations', limit, exclude.join(',')],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      searchParams.set('limit', String(limit))
      if (exclude.length > 0) {
        searchParams.set('exclude', exclude.join(','))
      }
      const data = await fetcher(`/api/recommendations?${searchParams.toString()}`)
      return (data?.items ?? []) as Product[]
    },
  })
}
