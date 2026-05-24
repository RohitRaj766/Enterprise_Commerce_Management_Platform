import { NextResponse } from 'next/server'

type CouponDefinition = {
  code: string
  title: string
  type: 'percent' | 'flat'
  value: number
}

const coupons: CouponDefinition[] = [
  { code: 'SAVE10', title: '10% off your order', type: 'percent', value: 10 },
  { code: 'WELCOME5', title: '$5 off your first order', type: 'flat', value: 5 },
  { code: 'FRESH15', title: '15% off fresh picks', type: 'percent', value: 15 },
]

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const rawCode = String(body.code ?? '').trim().toUpperCase()
  const subtotal = Number(body.subtotal ?? 0)

  if (!rawCode) {
    return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
  }

  const coupon = coupons.find((entry) => entry.code === rawCode)
  if (!coupon) {
    return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 })
  }

  const discountAmount = coupon.type === 'percent'
    ? (subtotal * coupon.value) / 100
    : coupon.value

  return NextResponse.json({
    coupon: {
      code: coupon.code,
      title: coupon.title,
      type: coupon.type,
      value: coupon.value,
      discountAmount: Number(discountAmount.toFixed(2)),
    },
  })
}
