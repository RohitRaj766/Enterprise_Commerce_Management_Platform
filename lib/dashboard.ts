import { z } from 'zod'

export type WidgetType = 'revenue' | 'orders' | 'customers'
export type WidgetSize = 1 | 2 | 3

export type DashboardWidget = {
  id: string
  type: WidgetType
  title: string
  value: string
  size: WidgetSize
}

export type DashboardLayout = {
  order: string[]
  sizes: Record<string, WidgetSize>
}

export type DashboardPayload = {
  name: string
  widgets: DashboardWidget[]
  layout: DashboardLayout
}

export const widgetTemplates: Record<WidgetType, { title: string; value: string }> = {
  revenue: { title: 'Revenue', value: '$12.4k' },
  orders: { title: 'Recent Orders', value: '18 orders' },
  customers: { title: 'New Customers', value: '42 signups' },
}

export const widgetTypeSchema = z.enum(['revenue', 'orders', 'customers'])

export const dashboardWidgetSchema = z.object({
  id: z.string().min(1),
  type: widgetTypeSchema,
  title: z.string().min(1),
  value: z.string().min(1),
  size: z.number().int().min(1).max(3),
})

export const dashboardPayloadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  widgets: z.array(dashboardWidgetSchema).min(1),
  layout: z.object({
    order: z.array(z.string().min(1)),
    sizes: z.record(z.string(), z.number().int().min(1).max(3)),
  }),
})

export function createWidget(type: WidgetType): DashboardWidget {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    title: widgetTemplates[type].title,
    value: widgetTemplates[type].value,
    size: 1,
  }
}

export function buildDashboardLayout(widgets: DashboardWidget[]): DashboardLayout {
  return {
    order: widgets.map((widget) => widget.id),
    sizes: Object.fromEntries(widgets.map((widget) => [widget.id, widget.size])) as Record<string, WidgetSize>,
  }
}

export function buildDashboardPayload(name: string, widgets: DashboardWidget[]): DashboardPayload {
  return {
    name,
    widgets,
    layout: buildDashboardLayout(widgets),
  }
}

export function reorderWidgets(widgets: DashboardWidget[], draggedId: string, targetId: string): DashboardWidget[] {
  // If the same widget was dragged onto itself, nothing to do
  if (draggedId === targetId) {
    return widgets
  }

  const sourceIndex = widgets.findIndex((widget) => widget.id === draggedId)
  const targetIndex = widgets.findIndex((widget) => widget.id === targetId)

  // If either index is invalid, bail out
  if (sourceIndex < 0 || targetIndex < 0) {
    return widgets
  }

  // Swap the two widgets so the dropped widget occupies the target's slot
  // and the target widget takes the dragged widget's previous slot.
  const nextWidgets = [...widgets]
  const temp = nextWidgets[sourceIndex]
  nextWidgets[sourceIndex] = nextWidgets[targetIndex]
  nextWidgets[targetIndex] = temp

  return nextWidgets
}

export function resizeWidget(widgets: DashboardWidget[], widgetId: string, direction: -1 | 1): DashboardWidget[] {
  return widgets.map((widget) => {
    if (widget.id !== widgetId) {
      return widget
    }

    const nextSize = Math.min(3, Math.max(1, widget.size + direction)) as WidgetSize

    return {
      ...widget,
      size: nextSize,
    }
  })
}

export function coerceDashboardWidgets(rawWidgets: unknown): DashboardWidget[] {
  const parsed = z.array(dashboardWidgetSchema).safeParse(rawWidgets)

  if (!parsed.success) {
    return []
  }

  return parsed.data
}