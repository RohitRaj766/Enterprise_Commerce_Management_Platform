import { NextResponse } from 'next/server'
import prisma from '@/server/prisma'
import { getUserIdFromReq } from '@/server/middleware/withAuth'

export async function GET(req: Request) {
  const userId = getUserIdFromReq(req)
  if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  const cart = await prisma.cart.findFirst({ where: { userId } })
  return NextResponse.json({ cart: cart ?? null })
}

export async function POST(req: Request) {
  const userId = getUserIdFromReq(req)
  if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const { product, qty } = body
  if (!product || !qty) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  // simple cart: create or update
  let cart = await prisma.cart.findFirst({ where: { userId } })
  const item = { product, quantity: Number(qty) }
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId, items: [item] } })
    return NextResponse.json({ cart })
  }

  const items = Array.isArray(cart.items) ? cart.items : JSON.parse(cart.items)
  const existing = items.find((it: any) => it.product?.id === product.id)
  if (existing) existing.qty = existing.qty + Number(qty)
  else items.push(item)

  const updated = await prisma.cart.update({ where: { id: cart.id }, data: { items } })
  return NextResponse.json({ cart: updated })
}
