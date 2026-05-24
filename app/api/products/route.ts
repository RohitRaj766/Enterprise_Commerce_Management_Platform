import { NextResponse } from 'next/server'
import { products } from '@/data/products'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const limit = Math.max(1, Math.min(12, Number(url.searchParams.get('limit') ?? '6') || 6))
  const cursor = url.searchParams.get('cursor')

  const startIndex = cursor
    ? Math.max(0, products.findIndex((product) => product.id === cursor) + 1)
    : 0

  const items = products.slice(startIndex, startIndex + limit)
  const lastItem = items[items.length - 1]
  const nextCursor = startIndex + limit < products.length && lastItem ? lastItem.id : null

  return NextResponse.json({ items, nextCursor, total: products.length })
}
