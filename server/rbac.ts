import prisma from './prisma'

type PermEntry = {
  resource: string
  action: string
  field?: string | null
  effect: 'allow' | 'deny'
}

async function collectRoleIds(initialRoleIds: number[]) {
  const seen = new Set<number>()
  const queue = [...initialRoleIds]
  while (queue.length) {
    const id = queue.shift()!
    if (seen.has(id)) continue
    seen.add(id)
    const role = await prisma.role.findUnique({ where: { id }, select: { parentId: true } })
    if (role?.parentId) queue.push(role.parentId)
  }
  return Array.from(seen)
}

export async function hasPermission(userId: number, resource: string, action: string, field?: string | null): Promise<boolean> {
  const userRoles = await prisma.userRole.findMany({ where: { userId }, select: { roleId: true } })
  if (!userRoles.length) return false
  const initialRoleIds = userRoles.map(r => r.roleId)
  const roleIds = await collectRoleIds(initialRoleIds)

  const perms = await prisma.rolePermission.findMany({
    where: { roleId: { in: roleIds } },
    include: { permission: true }
  })

  // precedence: explicit deny (field) -> explicit deny (no field) -> allow (field) -> allow (no field)
  const match = (p: any, eff: string, fld: string | null) => p.effect === eff && p.permission.resource === resource && p.permission.action === action && ((p.permission.field ?? null) === fld)

  // exact field deny
  if (perms.some(p => match(p, 'deny', field ?? null))) return false
  // resource deny
  if (perms.some(p => match(p, 'deny', null))) return false
  // field allow
  if (perms.some(p => match(p, 'allow', field ?? null))) return true
  // resource allow
  if (perms.some(p => match(p, 'allow', null))) return true

  return false
}

export async function listEffectivePermissions(userId: number): Promise<PermEntry[]> {
  const userRoles = await prisma.userRole.findMany({ where: { userId }, select: { roleId: true } })
  const roleIds = await collectRoleIds(userRoles.map(r => r.roleId))
  const perms = await prisma.rolePermission.findMany({ where: { roleId: { in: roleIds } }, include: { permission: true } })
  return perms.map(p => ({ resource: p.permission.resource, action: p.permission.action, field: p.permission.field ?? null, effect: p.effect as PermEntry['effect'] }))
}
