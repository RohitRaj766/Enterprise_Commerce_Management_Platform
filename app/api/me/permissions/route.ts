import { NextResponse } from 'next/server'
import { getUserIdFromReq } from '@/server/middleware/withAuth'
import { listEffectivePermissions } from '@/server/rbac'

export async function GET(req: Request) {
  const userId = getUserIdFromReq(req)
  if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  const perms = await listEffectivePermissions(userId)
  return NextResponse.json({ permissions: perms })
}
