"use client"

import { useEffect, useMemo, useState } from 'react'

type WidgetType = 'revenue' | 'orders' | 'customers'

type Widget = {
  id: string
  type: WidgetType
  title: string
  value: string
}

const STORAGE_KEY = 'nectar-dashboard-widgets'

const widgetTemplates: Record<WidgetType, { title: string; value: string }> = {
  revenue: { title: 'Revenue', value: '$12.4k' },
  orders: { title: 'Recent Orders', value: '18 orders' },
  customers: { title: 'New Customers', value: '42 signups' },
}

function createWidget(type: WidgetType): Widget {
  return {
    id: `${type}-${Date.now()}`,
    type,
    title: widgetTemplates[type].title,
    value: widgetTemplates[type].value,
  }
}

export default function DashboardBuilderPage() {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        setWidgets(JSON.parse(raw) as Widget[])
      } catch {
        setWidgets([])
      }
    }
    setHydrated(true)
  }, [])

  const widgetsJson = useMemo(() => JSON.stringify(widgets, null, 2), [widgets])

  const addWidget = (type: WidgetType) => setWidgets((current) => [...current, createWidget(type)])
  const removeWidget = (id: string) => setWidgets((current) => current.filter((widget) => widget.id !== id))
  const updateTitle = (id: string, title: string) => setWidgets((current) => current.map((widget) => widget.id === id ? { ...widget, title } : widget))
  const saveLayout = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets))
  const resetLayout = () => {
    setWidgets([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Dashboard builder</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Widget marketplace and JSON layout editor</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Add widgets, edit titles, remove them, and save the layout as JSON. This is a minimal demo of the configurable dashboard requirement.
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Widget marketplace</h2>
            <div className="mt-4 space-y-3">
              <WidgetAction label="Add revenue widget" onClick={() => addWidget('revenue')} />
              <WidgetAction label="Add orders widget" onClick={() => addWidget('orders')} />
              <WidgetAction label="Add customers widget" onClick={() => addWidget('customers')} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={saveLayout} className="rounded-full bg-[#53B175] px-4 py-2 text-sm font-semibold text-white">
                Save layout
              </button>
              <button type="button" onClick={resetLayout} className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
                Reset
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Live layout</h2>
              <span className="text-sm text-gray-500">{widgets.length} widget(s)</span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {widgets.map((widget) => (
                <article key={widget.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      value={widget.title}
                      onChange={(event) => updateTitle(widget.id, event.target.value)}
                      aria-label={`Edit ${widget.type} widget title`}
                      title="Widget title"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900"
                    />
                    <button type="button" onClick={() => removeWidget(widget.id)} className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-red-600">
                      Remove
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-gray-500">Type: {widget.type}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{widget.value}</p>
                </article>
              ))}

              {widgets.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500 md:col-span-2">
                  Add widgets from the marketplace to build a dashboard.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Layout JSON</h2>
            <span className="text-sm text-gray-500">{hydrated ? 'Synced locally' : 'Loading...'}</span>
          </div>
          <pre className="mt-4 overflow-auto rounded-2xl bg-gray-900 p-4 text-sm text-gray-100">{widgetsJson}</pre>
        </section>
      </div>
    </div>
  )
}

function WidgetAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-800 hover:bg-gray-100">
      {label}
    </button>
  )
}
