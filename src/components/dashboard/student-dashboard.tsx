import Link from "next/link"
import {
  BookOpen,
  ChevronRight,
  Newspaper,
  PenTool,
  Trophy,
} from "lucide-react"
import type { Profile, School } from "@/types"
import type { ActivityItem } from "@/lib/data/queries"

interface StudentDashboardProps {
  profile: Profile
  school: School | null
  stats: {
    articlesWritten: number
    recentActivity: ActivityItem[]
  }
}

export function StudentDashboard({ profile, school, stats }: StudentDashboardProps) {
  if (profile.age_tier === "kg_5") {
    return <Kg5Dashboard profile={profile} school={school} stats={stats} />
  }
  return <OlderStudentDashboard profile={profile} school={school} stats={stats} />
}

// ─── KG–Grade 5: Simplified, Large, Colorful ────────────────────────────────

const KG5_BUTTONS = [
  {
    href: "/newspaper",
    emoji: "📰",
    label: "Cool Stories",
    sublabel: "Read school news!",
    gradient: "from-[#808b47] to-[#57714d]",
  },
  {
    href: "/dashboard/create",
    emoji: "✏️",
    label: "Write & Draw",
    sublabel: "Make something cool!",
    gradient: "from-[#f2b239] to-[#c4891a]",
  },
  {
    href: "/dashboard/classes",
    emoji: "🎒",
    label: "My Class",
    sublabel: "See what's happening!",
    gradient: "from-[#57714d] to-[#3a5038]",
  },
  {
    href: "#",
    emoji: "⭐",
    label: "My Stars",
    sublabel: "Your achievements!",
    gradient: "from-[#e14851] to-[#a82030]",
  },
]

function Kg5Dashboard({ profile }: StudentDashboardProps) {
  const firstName = profile.display_name.split(" ")[0]

  return (
    <div className="space-y-8">
      {/* Fun Greeting Banner */}
      <div
        className="relative overflow-hidden rounded-3xl p-8 text-white"
        style={{ background: "linear-gradient(135deg, #808b47, #57714d)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10" />

        <p className="relative text-4xl font-black leading-tight">Hey {firstName}! 👋</p>
        <p className="relative mt-2 text-xl text-white/80">Ready for a fun day at school?</p>

        <div className="relative mt-6 inline-flex items-center gap-3 rounded-2xl bg-white/20 px-5 py-3 backdrop-blur-sm">
          <span className="text-2xl">🌟</span>
          <div>
            <p className="text-sm font-bold">You have a 5-day streak!</p>
            <p className="text-xs text-white/70">Keep it up!</p>
          </div>
        </div>
      </div>

      {/* Big Friendly Buttons */}
      <div>
        <h2 className="mb-4 text-2xl font-black text-stone-900">What do you want to do?</h2>
        <div className="grid grid-cols-2 gap-4">
          {KG5_BUTTONS.map((btn) => (
            <Link
              key={btn.href}
              href={btn.href}
              className={`group relative overflow-hidden rounded-3xl bg-linear-to-br ${btn.gradient} p-6 text-white transition-transform hover:scale-[1.02] active:scale-[0.98]`}
            >
              <span className="text-4xl">{btn.emoji}</span>
              <p className="mt-3 text-xl font-black leading-tight">{btn.label}</p>
              <p className="mt-1 text-sm text-white/75">{btn.sublabel}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Achievement Banner */}
      <div className="rounded-3xl border-2 border-[#f2b239] bg-[#f2b239]/10 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#f2b239] text-3xl">
            🏆
          </div>
          <div>
            <p className="text-lg font-black text-stone-900">You&apos;re a Star Writer!</p>
            <p className="text-sm text-stone-600">
              You wrote 3 stories this month. Amazing work, {firstName}!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Grade 6–12: Full Planner Layout ────────────────────────────────────────

function OlderStudentDashboard({ profile, school, stats }: StudentDashboardProps) {
  const firstName = profile.display_name.split(" ")[0]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#808b47]">Welcome back, {firstName}!</p>
          <h1 className="text-3xl font-black text-stone-900">My Dashboard</h1>
          <p className="mt-1 text-stone-500">
            {school?.name || "Your School"} — {formatDate()}
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#808b47] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#57714d]"
        >
          <PenTool className="h-4 w-4" />
          Write Article
        </Link>
      </div>

      {/* Achievement Strip */}
      <div className="flex gap-4 overflow-x-auto pb-1">
        {[
          { label: "Articles Written", value: `${stats.articlesWritten} 📝` },
          { label: "Day Streak", value: "— 🔥" },
          { label: "Reactions Earned", value: "— ❤️" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="shrink-0 rounded-2xl border border-stone-200 bg-white px-5 py-4 text-center"
            style={{ minWidth: "140px" }}
          >
            <p className="text-2xl font-black text-stone-900">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-stone-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Newspaper Feature */}
          <Link
            href="/newspaper"
            className="group flex items-center gap-5 rounded-2xl p-6 transition-shadow hover:shadow-md"
            style={{ background: "linear-gradient(135deg, #808b47, #57714d)" }}
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20">
              <Newspaper className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 text-white">
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">Latest Edition</p>
              <p className="mt-1 text-lg font-black">School Newspaper</p>
              <p className="mt-0.5 text-sm text-white/70">Read today&apos;s stories from your classmates</p>
            </div>
            <ChevronRight className="h-6 w-6 text-white/60 transition-colors group-hover:text-white" />
          </Link>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="mb-4 font-bold text-stone-900">Recent Activity</h2>
            <div className="space-y-2">
              {stats.recentActivity.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-stone-400">
                  <Newspaper className="mb-2 h-8 w-8 opacity-40" />
                  <p className="text-sm">No recent activity yet.</p>
                </div>
              ) : stats.recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-stone-50"
                >
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm text-stone-700">{item.text}</p>
                    <p className="mt-0.5 text-xs text-stone-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="mb-4 font-bold text-stone-900">Quick Links</h2>
            <div className="space-y-1">
              {[
                { href: "/dashboard/classes", icon: BookOpen, label: "My Classes", color: "#808b47" },
                { href: "/dashboard/create", icon: PenTool, label: "Write Article", color: "#c4891a" },
                { href: "/newspaper", icon: Newspaper, label: "School News", color: "#57714d" },
                { href: "#", icon: Trophy, label: "Achievements", color: "#e14851" },
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

          {/* Profile Card */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="mb-4 font-bold text-stone-900">My Profile</h2>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#808b47] text-lg font-black text-white">
                {profile.display_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-stone-900">{profile.display_name}</p>
                <p className="text-xs text-stone-500">
                  {profile.grade || "Student"} · {school?.name || "Olive Buzz"}
                </p>
              </div>
            </div>
            {profile.bio && (
              <p className="mt-3 text-xs leading-relaxed text-stone-500">{profile.bio}</p>
            )}
          </div>
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
