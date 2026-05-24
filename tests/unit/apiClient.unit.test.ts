// Unit test for api client (no network)
import { fetcher } from '../../lib/apiClient'; // adjust path if necessary

describe('apiFetch', () => {
  const originalFetch = (global as any).fetch;

  beforeEach(() => {
    (global as any).fetch = jest.fn();
  });

  afterEach(() => {
    (global as any).fetch = originalFetch;
  });

  it('rejects with a network error when fetch throws', async () => {
    (global as any).fetch.mockRejectedValue(new Error('network'));
    await expect(fetcher('/x', { retries: 0 })).rejects.toThrow('network');
  });

  it('returns parsed JSON on 200', async () => {
    (global as any).fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    const res = await fetcher('/ok');
    expect(res).toEqual({ ok: true });
  });
});
