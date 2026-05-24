const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding demo data...')
  await prisma.userRole.deleteMany()
  await prisma.rolePermission.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.dashboard.deleteMany()
  await prisma.product.deleteMany()
  await prisma.role.deleteMany()
  await prisma.permission.deleteMany()
  await prisma.user.deleteMany()

  const adminRole = await prisma.role.create({ data: { name: 'Admin' } })
  const merchantRole = await prisma.role.create({ data: { name: 'Merchant', parentId: adminRole.id } })
  const viewerRole = await prisma.role.create({ data: { name: 'Viewer' } })

  const pRead = await prisma.permission.create({ data: { resource: 'product', action: 'read' } })
  const pUpdate = await prisma.permission.create({ data: { resource: 'product', action: 'update' } })
  const pDelete = await prisma.permission.create({ data: { resource: 'product', action: 'delete' } })

  await prisma.rolePermission.createMany({ data: [
    { roleId: adminRole.id, permissionId: pRead.id, effect: 'allow' },
    { roleId: adminRole.id, permissionId: pUpdate.id, effect: 'allow' },
    { roleId: adminRole.id, permissionId: pDelete.id, effect: 'allow' },
    { roleId: viewerRole.id, permissionId: pRead.id, effect: 'allow' }
  ]})

  const adminUser = await prisma.user.create({ data: { email: 'admin@example.com', name: 'Admin User', password: 'password' } })
  await prisma.userRole.create({ data: { userId: adminUser.id, roleId: adminRole.id } })

  for (let i = 1; i <= 12; i++) {
    await prisma.product.create({ data: { title: `Sample Product ${i}`, slug: `sample-product-${i}`, price: 9.99 + i, stock: 10 + i, jsonMeta: {} } })
  }

  console.log('Seed complete')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
