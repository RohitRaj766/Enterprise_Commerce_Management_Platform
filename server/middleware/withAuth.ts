export function getUserIdFromReq(req: Request): number | null {
  const id = req.headers.get('x-user-id') || ''
  const n = Number(id)
  if (!id || Number.isNaN(n)) return null
  return n
}
