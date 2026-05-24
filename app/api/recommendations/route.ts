import { NextResponse } from 'next/server'
import { products } from '@/data/products'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const limit = Math.max(1, Math.min(8, Number(url.searchParams.get('limit') ?? '4') || 4))
  const excluded = new Set(
    url.searchParams
      .get('exclude')
      ?.split(',')
      .map((id) => id.trim())
      .filter(Boolean) ?? []
  )

  const prioritized = [
    ...products.filter((product) => (product.isBestSelling || product.isExclusive) && !excluded.has(product.id)),
    ...products.filter((product) => !excluded.has(product.id)),
  ]

  const unique = Array.from(new Map(prioritized.map((product) => [product.id, product])).values())
  return NextResponse.json({ items: unique.slice(0, limit) })
}
