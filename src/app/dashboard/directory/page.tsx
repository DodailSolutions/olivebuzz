import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Users } from "lucide-react"
import { getDashboardContext } from "@/lib/data/queries"
import { getSchoolMembers } from "@/lib/data/school-queries"

export const metadata: Metadata = {
  title: "Directory | Olive Buzz",
}

const ROLE_COLORS: Record<string, string> = {
  school_admin: "bg-[#808b47]/15 text-[#57714d]",
  super_admin: "bg-purple-50 text-purple-700",
  teacher: "bg-blue-50 text-blue-700",
  content_manager: "bg-amber-50 text-amber-700",
  student: "bg-stone-100 text-stone-600",
  parent: "bg-pink-50 text-pink-700",
  guest: "bg-stone-100 text-stone-500",
}

const ROLE_LABELS: Record<string, string> = {
  school_admin: "Admin",
  super_admin: "Super Admin",
  teacher: "Teacher",
  content_manager: "Content Manager",
  student: "Student",
  parent: "Parent",
  guest: "Guest",
}

type FilterKey = "all" | "student" | "teacher" | "parent" | "staff"

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const { profile, school, error } = await getDashboardContext()
  if (error || !profile) redirect("/login")

  const allowed = ["school_admin", "super_admin", "content_manager", "teacher"]
  if (!allowed.includes(profile.role)) redirect("/dashboard")
  if (!school) redirect("/dashboard")

  const sp = await searchParams
  const roleFilter = (sp.role || "all") as FilterKey

  const members = await getSchoolMembers(school.id)

  const filtered =
    roleFilter === "all"
      ? members
      : roleFilter === "staff"
        ? members.filter((m) => ["school_admin", "content_manager"].includes(m.role))
        : members.filter((m) => m.role === roleFilter)

  const counts: Record<FilterKey, number> = {
    all: members.length,
    student: members.filter((m) => m.role === "student").length,
    teacher: members.filter((m) => m.role === "teacher").length,
    parent: members.filter((m) => m.role === "parent").length,
    staff: members.filter((m) => ["school_admin", "content_manager"].includes(m.role)).length,
  }

  const tabs: FilterKey[] = ["all", "student", "teacher", "parent", "staff"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <Users className="h-5 w-5 text-[#808b47]" />
          <h1 className="text-2xl font-black text-stone-900">School Directory</h1>
        </div>
        <p className="mt-1 text-sm text-stone-500">
          {school.name} · {members.length} member{members.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-stone-200 bg-white p-1">
        {tabs.map((tab) => (
          <Link
            key={tab}
            href={`/dashboard/directory?role=${tab}`}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
              roleFilter === tab
                ? "bg-[#808b47] text-white shadow-sm"
                : "text-stone-500 hover:bg-stone-50"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                roleFilter === tab ? "bg-white/30 text-white" : "bg-stone-100 text-stone-500"
              }`}
            >
              {counts[tab]}
            </span>
          </Link>
        ))}
      </div>

      {/* Members grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-16">
          <Users className="mb-3 h-10 w-10 text-stone-300" />
          <p className="text-sm font-semibold text-stone-500">No members found</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((member) => {
            const initials = member.display_name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)

            return (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 transition-shadow hover:shadow-sm"
              >
                {member.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.avatar_url}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#808b47] text-sm font-black text-white">
                    {initials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-stone-900">
                    {member.display_name}
                  </p>
                  {member.grade && (
                    <p className="text-xs text-stone-400">Grade {member.grade}</p>
                  )}
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${ROLE_COLORS[member.role] ?? "bg-stone-100 text-stone-500"}`}
                  >
                    {ROLE_LABELS[member.role] ?? member.role}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
