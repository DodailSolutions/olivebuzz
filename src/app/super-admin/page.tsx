import type { Metadata } from "next"
import Link from "next/link"
import {
  Activity,
  AlertCircle,
  Building2,
  CreditCard,
  FileText,
  Settings,
  Users,
} from "lucide-react"
import { getDashboardContext, getSuperAdminStats, getAllSchools } from "@/lib/data/queries"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Super Admin | Olive Buzz",
}

const PLAN_COLORS: Record<string, string> = {
  free: "bg-stone-100 text-stone-500",
  starter: "bg-blue-50 text-blue-600",
  pro: "bg-[#808b47]/15 text-[#57714d]",
  enterprise: "bg-[#c4891a]/15 text-[#c4891a]",
}

export default async function SuperAdminPage() {
  const { profile } = await getDashboardContext()
  if (!profile || profile.role !== "super_admin") redirect("/dashboard")

  const [stats, schools] = await Promise.all([getSuperAdminStats(), getAllSchools()])

  const recentSchools = schools.slice(0, 5)

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-stone-900">Platform Overview</h1>
        <p className="mt-1 text-stone-500">
          Welcome back, {profile.display_name.split(" ")[0]}. Here's what's happening across Olive Buzz.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Total Schools",
            value: stats.schools,
            icon: Building2,
            color: "#808b47",
            href: "/super-admin/schools",
          },
          {
            label: "Total Users",
            value: stats.users,
            icon: Users,
            color: "#57714d",
            href: "/super-admin/schools",
          },
          {
            label: "Published Articles",
            value: stats.articles,
            icon: FileText,
            color: "#c4891a",
            href: "/super-admin/content",
          },
          {
            label: "Pending Review",
            value: stats.pending,
            icon: AlertCircle,
            color: "#e14851",
            href: "/super-admin/content?filter=pending",
            urgent: stats.pending > 0,
          },
        ].map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`group block rounded-2xl border bg-white p-5 transition-shadow hover:shadow-md ${
              card.urgent ? "border-[#e14851]/30" : "border-stone-200"
            }`}
          >
            <div className="flex items-start justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${card.color}18` }}
              >
                <card.icon className="h-5 w-5" style={{ color: card.color }} />
              </div>
              {card.urgent && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e14851] text-[10px] font-black text-white">
                  !
                </span>
              )}
            </div>
            <p className="mt-4 text-3xl font-black text-stone-900">{card.value.toLocaleString()}</p>
            <p className="mt-1 text-xs font-medium text-stone-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Schools */}
        <div className="lg:col-span-2 rounded-2xl border border-stone-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-stone-900">Recent Schools</h2>
            <Link
              href="/super-admin/schools"
              className="text-sm font-medium text-[#808b47] hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentSchools.length === 0 ? (
              <p className="py-8 text-center text-sm text-stone-400">No schools found.</p>
            ) : (
              recentSchools.map((s) => (
                <Link
                  key={s.id}
                  href={`/super-admin/schools/${s.id}`}
                  className="group flex items-center justify-between rounded-xl border border-stone-100 p-3 transition-colors hover:bg-stone-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
                      style={{ backgroundColor: s.theme_primary || "#808b47" }}
                    >
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{s.name}</p>
                      <p className="text-xs text-stone-500">
                        {s.city ? `${s.city}, ` : ""}
                        {s.country || ""} · {s.student_count} students
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                      PLAN_COLORS[s.plan] || "bg-stone-100 text-stone-400"
                    }`}
                  >
                    {s.plan}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="mb-4 font-bold text-stone-900">Quick Actions</h2>
            <div className="space-y-1">
              {[
                { href: "/super-admin/schools", icon: Building2, label: "Manage Schools", color: "#808b47" },
                { href: "/super-admin/content/new", icon: FileText, label: "Create Platform Article", color: "#c4891a" },
                { href: "/super-admin/subscriptions", icon: CreditCard, label: "Subscriptions", color: "#57714d" },
                { href: "/super-admin/features", icon: Settings, label: "Feature Flags", color: "#e14851" },
                { href: "/super-admin/settings", icon: Activity, label: "Platform Settings", color: "#808b47" },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-stone-50"
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${a.color}18` }}
                  >
                    <a.icon className="h-4 w-4" style={{ color: a.color }} />
                  </div>
                  <span className="text-sm font-medium text-stone-700 group-hover:text-stone-900">
                    {a.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#808b47]/30 bg-[#808b47]/5 p-5">
            <p className="text-sm font-bold text-stone-900">Platform Health</p>
            <div className="mt-3 space-y-2">
              {[
                { label: "API Status", status: "Operational" },
                { label: "Database", status: "Operational" },
                { label: "Auth Service", status: "Operational" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <p className="text-xs text-stone-600">{item.label}</p>
                  <span className="flex items-center gap-1 text-xs font-medium text-[#57714d]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#808b47]" />
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
