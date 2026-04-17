import Link from "next/link"
import {
  Bell,
  BookOpen,
  ChevronRight,
  MessageCircle,
  Newspaper,
  Phone,
  Users,
} from "lucide-react"
import type { Profile, School } from "@/types"
import type { AnnouncementItem } from "@/lib/data/queries"

interface ParentDashboardProps {
  profile: Profile
  school: School | null
  stats: {
    announcements: AnnouncementItem[]
  }
}

export function ParentDashboard({ profile, school, stats }: ParentDashboardProps) {
  const firstName = profile.display_name.split(" ")[0]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-[#808b47]">Welcome, {firstName}!</p>
        <h1 className="text-3xl font-black text-stone-900">Family Updates</h1>
        <p className="mt-1 text-stone-500">
          {school?.name || "Your School"} — {formatDate()}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* My Students */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#808b47]/10">
                  <Users className="h-4 w-4 text-[#808b47]" />
                </div>
                <h2 className="font-bold text-stone-900">My Students</h2>
              </div>
              <Link
                href="/dashboard/students"
                className="flex items-center gap-1 text-sm font-medium text-[#808b47] hover:underline"
              >
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="flex flex-col items-center py-8 text-stone-400">
              <Users className="mb-2 h-8 w-8 opacity-40" />
              <p className="text-sm">Your linked students will appear here.</p>
            </div>
          </div>

          {/* School Announcements */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4891a]/10">
                <Bell className="h-4 w-4 text-[#c4891a]" />
              </div>
              <h2 className="font-bold text-stone-900">School Announcements</h2>
            </div>
            <div className="space-y-3">
              {stats.announcements.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-stone-400">
                  <Bell className="mb-2 h-8 w-8 opacity-40" />
                  <p className="text-sm">No announcements yet.</p>
                </div>
              ) : stats.announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="flex items-start gap-3 rounded-xl border border-stone-100 p-4 transition-colors hover:bg-stone-50"
                >
                  <div
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                      ann.priority === "high" ? "bg-[#e14851]" : "bg-[#808b47]"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-stone-900">{ann.title}</p>
                    <p className="mt-0.5 text-xs text-stone-500">
                      From {ann.from} · {ann.time}
                    </p>
                  </div>
                  {ann.priority === "high" && (
                    <span className="shrink-0 rounded-full bg-[#e14851]/10 px-2 py-0.5 text-xs font-bold text-[#e14851]">
                      Important
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="mb-4 font-bold text-stone-900">Quick Links</h2>
            <div className="space-y-1">
              {[
                { href: "/newspaper", icon: Newspaper, label: "School Newspaper", color: "#808b47" },
                { href: "/dashboard/students", icon: BookOpen, label: "Academic Progress", color: "#c4891a" },
                { href: "#", icon: MessageCircle, label: "Message a Teacher", color: "#57714d" },
                { href: "#", icon: Phone, label: "School Contact Info", color: "#e14851" },
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

          {/* School Info */}
          {school && (
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <h2 className="mb-3 font-bold text-stone-900">School Info</h2>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-stone-900">{school.name}</p>
                {school.city && (
                  <p className="text-stone-500">
                    {school.city}
                    {school.country ? `, ${school.country}` : ""}
                  </p>
                )}
                <p className="text-xs text-stone-400">{school.student_count} students enrolled</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function formatDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}
