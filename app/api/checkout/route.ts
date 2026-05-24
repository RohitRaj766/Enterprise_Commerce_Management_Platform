import { NextResponse } from 'next/server'

type CheckoutItem = {
  id: string
  name: string
  unit: string
  price: number
  quantity: number
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const items: CheckoutItem[] = Array.isArray(body.items) ? body.items : []
  const simulateFailure = Boolean(body.simulateFailure)

  if (!items.length) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  if (simulateFailure) {
    return NextResponse.json({ error: 'Payment failed' }, { status: 402 })
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const orderId = `ORD-${Date.now()}`

  return NextResponse.json({
    orderId,
    subtotal,
    status: 'accepted',
  })
}
