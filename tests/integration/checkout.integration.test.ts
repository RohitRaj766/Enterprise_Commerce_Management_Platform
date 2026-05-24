// Integration test for checkout route handler — no dev server required
import { POST } from '../../app/api/checkout/route';

test('checkout endpoint accepts a valid cart payload', async () => {
  const request = new Request('http://localhost/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        { id: '1', name: 'Sample', unit: 'pcs', price: 10, quantity: 2 },
      ],
    }),
  });

  const response = await POST(request);
  expect(response.status).toBe(200);

  const payload = await response.json();
  expect(payload).toMatchObject({
    status: 'accepted',
    subtotal: 20,
  });
});
