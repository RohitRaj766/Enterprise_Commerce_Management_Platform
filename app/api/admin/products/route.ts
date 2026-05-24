import { NextResponse } from 'next/server'
import prisma from '@/server/prisma'
import { getUserIdFromReq } from '@/server/middleware/withAuth'
import { hasPermission } from '@/server/rbac'

export async function GET() {
  // demo: allow listing to anyone
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: 100 })
  return NextResponse.json({ products })
}

export async function POST(req: Request) {
  const userId = getUserIdFromReq(req)
  if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  const allowed = await hasPermission(userId, 'product', 'create')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  const { title, slug, price = 0, stock = 0 } = body
  if (!title || !slug) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const created = await prisma.product.create({ data: { title, slug, price: Number(price), stock: Number(stock) } })
  return NextResponse.json({ product: created }, { status: 201 })
}
