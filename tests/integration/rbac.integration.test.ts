// Integration test for RBAC — requires DB migrated & seeded
import { PrismaClient } from '@prisma/client';
import { hasPermission } from '../../server/rbac'; // adjust path if needed

const prisma = new PrismaClient();

jest.setTimeout(30000);

beforeAll(async () => {
  // Ensure migrations & seed ran locally before executing this
});

afterAll(async () => {
  await prisma.$disconnect();
});

test('seeded admin user can read products', async () => {
  const admin = await prisma.user.findUnique({ where: { email: 'admin@example.com' } });
  expect(admin).toBeTruthy();
  const allowed = await hasPermission((admin as any).id, 'product', 'read');
  expect(allowed).toBe(true);
}, 30000);
