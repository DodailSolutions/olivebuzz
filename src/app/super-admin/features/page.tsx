import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getDashboardContext, getAllSchools } from "@/lib/data/queries"
import { Info } from "lucide-react"

export const metadata: Metadata = {
  title: "Feature Flags | Super Admin",
}

// Plan-gated features definition
const FEATURES = [
  {
    id: "newspaper",
    label: "School Newspaper",
    description: "Public-facing newspaper with articles, galleries, and events.",
    plans: ["free", "starter", "pro", "enterprise"],
  },
  {
    id: "cms",
    label: "Content Management System",
    description: "Full CMS with SEO tools, editorial workflows, and publishing.",
    plans: ["starter", "pro", "enterprise"],
  },
  {
    id: "analytics",
    label: "Analytics Dashboard",
    description: "Detailed readership analytics, engagement metrics, and reports.",
    plans: ["pro", "enterprise"],
  },
  {
    id: "custom_domain",
    label: "Custom Domain",
    description: "Map your own domain to the school newspaper.",
    plans: ["pro", "enterprise"],
  },
  {
    id: "ai_writing",
    label: "AI Writing Assistant",
    description: "Grammar checking, headline suggestions, and SEO recommendations.",
    plans: ["pro", "enterprise"],
  },
  {
    id: "advanced_media",
    label: "Advanced Media (Video/Audio)",
    description: "Embed video and audio posts in articles.",
    plans: ["enterprise"],
  },
  {
    id: "api_access",
    label: "API Access",
    description: "REST API for external integrations.",
    plans: ["enterprise"],
  },
] as const

const PLANS = ["free", "starter", "pro", "enterprise"] as const

const PLAN_COLORS: Record<string, string> = {
  free: "bg-stone-100 text-stone-600 border-stone-200",
  starter: "bg-blue-50 text-blue-700 border-blue-200",
  pro: "bg-[#808b47]/15 text-[#57714d] border-[#808b47]/30",
  enterprise: "bg-[#c4891a]/15 text-[#c4891a] border-[#c4891a]/30",
}

export default async function SuperAdminFeaturesPage() {
  const { profile } = await getDashboardContext()
  if (!profile || profile.role !== "super_admin") redirect("/dashboard")

  const schools = await getAllSchools()

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-stone-900">Feature Flags</h1>
        <p className="mt-1 text-stone-500">
          Control which features are available per subscription plan.
        </p>
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 flex gap-3">
        <Info className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" />
        <p className="text-sm text-blue-800">
          Feature availability is determined by the school's subscription plan. Upgrade or downgrade
          a school's plan from the{" "}
          <a href="/super-admin/schools" className="font-semibold underline">
            Schools page
          </a>{" "}
          or{" "}
          <a href="/super-admin/subscriptions" className="font-semibold underline">
            Subscriptions page
          </a>
          .
        </p>
      </div>

      {/* Feature matrix */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="px-4 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider w-64">
                  Feature
                </th>
                {PLANS.map((plan) => (
                  <th
                    key={plan}
                    className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider"
                  >
                    <span
                      className={`inline-block rounded-full border px-3 py-1 capitalize ${PLAN_COLORS[plan]}`}
                    >
                      {plan}
                    </span>
                    <p className="mt-1 text-xs font-normal text-stone-400 normal-case">
                      {schools.filter((s) => s.plan === plan).length} school
                      {schools.filter((s) => s.plan === plan).length !== 1 ? "s" : ""}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {FEATURES.map((feature) => (
                <tr key={feature.id} className="hover:bg-stone-50">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-stone-900">{feature.label}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{feature.description}</p>
                  </td>
                  {PLANS.map((plan) => {
                    const enabled = (feature.plans as readonly string[]).includes(plan)
                    return (
                      <td key={plan} className="px-4 py-4 text-center">
                        {enabled ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#808b47] text-white mx-auto">
                            <svg viewBox="0 0 12 10" fill="none" className="h-3 w-3">
                              <path
                                d="M1 5l3.5 3.5L11 1"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        ) : (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 text-stone-300 mx-auto">
                            <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
                              <path
                                d="M2 2l8 8M10 2l-8 8"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Overview */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const schoolsOnPlan = schools.filter((s) => s.plan === plan)
          return (
            <div key={plan} className={`rounded-2xl border p-4 ${PLAN_COLORS[plan]}`}>
              <p className="text-xs font-bold uppercase tracking-wider">{plan}</p>
              <p className="mt-2 text-3xl font-black">{schoolsOnPlan.length}</p>
              <p className="text-xs opacity-70">
                {schoolsOnPlan.length === 1 ? "school" : "schools"}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
