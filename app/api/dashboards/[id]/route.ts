import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

import prisma from '@/server/prisma'
import { dashboardPayloadSchema } from '@/lib/dashboard'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const dashboardId = Number(id)

  if (!Number.isInteger(dashboardId)) {
    return NextResponse.json({ error: 'Invalid dashboard id' }, { status: 400 })
  }

  const dashboard = await prisma.dashboard.findUnique({ where: { id: dashboardId } })

  if (!dashboard) {
    return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 })
  }

  return NextResponse.json({ dashboard })
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const dashboardId = Number(id)

    if (!Number.isInteger(dashboardId)) {
      return NextResponse.json({ error: 'Invalid dashboard id' }, { status: 400 })
    }

    const body = await request.json()
    const parsed = dashboardPayloadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid dashboard payload' }, { status: 400 })
    }

    const dashboard = await prisma.dashboard.update({
      where: { id: dashboardId },
      data: {
        name: parsed.data.name,
        layout: parsed.data.layout as Prisma.InputJsonValue,
        widgets: parsed.data.widgets as Prisma.InputJsonValue,
      },
    })

    return NextResponse.json({ dashboard, shareUrl: `/dashboards/${dashboard.id}` })
  } catch {
    return NextResponse.json({ error: 'Failed to update dashboard' }, { status: 500 })
  }
}