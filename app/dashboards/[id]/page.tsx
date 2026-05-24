import Link from 'next/link'
import { notFound } from 'next/navigation'

import { coerceDashboardWidgets, type DashboardWidget } from '@/lib/dashboard'
import prisma from '@/server/prisma'

type SharedDashboardPageProps = {
  params: Promise<{ id: string }>
}

export default async function SharedDashboardPage({ params }: SharedDashboardPageProps) {
  const { id } = await params
  const dashboardId = Number(id)

  if (!Number.isInteger(dashboardId)) {
    notFound()
  }

  const dashboard = await prisma.dashboard.findUnique({ where: { id: dashboardId } })

  if (!dashboard) {
    notFound()
  }

  const widgets = coerceDashboardWidgets(dashboard.widgets)

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Shared dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{dashboard.name}</h1>
          <p className="mt-2 text-sm text-gray-600">Read-only preview generated from the saved dashboard record.</p>
          <Link href="/dashboard-builder" className="mt-4 inline-flex rounded-full bg-[#53B175] px-4 py-2 text-sm font-semibold text-white">
            Back to builder
          </Link>
        </header>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {widgets.map((widget) => (
              <SharedWidgetCard key={widget.id} widget={widget} />
            ))}

            {widgets.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500 md:col-span-2 xl:col-span-3">
                This dashboard does not contain widgets yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function SharedWidgetCard({ widget }: { widget: DashboardWidget }) {
  const sizeClasses = widget.size === 3 ? 'xl:col-span-3' : widget.size === 2 ? 'xl:col-span-2' : 'xl:col-span-1'

  return (
    <article className={`rounded-2xl border border-gray-200 bg-gray-50 p-4 ${sizeClasses}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{widget.type}</p>
      <h2 className="mt-2 text-lg font-semibold text-gray-900">{widget.title}</h2>
      <p className="mt-3 text-3xl font-bold text-gray-900">{widget.value}</p>
    </article>
  )
}