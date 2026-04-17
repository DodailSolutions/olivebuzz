import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Building2, Plus } from "lucide-react"
import { getDashboardContext, getAllSchools } from "@/lib/data/queries"
import { SchoolSearch } from "@/components/super-admin/school-search"

export const metadata: Metadata = {
  title: "Schools | Super Admin",
}

const PLAN_COLORS: Record<string, string> = {
  free: "bg-stone-100 text-stone-500",
  starter: "bg-blue-50 text-blue-600",
  pro: "bg-[#808b47]/15 text-[#57714d]",
  enterprise: "bg-[#c4891a]/15 text-[#c4891a]",
}

const PLAN_ORDER = ["free", "starter", "pro", "enterprise"]

export default async function SuperAdminSchoolsPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; q?: string }>
}) {
  const { profile } = await getDashboardContext()
  if (!profile || profile.role !== "super_admin") redirect("/dashboard")

  const schools = await getAllSchools()
  const params = await searchParams
  const planFilter = params.plan || "all"
  const query = (params.q ?? "").toLowerCase()

  const filtered = schools
    .filter((s) => planFilter === "all" || s.plan === planFilter)
    .filter((s) =>
      !query ||
      s.name.toLowerCase().includes(query) ||
      (s.city ?? "").toLowerCase().includes(query) ||
      (s.slug ?? "").toLowerCase().includes(query)
    )

  const planCounts = PLAN_ORDER.reduce(
    (acc, p) => ({ ...acc, [p]: schools.filter((s) => s.plan === p).length }),
    {} as Record<string, number>,
  )

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-stone-900">Schools</h1>
          <p className="mt-1 text-stone-500">{schools.length} schools registered on the platform</p>
        </div>
        <Link
          href="/onboarding/school"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#808b47] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#57714d]"
        >
          <Plus className="h-4 w-4" />
          Add School
        </Link>
      </div>

      {/* Plan filter tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-stone-200 bg-white p-1">
        {["all", ...PLAN_ORDER].map((tab) => (
          <Link
            key={tab}
            href={`/super-admin/schools?plan=${tab}`}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
              planFilter === tab
                ? "bg-[#808b47] text-white shadow-sm"
                : "text-stone-500 hover:bg-stone-50"
            }`}
          >
            {tab}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                planFilter === tab ? "bg-white/30 text-white" : "bg-stone-100 text-stone-500"
              }`}
            >
              {tab === "all" ? schools.length : planCounts[tab] ?? 0}
            </span>
          </Link>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-16">
          <Building2 className="mb-3 h-10 w-10 text-stone-300" />
          <p className="text-sm font-semibold text-stone-500">No schools found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <SchoolSearch />

          <div className="divide-y divide-stone-100">
            {filtered.map((school) => (
              <Link
                key={school.id}
                href={`/super-admin/schools/${school.id}`}
                className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-stone-50"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
                  style={{ backgroundColor: school.theme_primary || "#808b47" }}
                >
                  {school.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-900">{school.name}</p>
                  <p className="text-xs text-stone-500">
                    {school.city ? `${school.city}${school.country ? `, ${school.country}` : ""} · ` : ""}
                    {school.student_count.toLocaleString()} students · /{school.slug}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                      PLAN_COLORS[school.plan] || "bg-stone-100 text-stone-400"
                    }`}
                  >
                    {school.plan}
                  </span>
                  <span className="text-xs text-stone-400">{formatDate(school.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
