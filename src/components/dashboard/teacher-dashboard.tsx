import Link from "next/link"
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Newspaper,
  PenTool,
  Users,
} from "lucide-react"
import type { Profile, School } from "@/types"
import type { PendingItem } from "@/lib/data/queries"

interface TeacherDashboardProps {
  profile: Profile
  school: School | null
  stats: {
    pendingReviews: PendingItem[]
    studentCount: number
  }
}

export function TeacherDashboard({ profile, school, stats }: TeacherDashboardProps) {
  const firstName = profile.display_name.split(" ")[0]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#808b47]">
            {getGreeting()}, {firstName}!
          </p>
          <h1 className="text-3xl font-black text-stone-900">My Hub</h1>
          <p className="mt-1 text-stone-500">
            {school?.name || "Your School"} — {formatDate()}
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#808b47] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#57714d]"
        >
          <PenTool className="h-4 w-4" />
          New Post
        </Link>
      </div>

      {/* Stat Strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#808b47]/10">
            <BookOpen className="h-5 w-5 text-[#808b47]" />
          </div>
          <p className="mt-4 text-2xl font-black text-stone-900">—</p>
          <p className="mt-1 text-xs font-medium text-stone-500">My Classes</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c4891a]/10">
            <Users className="h-5 w-5 text-[#c4891a]" />
          </div>
          <p className="mt-4 text-2xl font-black text-stone-900">{stats.studentCount}</p>
          <p className="mt-1 text-xs font-medium text-stone-500">Total Students</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e14851]/10">
            <Clock className="h-5 w-5 text-[#e14851]" />
          </div>
          <p className="mt-4 text-2xl font-black text-stone-900">{stats.pendingReviews.length}</p>
          <p className="mt-1 text-xs font-medium text-stone-500">Awaiting Review</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Articles Awaiting Review */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e14851]/10">
                <Clock className="h-4 w-4 text-[#e14851]" />
              </div>
              <h2 className="font-bold text-stone-900">Articles Awaiting Review</h2>
              {stats.pendingReviews.length > 0 && (
                <span className="rounded-full bg-[#e14851] px-2 py-0.5 text-xs font-bold text-white">
                  {stats.pendingReviews.length}
                </span>
              )}
            </div>
            <div className="space-y-3">
              {stats.pendingReviews.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{item.title}</p>
                    <p className="mt-0.5 text-xs text-stone-500">
                      {item.author} · {item.submitted}
                    </p>
                  </div>
                  <button className="flex items-center gap-1.5 rounded-lg bg-[#808b47] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#57714d]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Approve
                  </button>
                </div>
              ))}
              {stats.pendingReviews.length === 0 && (
                <div className="flex flex-col items-center py-8 text-stone-400">
                  <CheckCircle2 className="mb-2 h-8 w-8 opacity-40" />
                  <p className="text-sm">No articles waiting for review.</p>
                </div>
              )}
            </div>
          </div>

          {/* My Classes */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-stone-900">My Classes</h2>
              <Link
                href="/dashboard/classes"
                className="flex items-center gap-1 text-sm font-medium text-[#808b47] hover:underline"
              >
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="flex flex-col items-center py-8 text-stone-400">
              <BookOpen className="mb-2 h-8 w-8 opacity-40" />
              <p className="text-sm">Classes will appear here once set up.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="h-fit rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-stone-900">Quick Actions</h2>
          <div className="space-y-1">
            {[
              { href: "/dashboard/create", icon: PenTool, label: "New Post", color: "#808b47" },
              { href: "/dashboard/classes", icon: BookOpen, label: "My Classes", color: "#57714d" },
              { href: "/newspaper", icon: Newspaper, label: "School Newspaper", color: "#c4891a" },
              { href: "/dashboard/moderation", icon: FileText, label: "Review Articles", color: "#e14851" },
            ].map((action) => (
              <Link
                key={action.label}
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
      </div>
    </div>
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
