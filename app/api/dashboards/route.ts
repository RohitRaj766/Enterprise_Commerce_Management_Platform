import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

import prisma from '@/server/prisma'
import { buildDashboardPayload, dashboardPayloadSchema } from '@/lib/dashboard'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = dashboardPayloadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid dashboard payload' }, { status: 400 })
    }

    const dashboard = await prisma.dashboard.create({
      data: {
        name: parsed.data.name,
        layout: parsed.data.layout as Prisma.InputJsonValue,
        widgets: parsed.data.widgets as Prisma.InputJsonValue,
      },
    })

    return NextResponse.json(
      {
        dashboard,
        payload: buildDashboardPayload(dashboard.name, parsed.data.widgets),
        shareUrl: `/dashboards/${dashboard.id}`,
      },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: 'Failed to create dashboard' }, { status: 500 })
  }
}