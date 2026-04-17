import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getDashboardContext, getSchoolById } from "@/lib/data/queries"
import { updateSchoolSettings } from "@/app/actions/cms"

export const metadata: Metadata = {
  title: "School Settings | Super Admin",
}

const PLANS = ["free", "starter", "pro", "enterprise"] as const

export default async function SuperAdminSchoolDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  const { profile } = await getDashboardContext()
  if (!profile || profile.role !== "super_admin") redirect("/dashboard")

  const { id } = await params
  const school = await getSchoolById(id)
  if (!school) redirect("/super-admin/schools")

  const sp = await searchParams

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/super-admin/schools"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Schools
        </Link>
        <h1 className="text-3xl font-black text-stone-900">{school.name}</h1>
        <p className="mt-1 text-stone-500">/{school.slug} · School ID: {school.id}</p>
      </div>

      {sp.saved && (
        <div className="rounded-xl border border-[#808b47]/30 bg-[#808b47]/10 px-4 py-3 text-sm font-medium text-[#57714d]">
          ✓ School settings saved
        </div>
      )}
      {sp.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {decodeURIComponent(sp.error)}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* School Settings Form */}
        <div className="lg:col-span-2 space-y-5">
          <form action={updateSchoolSettings} className="rounded-2xl border border-stone-200 bg-white p-6 space-y-5">
            <input type="hidden" name="school_id" value={school.id} />
            <h2 className="font-bold text-stone-900">School Information</h2>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                School Name
              </label>
              <input
                name="name"
                defaultValue={school.name}
                required
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-[#808b47] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">City</label>
                <input
                  name="city"
                  defaultValue={school.city || ""}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-[#808b47] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Country</label>
                <input
                  name="country"
                  defaultValue={school.country || ""}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-[#808b47] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                Subscription Plan
              </label>
              <select
                name="plan"
                defaultValue={school.plan}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-[#808b47] focus:bg-white"
              >
                {PLANS.map((p) => (
                  <option key={p} value={p} className="capitalize">
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                Brand Color (primary)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name="theme_primary"
                  defaultValue={school.theme_primary || "#808b47"}
                  className="h-10 w-12 cursor-pointer rounded-lg border border-stone-200 p-0.5"
                />
                <input
                  type="text"
                  defaultValue={school.theme_primary || "#808b47"}
                  className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 font-mono text-sm outline-none focus:border-[#808b47]"
                  readOnly
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#808b47] py-3 text-sm font-bold text-white hover:bg-[#57714d]"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="mb-4 font-bold text-stone-900">School Stats</h3>
            <div className="space-y-3">
              {[
                { label: "Students", value: school.student_count?.toLocaleString() ?? "—" },
                { label: "Plan", value: school.plan },
                { label: "Created", value: formatDate(school.created_at) },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <p className="text-xs text-stone-500">{s.label}</p>
                  <p className="text-xs font-semibold text-stone-900 capitalize">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="mb-3 font-bold text-stone-900">Brand Preview</h3>
            <div
              className="flex h-16 w-full items-center justify-center rounded-xl text-lg font-black text-white"
              style={{ backgroundColor: school.theme_primary || "#808b47" }}
            >
              {school.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <h3 className="mb-2 text-sm font-bold text-red-800">Danger Zone</h3>
            <button
              disabled
              className="w-full rounded-xl border border-red-200 py-2 text-xs font-medium text-red-500 opacity-60 cursor-not-allowed"
            >
              Suspend School (contact support)
            </button>
          </div>
        </div>
      </div>
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
