"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  buildDashboardPayload,
  createWidget,
  reorderWidgets,
  resizeWidget,
  type DashboardWidget,
  type WidgetType,
} from '@/lib/dashboard'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

const STORAGE_KEY = 'nectar-dashboard-builder-draft'

function createDefaultWidgets(): DashboardWidget[] {
  return [createWidget('revenue'), createWidget('orders'), createWidget('customers')]
}

export default function DashboardBuilderPage() {
  const router = useRouter()
  const [dashboardName, setDashboardName] = useState('Store manager dashboard')
  const [widgets, setWidgets] = useState<DashboardWidget[]>([])
  const [dashboardId, setDashboardId] = useState<number | null>(null)
  const [shareUrl, setShareUrl] = useState('')
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const itemRefs = useRef(new Map<string, HTMLDivElement | null>())
  const previousRects = useRef(new Map<string, DOMRect>())
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as {
          dashboardName?: string
          dashboardId?: number | null
          shareUrl?: string
          widgets?: DashboardWidget[]
        }

        setDashboardName(parsed.dashboardName || 'Store manager dashboard')
        setDashboardId(parsed.dashboardId ?? null)
        setShareUrl(parsed.shareUrl || '')
        setWidgets(Array.isArray(parsed.widgets) && parsed.widgets.length > 0 ? parsed.widgets : createDefaultWidgets())
      } catch {
        setWidgets(createDefaultWidgets())
      }
    } else {
      setWidgets(createDefaultWidgets())
    }

    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) {
      return
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        dashboardName,
        dashboardId,
        shareUrl,
        widgets,
      }),
    )
  }, [dashboardId, dashboardName, hydrated, shareUrl, widgets])

  const widgetsJson = useMemo(() => JSON.stringify(buildDashboardPayload(dashboardName, widgets), null, 2), [dashboardName, widgets])

  const captureRects = () => {
    const rects = new Map<string, DOMRect>()

    widgets.forEach((widget) => {
      const node = itemRefs.current.get(widget.id)
      if (node) {
        rects.set(widget.id, node.getBoundingClientRect())
      }
    })

    previousRects.current = rects
  }

  useLayoutEffect(() => {
    if (previousRects.current.size === 0) {
      return
    }

    const nextRects = new Map<string, DOMRect>()

    widgets.forEach((widget) => {
      const node = itemRefs.current.get(widget.id)
      if (node) {
        nextRects.set(widget.id, node.getBoundingClientRect())
      }
    })

    previousRects.current.forEach((prevRect, id) => {
      const node = itemRefs.current.get(id)
      const nextRect = nextRects.get(id)

      if (!node || !nextRect) {
        return
      }

      const deltaX = prevRect.left - nextRect.left
      const deltaY = prevRect.top - nextRect.top

      if (deltaX || deltaY) {
        node.style.transform = `translate(${deltaX}px, ${deltaY}px)`
        node.style.transition = 'transform 0s'
      }
    })

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      widgets.forEach((widget) => {
        const node = itemRefs.current.get(widget.id)
        if (node) {
          node.style.transition = 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 220ms ease, opacity 220ms ease'
          node.style.transform = ''
        }
      })
    })

    previousRects.current = new Map()

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [widgets])

  const addWidget = (type: WidgetType) => setWidgets((current) => [...current, createWidget(type)])
  const removeWidget = (id: string) => setWidgets((current) => current.filter((widget) => widget.id !== id))
  const updateTitle = (id: string, title: string) => setWidgets((current) => current.map((widget) => (widget.id === id ? { ...widget, title } : widget)))
  const updateWidgetSize = (id: string, direction: -1 | 1) => setWidgets((current) => resizeWidget(current, id, direction))
  const clearDragState = () => {
    setDraggedId(null)
    setDragOverId(null)
  }
  const saveLayout = async () => {
    setSaveState('saving')

    try {
      const payload = buildDashboardPayload(dashboardName.trim() || 'Store manager dashboard', widgets)
      const endpoint = dashboardId ? `/api/dashboards/${dashboardId}` : '/api/dashboards'
      const method = dashboardId ? 'PUT' : 'POST'
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = (await response.json()) as { dashboard?: { id: number }; shareUrl?: string; error?: string }

      if (!response.ok || !data.dashboard) {
        throw new Error(data.error || 'Failed to save dashboard')
      }

      setDashboardId(data.dashboard.id)
      setShareUrl(`${window.location.origin}${data.shareUrl || `/dashboards/${data.dashboard.id}`}`)
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  const resetLayout = () => {
    const nextWidgets = createDefaultWidgets()
    setDashboardName('Store manager dashboard')
    setWidgets(nextWidgets)
    setDashboardId(null)
    setShareUrl('')
    setSaveState('idle')
    clearDragState()
    localStorage.removeItem(STORAGE_KEY)
  }

  const onDropOnEmptySpace = () => {
    if (!draggedId) {
      return
    }

    captureRects()
    setWidgets((current) => {
      const sourceIndex = current.findIndex((widget) => widget.id === draggedId)
      if (sourceIndex < 0 || sourceIndex === current.length - 1) {
        return current
      }

      const next = [...current]
      const [moved] = next.splice(sourceIndex, 1)
      next.push(moved)
      return next
    })

    clearDragState()
  }

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-[#53B175] hover:text-[#53B175]"
              aria-label="Go back"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Store manager dashboard</p>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">Drag, resize, save, and share store widgets</h1>
              <p className="mt-2 max-w-3xl text-sm text-gray-600">
                This demo covers a grocery store manager dashboard with drag/drop ordering, simple resizing, JSON preview, and a shareable view-only URL.
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Widget palette</h2>
            <div className="mt-4 space-y-3">
              <WidgetAction label="Add revenue widget" onClick={() => addWidget('revenue')} />
              <WidgetAction label="Add orders widget" onClick={() => addWidget('orders')} />
              <WidgetAction label="Add customers widget" onClick={() => addWidget('customers')} />
            </div>

            <div className="mt-6 space-y-3">
              <label className="block text-sm font-semibold text-gray-700" htmlFor="dashboard-name">
                Store name
              </label>
              <input
                id="dashboard-name"
                value={dashboardName}
                onChange={(event) => setDashboardName(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#53B175]"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={saveLayout} className="rounded-full bg-[#53B175] px-4 py-2 text-sm font-semibold text-white">
                {saveState === 'saving' ? 'Saving…' : 'Save layout'}
              </button>
              <button type="button" onClick={resetLayout} className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
                Reset
              </button>
            </div>

            <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">Status</p>
              <p className="mt-1">{saveState === 'saved' ? 'Saved successfully.' : saveState === 'error' ? 'Save failed.' : 'Ready.'}</p>
              {shareUrl && (
                <a href={shareUrl} className="mt-2 block break-all text-[#53B175] underline">
                  {shareUrl}
                </a>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Live layout</h2>
              <span className="text-sm text-gray-500">{widgets.length} widget(s)</span>
            </div>

            <div className="mt-4 grid gap-3 xl:grid-cols-3" onDragOver={(event) => event.preventDefault()} onDrop={onDropOnEmptySpace}>
              {widgets.map((widget) => (
                <DashboardWidgetCard
                  key={widget.id}
                  widget={widget}
                  isDragging={draggedId === widget.id}
                  isDropTarget={dragOverId === widget.id && draggedId !== widget.id}
                  cardRef={(node) => {
                    itemRefs.current.set(widget.id, node)
                  }}
                  onDragStart={() => {
                    captureRects()
                    setDraggedId(widget.id)
                  }}
                  onDragEnd={clearDragState}
                  onDragOver={(event) => {
                    event.preventDefault()
                    setDragOverId(widget.id)
                  }}
                  onDrop={(event) => {
                    event.stopPropagation()

                    if (!draggedId || draggedId === widget.id) {
                      clearDragState()
                      return
                    }

                    captureRects()
                    setWidgets((current) => reorderWidgets(current, draggedId, widget.id))
                    clearDragState()
                  }}
                  onRemove={() => removeWidget(widget.id)}
                  onRename={(title) => updateTitle(widget.id, title)}
                  onResize={(direction) => updateWidgetSize(widget.id, direction)}
                />
              ))}

              {widgets.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500 xl:col-span-3">
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

function DashboardWidgetCard({
  widget,
  isDragging,
  isDropTarget,
  cardRef,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onRemove,
  onRename,
  onResize,
}: {
  widget: DashboardWidget
  isDragging: boolean
  isDropTarget: boolean
  cardRef: (node: HTMLDivElement | null) => void
  onDragStart: () => void
  onDragEnd: () => void
  onDragOver: (event: React.DragEvent<HTMLElement>) => void
  onDrop: (event: React.DragEvent<HTMLElement>) => void
  onRemove: () => void
  onRename: (title: string) => void
  onResize: (direction: -1 | 1) => void
}) {
  const sizeClasses = widget.size === 3 ? 'xl:col-span-3' : widget.size === 2 ? 'xl:col-span-2' : 'xl:col-span-1'

  return (
    <article
      ref={cardRef}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm transition-all duration-200 hover:shadow-md ${sizeClasses} ${isDragging ? 'cursor-grabbing border-[#53B175] bg-emerald-50/80 shadow-lg ring-2 ring-[#53B175]/25 scale-[0.985] opacity-90' : ''} ${isDropTarget ? 'border-dashed border-[#53B175] bg-white shadow-md ring-2 ring-[#53B175]/10' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-full">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="cursor-move rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
              Drag
            </span>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button type="button" onClick={() => onResize(-1)} className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                -
              </button>
              <button type="button" onClick={() => onResize(1)} className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                +
              </button>
              <button type="button" onClick={onRemove} className="shrink-0 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-semibold text-red-600">
                Remove
              </button>
            </div>
          </div>
          <input
            value={widget.title}
            onChange={(event) => onRename(event.target.value)}
            aria-label={`Edit ${widget.type} widget title`}
            title="Widget title"
            className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900"
          />
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-500">Type: {widget.type}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{widget.value}</p>
      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-gray-500">Width {widget.size}/3</p>
    </article>
  )
}

function WidgetAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-800 hover:bg-gray-100">
      {label}
    </button>
  )
}
