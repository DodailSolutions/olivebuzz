import Link from "next/link"
import type { ElementType } from "react"
import {
  ChevronRight,
  FileText,
  Flag,
  Newspaper,
  Settings,
  Shield,
  UserCheck,
  Users,
} from "lucide-react"
import type { Profile, School } from "@/types"
import type { PendingItem, ActivityItem } from "@/lib/data/queries"

interface AdminDashboardProps {
  profile: Profile
  school: School | null
  stats: {
    pendingItems: PendingItem[]
    articlesThisMonth: number
    staffCount: number
    recentActivity: ActivityItem[]
  }
}

export function AdminDashboard({ profile, school, stats }: AdminDashboardProps) {
  const isSuper = profile.role === "super_admin"
  const isContentMgr = profile.role === "content_manager"
  const firstName = profile.display_name.split(" ")[0]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#808b47]">{getGreeting()}</p>
          <h1 className="text-3xl font-black text-stone-900">{firstName}!</h1>
          <p className="mt-1 text-stone-500">
            {isSuper
              ? "Platform overview across all schools"
              : isContentMgr
              ? "Content management hub"
              : `${school?.name || "Your School"} — ${formatDate()}`}
          </p>
        </div>
        <Link
          href="/dashboard/settings/invites"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#808b47] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#57714d]"
        >
          <Users className="h-4 w-4" />
          Invite Members
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Students"
          value={school?.student_count ?? 0}
          icon={Users}
          color="#808b47"
          href="/dashboard/directory"
        />
        <StatCard
          label="Articles This Month"
          value={stats.articlesThisMonth}
          icon={FileText}
          color="#c4891a"
          href="/dashboard/moderation"
        />
        <StatCard
          label="Pending Review"
          value={stats.pendingItems.length}
          icon={Flag}
          color="#e14851"
          href="/dashboard/moderation"
          urgent={stats.pendingItems.length > 0}
        />
        <StatCard
          label="Active Staff"
          value={stats.staffCount}
          icon={UserCheck}
          color="#57714d"
          href="/dashboard/directory"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pending Review Queue */}
        <div className="lg:col-span-2 rounded-2xl border border-stone-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e14851]/10">
                <Flag className="h-4 w-4 text-[#e14851]" />
              </div>
              <h2 className="font-bold text-stone-900">Pending Review</h2>
              {stats.pendingItems.length > 0 && (
                <span className="rounded-full bg-[#e14851] px-2 py-0.5 text-xs font-bold text-white">
                  {stats.pendingItems.length}
                </span>
              )}
            </div>
            <Link
              href="/dashboard/moderation"
              className="flex items-center gap-1 text-sm font-medium text-[#808b47] hover:underline"
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {stats.pendingItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-stone-900">{item.title}</p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    By {item.author} · {item.submitted}
                  </p>
                </div>
                <button className="rounded-lg bg-[#808b47] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#57714d]">
                  Review
                </button>
              </div>
            ))}
            {stats.pendingItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-stone-400">
                <Shield className="mb-2 h-8 w-8 opacity-40" />
                <p className="text-sm">All clear — no pending reviews.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="mb-4 font-bold text-stone-900">Quick Actions</h2>
            <div className="space-y-1">
              {[
                { href: "/dashboard/moderation", icon: Shield, label: "Content Moderation", color: "#e14851" },
                { href: "/dashboard/directory", icon: Users, label: "User Directory", color: "#808b47" },
                { href: "/newspaper", icon: Newspaper, label: "View Newspaper", color: "#c4891a" },
                { href: "/dashboard/settings/invites", icon: Settings, label: "School Settings", color: "#57714d" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-stone-50"
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${action.color}18` }}
                  >
                    <action.icon className="h-4 w-4" style={{ color: action.color }} />
                  </div>
                  <span className="text-sm font-medium text-stone-700 group-hover:text-stone-900">
                    {action.label}
                  </span>
                  <ChevronRight className="ml-auto h-4 w-4 text-stone-300 group-hover:text-stone-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="mb-4 font-bold text-stone-900">Recent Activity</h2>
            <div className="space-y-3">
              {stats.recentActivity.length === 0 ? (
                <p className="py-4 text-center text-xs text-stone-400">No recent activity yet.</p>
              ) : stats.recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <span className="mt-0.5 text-sm">{item.icon}</span>
                  <div>
                    <p className="text-xs text-stone-700">{item.text}</p>
                    <p className="mt-0.5 text-xs text-stone-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  href,
  urgent = false,
}: {
  label: string
  value: number
  icon: ElementType
  color: string
  href: string
  urgent?: boolean
}) {
  return (
    <Link href={href} className="group block">
      <div
        className={`rounded-2xl border bg-white p-5 transition-shadow hover:shadow-md ${
          urgent ? "border-[#e14851]/40" : "border-stone-200"
        }`}
      >
        <div className="flex items-start justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${color}18` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          {urgent && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e14851] text-[10px] font-black text-white">
              !
            </span>
          )}
        </div>
        <p className="mt-4 text-2xl font-black text-stone-900">{value}</p>
        <p className="mt-1 text-xs font-medium text-stone-500">{label}</p>
      </div>
    </Link>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

function formatDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}
