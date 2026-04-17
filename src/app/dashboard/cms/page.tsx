import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { PenTool, Plus, Search } from "lucide-react"
import { getDashboardContext, getSchoolCMSArticles } from "@/lib/data/queries"
import type { CMSListItem } from "@/types"

export const metadata: Metadata = {
  title: "Content Management | Olive Buzz",
}

const STATUS_COLORS: Record<string, string> = {
  published: "bg-[#808b47]/15 text-[#57714d]",
  draft: "bg-stone-100 text-stone-500",
  pending: "bg-[#c4891a]/15 text-[#c4891a]",
  archived: "bg-stone-100 text-stone-400",
}

export default async function SchoolCMSPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; filter?: string }>
}) {
  const { profile, school, error } = await getDashboardContext()
  if (error || !profile) redirect("/login")

  const allowed = ["school_admin", "super_admin", "content_manager", "teacher"]
  if (!allowed.includes(profile.role)) redirect("/dashboard")

  const params = await searchParams
  const articles: CMSListItem[] = school
    ? await getSchoolCMSArticles(school.id)
    : []

  const filter = params.filter || "all"
  const filtered =
    filter === "all" ? articles : articles.filter((a) => a.status === filter)

  const counts = {
    all: articles.length,
    published: articles.filter((a) => a.status === "published").length,
    draft: articles.filter((a) => a.status === "draft").length,
    pending: articles.filter((a) => a.status === "pending").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-stone-900">Content Manager</h1>
          <p className="mt-1 text-stone-500">
            {school?.name || "Your School"} · SEO-ready article publishing
          </p>
        </div>
        <Link
          href="/dashboard/cms/new"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#808b47] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#57714d]"
        >
          <Plus className="h-4 w-4" />
          New Article
        </Link>
      </div>

      {params.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {decodeURIComponent(params.error)}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-stone-200 bg-white p-1">
        {(["all", "published", "draft", "pending"] as const).map((tab) => (
          <Link
            key={tab}
            href={`/dashboard/cms?filter=${tab}`}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === tab
                ? "bg-[#808b47] text-white shadow-sm"
                : "text-stone-500 hover:bg-stone-50"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                filter === tab ? "bg-white/30 text-white" : "bg-stone-100 text-stone-500"
              }`}
            >
              {counts[tab]}
            </span>
          </Link>
        ))}
      </div>

      {/* Articles table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-16">
          <PenTool className="mb-3 h-10 w-10 text-stone-300" />
          <p className="text-sm font-semibold text-stone-500">No articles yet</p>
          <p className="mt-1 text-xs text-stone-400">Create your first SEO-ready article</p>
          <Link
            href="/dashboard/cms/new"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#808b47] px-4 py-2 text-sm font-bold text-white hover:bg-[#57714d]"
          >
            <Plus className="h-4 w-4" />
            New Article
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          {/* Search bar */}
          <div className="flex items-center gap-2 border-b border-stone-100 px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-stone-400" />
            <input
              placeholder="Search articles..."
              className="flex-1 text-sm text-stone-700 outline-none placeholder-stone-400"
            />
          </div>

          <div className="divide-y divide-stone-100">
            {filtered.map((article) => (
              <ArticleRow key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ArticleRow({ article }: { article: CMSListItem }) {
  const statusClass = STATUS_COLORS[article.status] || "bg-stone-100 text-stone-400"
  const seoScore = article.cms
    ? calcQuickSeoScore(article.cms)
    : null

  return (
    <Link
      href={`/dashboard/cms/${article.id}`}
      className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-stone-50"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-stone-900 line-clamp-1">{article.title}</p>
          {article.is_cms && (
            <span className="shrink-0 rounded bg-[#808b47]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#808b47]">
              CMS
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-stone-500 line-clamp-1">{article.excerpt}</p>
        <p className="mt-0.5 text-[11px] text-stone-400">
          By {article.author_name} · {formatDate(article.updated_at)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {seoScore !== null && (
          <div className="hidden sm:flex items-center gap-1">
            <div
              className="h-2 rounded-full bg-stone-100"
              style={{ width: "48px" }}
            >
              <div
                className={`h-2 rounded-full ${seoScore >= 80 ? "bg-[#808b47]" : seoScore >= 55 ? "bg-[#c4891a]" : "bg-[#e14851]"}`}
                style={{ width: `${seoScore}%` }}
              />
            </div>
            <span className={`text-[11px] font-bold ${seoScore >= 80 ? "text-[#57714d]" : seoScore >= 55 ? "text-[#c4891a]" : "text-[#e14851]"}`}>
              {seoScore}
            </span>
          </div>
        )}
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${statusClass}`}>
          {article.status}
        </span>
      </div>
    </Link>
  )
}

function calcQuickSeoScore(cms: NonNullable<CMSListItem["cms"]>): number {
  let score = 0
  const titleLen = (cms.meta_title || cms.title || "").length
  if (titleLen >= 50 && titleLen <= 60) score += 15
  else if (titleLen > 0) score += 7
  const descLen = (cms.meta_description || cms.excerpt || "").length
  if (descLen >= 120 && descLen <= 160) score += 15
  else if (descLen > 0) score += 7
  const kw = (cms.focus_keyword || "").toLowerCase()
  if (kw && (cms.title || "").toLowerCase().includes(kw)) score += 20
  if (kw && (cms.meta_description || cms.excerpt || "").toLowerCase().includes(kw)) score += 10
  if ((cms.body || "").split(/\s+/).filter(Boolean).length >= 300) score += 15
  if (cms.featured_image) score += 10
  if (cms.og_image || cms.featured_image) score += 10
  const slug = (cms.slug || "").toLowerCase()
  if (slug && /^[a-z0-9-]+$/.test(slug)) score += 5
  return score
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
