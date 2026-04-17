import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { FileText, Plus } from "lucide-react"
import { getDashboardContext, getPlatformCMSArticles } from "@/lib/data/queries"
import type { CMSListItem } from "@/types"

export const metadata: Metadata = {
  title: "Platform Content | Super Admin",
}

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
  { key: "pending", label: "Pending Review" },
] as const

const STATUS_COLORS: Record<string, string> = {
  published: "bg-[#808b47]/15 text-[#57714d]",
  draft: "bg-stone-100 text-stone-500",
  pending: "bg-amber-50 text-amber-700",
  archived: "bg-red-50 text-red-600",
}

export default async function SuperAdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { profile } = await getDashboardContext()
  if (!profile || profile.role !== "super_admin") redirect("/dashboard")

  const articles = await getPlatformCMSArticles()
  const params = await searchParams
  const filter = params.filter || "all"

  const filtered =
    filter === "all"
      ? articles
      : articles.filter((a) => a.status === filter)

  const counts = STATUS_TABS.reduce(
    (acc, tab) => ({
      ...acc,
      [tab.key]: tab.key === "all" ? articles.length : articles.filter((a) => a.status === tab.key).length,
    }),
    {} as Record<string, number>,
  )

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-stone-900">Platform Content</h1>
          <p className="mt-1 text-stone-500">Manage articles across all schools</p>
        </div>
        <Link
          href="/super-admin/content/new"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#808b47] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#57714d]"
        >
          <Plus className="h-4 w-4" />
          New Article
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-stone-200 bg-white p-1">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`/super-admin/content?filter=${tab.key}`}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === tab.key
                ? "bg-[#808b47] text-white shadow-sm"
                : "text-stone-500 hover:bg-stone-50"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                filter === tab.key ? "bg-white/30 text-white" : "bg-stone-100 text-stone-500"
              }`}
            >
              {counts[tab.key]}
            </span>
          </Link>
        ))}
      </div>

      {/* Articles List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-20">
          <FileText className="mb-3 h-12 w-12 text-stone-300" />
          <p className="text-sm font-semibold text-stone-500">No articles found</p>
          <Link
            href="/super-admin/content/new"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#808b47] px-4 py-2 text-sm font-bold text-white hover:bg-[#57714d]"
          >
            <Plus className="h-4 w-4" />
            Create first article
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white divide-y divide-stone-100">
          {filtered.map((article) => (
            <ArticleRow key={article.id} article={article} basePath="/super-admin/content" />
          ))}
        </div>
      )}
    </div>
  )
}

function calcScore(article: CMSListItem): number {
  const cms = article.cms
  if (!cms) return 0
  let score = 0
  if (cms.meta_title && cms.meta_title.length >= 30 && cms.meta_title.length <= 70) score += 15
  if (cms.meta_description && cms.meta_description.length >= 100 && cms.meta_description.length <= 160) score += 15
  if (cms.focus_keyword && cms.meta_title?.toLowerCase().includes(cms.focus_keyword.toLowerCase())) score += 20
  if (cms.focus_keyword && cms.meta_description?.toLowerCase().includes(cms.focus_keyword.toLowerCase())) score += 10
  if ((cms.body?.split(/\s+/).filter(Boolean).length ?? 0) >= 300) score += 15
  if (cms.featured_image) score += 10
  if (cms.og_image) score += 10
  if (cms.slug && /^[a-z0-9-]+$/.test(cms.slug)) score += 5
  return score
}

function ArticleRow({ article, basePath }: { article: CMSListItem; basePath: string }) {
  const score = calcScore(article)
  const scoreColor =
    score >= 80 ? "text-[#57714d] bg-[#808b47]/15" :
    score >= 55 ? "text-amber-700 bg-amber-50" :
    "text-red-600 bg-red-50"

  return (
    <Link
      href={`${basePath}/${article.id}`}
      className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-stone-50"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-900 truncate">{article.title}</p>
        <p className="mt-0.5 text-xs text-stone-500 truncate">{article.excerpt}</p>
        <p className="mt-1 text-xs text-stone-400">
          {article.author_name} ·{" "}
          {new Date(article.updated_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })}
          {article.cms?.category ? ` · ${article.cms.category}` : ""}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden sm:flex flex-col items-end gap-0.5 w-20">
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] text-stone-400">SEO</span>
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${scoreColor}`}>
              {score}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
            <div
              className={`h-full rounded-full transition-all ${
                score >= 80 ? "bg-[#808b47]" : score >= 55 ? "bg-amber-400" : "bg-red-400"
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
            STATUS_COLORS[article.status] || "bg-stone-100 text-stone-500"
          }`}
        >
          {article.status}
        </span>
      </div>
    </Link>
  )
}

