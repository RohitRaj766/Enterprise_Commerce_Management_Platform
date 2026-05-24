export type FetchOptions = {
  retries?: number
  timeoutMs?: number
  headers?: Record<string, string>
  signal?: AbortSignal
}

export async function fetcher(url: string, opts: FetchOptions = {}) {
  const { retries = 2, headers, signal } = opts
  let attempt = 0

  while (true) {
    try {
      const controller = new AbortController()
      if (signal) signal.addEventListener('abort', () => controller.abort())
      const fetchSignal = controller.signal

      const res = await fetch(url, { headers, signal: fetchSignal })
      if (!res.ok) {
        const text = await res.text()
        const err: any = new Error(`HTTP ${res.status}: ${text}`)
        err.status = res.status
        throw err
      }
      const data = await res.json().catch(() => null)
      return data
    } catch (err) {
      const e: any = err
      if (e.name === 'AbortError') throw e
      if (attempt >= retries) throw e
      attempt += 1
      const delay = Math.min(1000 * 2 ** attempt, 30000)
      await new Promise(r => setTimeout(r, delay))
    }
  }
}
