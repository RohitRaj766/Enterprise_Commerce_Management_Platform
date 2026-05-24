import { buildDashboardPayload, createWidget, reorderWidgets, resizeWidget } from '../../lib/dashboard'

describe('dashboard helpers', () => {
  it('reorders widgets by drag target', () => {
    const first = createWidget('revenue')
    const second = createWidget('orders')
    const third = createWidget('customers')

    const reordered = reorderWidgets([first, second, third], third.id, first.id)

    // After swapping the dragged widget with the target, the target should
    // occupy the dragged widget's previous index.
    expect(reordered.map((widget) => widget.id)).toEqual([third.id, second.id, first.id])
  })

  it('clamps widget size while resizing', () => {
    const widget = createWidget('revenue')

    const enlarged = resizeWidget([{ ...widget, size: 3 }], widget.id, 1)
    const shrunk = resizeWidget([{ ...widget, size: 1 }], widget.id, -1)

    expect(enlarged[0].size).toBe(3)
    expect(shrunk[0].size).toBe(1)
  })

  it('builds a save payload with layout metadata', () => {
    const widgets = [createWidget('revenue'), createWidget('orders')]
    const payload = buildDashboardPayload('Demo', widgets)

    expect(payload.layout.order).toEqual(widgets.map((widget) => widget.id))
    expect(payload.layout.sizes[widgets[0].id]).toBe(1)
  })
})