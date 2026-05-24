"use client"
import React, { useEffect, useState } from 'react'

export default function AdminProductsPage() {
  const [userId, setUserId] = useState(1)
  const [products, setProducts] = useState<any[]>([])
  const [permissions, setPermissions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const pRes = await fetch('/api/admin/products', { headers: { 'x-user-id': String(userId) } })
      const pJson = await pRes.json()
      setProducts(pJson.products || [])

      const permRes = await fetch('/api/me/permissions', { headers: { 'x-user-id': String(userId) } })
      const permJson = await permRes.json()
      setPermissions(permJson.permissions || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [userId])

  const canCreate = permissions.some((p: any) => p.effect === 'allow' && p.resource === 'product' && p.action === 'create')
  const canUpdate = permissions.some((p: any) => p.effect === 'allow' && p.resource === 'product' && p.action === 'update')
  const canDelete = permissions.some((p: any) => p.effect === 'allow' && p.resource === 'product' && p.action === 'delete')

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin — Products (demo)</h1>
      <div className="mb-4">
        <label className="mr-2">User ID (x-user-id):</label>
        <input value={userId} onChange={e => setUserId(Number(e.target.value))} className="border px-2 py-1" />
        <button onClick={load} className="ml-2 px-3 py-1 bg-sky-600 text-white rounded">Reload</button>
      </div>

      <div className="mb-4">Permissions: {permissions.length} — <pre className="inline">{JSON.stringify(permissions)}</pre></div>

      {canCreate && (
        <div className="mb-4">
          <CreateProductForm userId={userId} onCreated={load} />
        </div>
      )}

      <div>
        {loading ? <div>Loading...</div> : (
          <ul>
            {products.map(p => (
              <li key={p.id} className="mb-3 border p-3">
                <div className="font-semibold">{p.title}</div>
                <div>Price: ${p.price}</div>
                <div>Stock: {p.stock}</div>
                <div className="mt-2">
                  {canUpdate && <button className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>}
                  {canDelete && <button className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function CreateProductForm({ userId, onCreated }: { userId: number, onCreated: () => void }) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [price, setPrice] = useState(0)
  const [stock, setStock] = useState(0)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-id': String(userId) }, body: JSON.stringify({ title, slug, price, stock }) })
      if (res.ok) {
        setTitle('')
        setSlug('')
        setPrice(0)
        setStock(0)
        onCreated()
      } else {
        const j = await res.json()
        alert('Error: ' + (j.error || res.status))
      }
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="border p-3">
      <div className="mb-2"><input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="border px-2 py-1 w-full" /></div>
      <div className="mb-2"><input placeholder="Slug" value={slug} onChange={e => setSlug(e.target.value)} className="border px-2 py-1 w-full" /></div>
      <div className="mb-2"><input type="number" placeholder="Price" value={price} onChange={e => setPrice(Number(e.target.value))} className="border px-2 py-1" /></div>
      <div className="mb-2"><input type="number" placeholder="Stock" value={stock} onChange={e => setStock(Number(e.target.value))} className="border px-2 py-1" /></div>
      <button disabled={loading} className="px-3 py-1 bg-green-600 text-white rounded">Create</button>
    </form>
  )
}
