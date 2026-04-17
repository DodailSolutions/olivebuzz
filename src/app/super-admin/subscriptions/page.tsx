import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowUpRight, CreditCard } from "lucide-react"
import { getDashboardContext, getAllSchools } from "@/lib/data/queries"
import { updateSchoolPlan } from "@/app/actions/cms"

export const metadata: Metadata = {
  title: "Subscriptions | Super Admin",
}

const PLANS = ["free", "starter", "pro", "enterprise"] as const

const PLAN_DETAIL: Record<
  string,
  { color: string; bg: string; border: string; price: string; features: string[] }
> = {
  free: {
    color: "text-stone-600",
    bg: "bg-stone-50",
    border: "border-stone-200",
    price: "₹0 / mo",
    features: ["School newspaper", "3 editors", "Basic analytics"],
  },
  starter: {
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    price: "₹499 / mo",
    features: ["Everything in Free", "CMS + editorial workflow", "10 editors", "Email digest"],
  },
  pro: {
    color: "text-[#57714d]",
    bg: "bg-[#808b47]/10",
    border: "border-[#808b47]/30",
    price: "₹1,499 / mo",
    features: [
      "Everything in Starter",
      "Advanced analytics",
      "Custom domain",
      "AI writing tools",
      "Unlimited editors",
    ],
  },
  enterprise: {
    color: "text-[#c4891a]",
    bg: "bg-[#c4891a]/10",
    border: "border-[#c4891a]/30",
    price: "Custom",
    features: [
      "Everything in Pro",
      "Video & audio posts",
      "API access",
      "Dedicated support",
      "SLA guarantee",
    ],
  },
}

export default async function SuperAdminSubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string }>
}) {
  const { profile } = await getDashboardContext()
  if (!profile || profile.role !== "super_admin") redirect("/dashboard")

  const schools = await getAllSchools()
  const sp = await searchParams

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-stone-900">Subscriptions</h1>
          <p className="mt-1 text-stone-500">Manage plan assignments for {schools.length} schools</p>
        </div>
        <Link
          href="/super-admin/features"
          className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
        >
          View Plan Features
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {sp.updated && (
        <div className="rounded-xl border border-[#808b47]/30 bg-[#808b47]/10 px-4 py-3 text-sm font-medium text-[#57714d]">
          ✓ Plan updated successfully
        </div>
      )}

      {/* Plan Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const d = PLAN_DETAIL[plan]
          const count = schools.filter((s) => s.plan === plan).length
          return (
            <div key={plan} className={`rounded-2xl border p-5 ${d.bg} ${d.border}`}>
              <p className={`text-xs font-bold uppercase tracking-wider ${d.color}`}>{plan}</p>
              <p className={`mt-2 text-3xl font-black ${d.color}`}>{count}</p>
              <p className={`text-xs mt-1 ${d.color} opacity-70`}>{count === 1 ? "school" : "schools"}</p>
              <p className={`mt-2 text-xs font-semibold ${d.color}`}>{d.price}</p>
            </div>
          )
        })}
      </div>

      {/* School-by-School Plan Management */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-100 px-5 py-4">
          <h2 className="font-bold text-stone-900">School Plan Management</h2>
        </div>
        <div className="divide-y divide-stone-100">
          {schools.map((school) => {
            const d = PLAN_DETAIL[school.plan] ?? PLAN_DETAIL.free
            return (
              <div key={school.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white"
                    style={{ backgroundColor: school.theme_primary || "#808b47" }}
                  >
                    {school.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-stone-900 truncate">{school.name}</p>
                    <p className="text-xs text-stone-400">
                      {school.city ? `${school.city} · ` : ""}
                      {school.student_count.toLocaleString()} students
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${d.bg} ${d.border} ${d.color}`}>
                    {school.plan}
                  </span>

                  <form action={updateSchoolPlan} className="flex items-center gap-2">
                    <input type="hidden" name="school_id" value={school.id} />
                    <select
                      name="plan"
                      defaultValue={school.plan}
                      className="rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-2 text-xs font-medium outline-none focus:border-[#808b47]"
                    >
                      {PLANS.map((p) => (
                        <option key={p} value={p} className="capitalize">
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-xl bg-[#808b47] px-3 py-2 text-xs font-bold text-white hover:bg-[#57714d]"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      Update
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
