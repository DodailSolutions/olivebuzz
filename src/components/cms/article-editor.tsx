"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Eye,
  Globe,
  Image as ImageIcon,
  Loader2,
  Save,
  Search,
  Tag,
  Trash2,
} from "lucide-react"
import type { CMSContent, CMSListItem } from "@/types"
import { createCMSArticle, updateCMSArticle, deleteCMSArticle } from "@/app/actions/cms"

// ─── SEO Score ────────────────────────────────────────────────────

function calcSeoScore(cms: Partial<CMSContent>): { score: number; checks: SeoCheck[] } {
  const checks: SeoCheck[] = []

  const titleLen = (cms.meta_title || cms.title || "").length
  checks.push({
    id: "meta_title_len",
    label: "Meta title is 50–60 characters",
    pass: titleLen >= 50 && titleLen <= 60,
    partial: titleLen > 0 && (titleLen < 50 || titleLen > 60),
    points: 15,
  })

  const descLen = (cms.meta_description || cms.excerpt || "").length
  checks.push({
    id: "meta_desc_len",
    label: "Meta description is 120–160 characters",
    pass: descLen >= 120 && descLen <= 160,
    partial: descLen > 0 && (descLen < 120 || descLen > 160),
    points: 15,
  })

  const kw = (cms.focus_keyword || "").toLowerCase()
  const titleText = (cms.title || "").toLowerCase()
  checks.push({
    id: "kw_in_title",
    label: "Focus keyword appears in title",
    pass: kw.length > 0 && titleText.includes(kw),
    partial: false,
    points: 20,
  })

  const metaDesc = (cms.meta_description || cms.excerpt || "").toLowerCase()
  checks.push({
    id: "kw_in_desc",
    label: "Focus keyword in meta description",
    pass: kw.length > 0 && metaDesc.includes(kw),
    partial: false,
    points: 10,
  })

  const wordCount = (cms.body || "").split(/\s+/).filter(Boolean).length
  checks.push({
    id: "word_count",
    label: "Article body has 300+ words",
    pass: wordCount >= 300,
    partial: wordCount >= 100 && wordCount < 300,
    points: 15,
  })

  checks.push({
    id: "featured_image",
    label: "Featured image is set",
    pass: (cms.featured_image || "").length > 0,
    partial: false,
    points: 10,
  })

  checks.push({
    id: "og_image",
    label: "OG (social share) image is set",
    pass: (cms.og_image || cms.featured_image || "").length > 0,
    partial: false,
    points: 10,
  })

  const slug = (cms.slug || "").toLowerCase()
  checks.push({
    id: "slug",
    label: "URL slug uses only lowercase + hyphens",
    pass: slug.length > 0 && /^[a-z0-9-]+$/.test(slug),
    partial: slug.length > 0,
    points: 5,
  })

  const score = checks.reduce((acc, c) => {
    if (c.pass) return acc + c.points
    if (c.partial) return acc + Math.round(c.points / 2)
    return acc
  }, 0)

  return { score, checks }
}

type SeoCheck = {
  id: string
  label: string
  pass: boolean
  partial: boolean
  points: number
}

function scoreColor(score: number) {
  if (score >= 80) return "text-[#57714d]"
  if (score >= 55) return "text-[#c4891a]"
  return "text-[#e14851]"
}
function scoreBg(score: number) {
  if (score >= 80) return "bg-[#808b47]"
  if (score >= 55) return "bg-[#c4891a]"
  return "bg-[#e14851]"
}
function scoreLabel(score: number) {
  if (score >= 80) return "Good"
  if (score >= 55) return "Needs work"
  return "Poor"
}

// ─── Auto Slug ────────────────────────────────────────────────────

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// ─── Editor Props ─────────────────────────────────────────────────

interface ArticleEditorProps {
  article?: CMSListItem | null
  schoolId?: string | null
  backHref: string
  mode: "super_admin" | "school"
}

const CATEGORIES = [
  "General",
  "School News",
  "Academic",
  "Sports",
  "Arts & Culture",
  "Science & Tech",
  "Community",
  "Alumni",
  "Announcement",
  "Opinion",
]

const SCHEMA_TYPES = ["NewsArticle", "Article", "BlogPosting", "WebPage"] as const

// ─── Component ────────────────────────────────────────────────────

export function ArticleEditor({ article, backHref, mode }: ArticleEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showSeo, setShowSeo] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const existing = article?.cms
  const [form, setForm] = useState<Partial<CMSContent>>({
    title: existing?.title ?? "",
    slug: existing?.slug ?? "",
    excerpt: existing?.excerpt ?? "",
    body: existing?.body ?? "",
    featured_image: existing?.featured_image ?? "",
    category: existing?.category ?? "General",
    tags: existing?.tags ?? [],
    meta_title: existing?.meta_title ?? "",
    meta_description: existing?.meta_description ?? "",
    og_title: existing?.og_title ?? "",
    og_description: existing?.og_description ?? "",
    og_image: existing?.og_image ?? "",
    focus_keyword: existing?.focus_keyword ?? "",
    canonical_url: existing?.canonical_url ?? "",
    schema_type: existing?.schema_type ?? "NewsArticle",
    allow_comments: existing?.allow_comments ?? true,
  })

  const [tagsInput, setTagsInput] = useState((existing?.tags ?? []).join(", "))
  const [slugLocked, setSlugLocked] = useState(!!article)

  // Auto-generate slug from title when creating
  useEffect(() => {
    if (!slugLocked && form.title) {
      setForm((f) => ({ ...f, slug: slugify(form.title || "") }))
    }
  }, [form.title, slugLocked])

  const { score, checks } = calcSeoScore(form)

  const set = (key: keyof CMSContent, value: string | boolean | string[]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSubmit(status: string) {
    const fd = new FormData()
    if (article?.id) fd.set("article_id", article.id)
    Object.entries(form).forEach(([k, v]) => {
      if (Array.isArray(v)) fd.set(k, v.join(", "))
      else if (typeof v === "boolean") { if (v) fd.set(k, "on") }
      else fd.set(k, v as string)
    })
    fd.set("tags", tagsInput)
    fd.set("status", status)
    fd.set("visibility", "public")

    startTransition(async () => {
      if (article?.id) {
        await updateCMSArticle(fd)
      } else {
        await createCMSArticle(fd)
      }
    })
  }

  function handleDelete() {
    const fd = new FormData()
    fd.set("article_id", article!.id)
    startTransition(async () => {
      await deleteCMSArticle(fd)
    })
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* ── Topbar ────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            onClick={() => router.push(backHref)}
            className="text-sm text-stone-500 hover:text-stone-700"
          >
            ← Back
          </button>
          <div className="flex-1">
            <p className="text-sm font-bold text-stone-900 line-clamp-1">{form.title || "Untitled article"}</p>
            <p className="text-xs text-stone-400">
              {article ? `Editing · ${article.status}` : "New article"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* SEO score pill */}
            <button
              onClick={() => setShowSeo((s) => !s)}
              className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white sm:flex ${scoreBg(score)}`}
            >
              SEO {score}/100 · {scoreLabel(score)}
            </button>

            <button
              onClick={() => setShowPreview((s) => !s)}
              className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>

            <button
              onClick={() => handleSubmit("draft")}
              disabled={isPending}
              className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save draft
            </button>

            <button
              onClick={() => handleSubmit("published")}
              disabled={isPending || !form.title}
              className="flex items-center gap-1.5 rounded-lg bg-[#808b47] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#57714d] disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-3.5 w-3.5" />}
              Publish
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className={`grid gap-6 ${showSeo ? "lg:grid-cols-[1fr_360px]" : ""}`}>
          {/* ── Main Editor ───────────────────────────────────── */}
          <div className="space-y-5">
            {/* Title */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Article Title *
              </label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Write a compelling headline..."
                className="w-full text-2xl font-black text-stone-900 placeholder-stone-300 outline-none"
              />
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-stone-400">Slug:</span>
                <input
                  value={form.slug}
                  onChange={(e) => {
                    setSlugLocked(true)
                    set("slug", e.target.value)
                  }}
                  placeholder="url-slug"
                  className="flex-1 rounded-lg bg-stone-50 px-2 py-1 text-xs font-mono text-stone-600 outline-none focus:bg-stone-100"
                />
              </div>
            </div>

            {/* Category + Tags */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  <Tag className="inline h-3.5 w-3.5 mr-1" />
                  Category
                </label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none focus:border-[#808b47]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-stone-400" />
                </div>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="education, news, science"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none focus:border-[#808b47]"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Excerpt / Summary
                </label>
                <span
                  className={`text-xs font-medium ${
                    (form.excerpt || "").length > 160 ? "text-[#e14851]" : "text-stone-400"
                  }`}
                >
                  {(form.excerpt || "").length}/160
                </span>
              </div>
              <textarea
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                rows={3}
                placeholder="A short summary of this article (also used as meta description if not overridden)..."
                className="w-full resize-none text-sm text-stone-700 placeholder-stone-300 outline-none"
              />
            </div>

            {/* Body */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Article Body
                </label>
                <span className="text-xs text-stone-400">
                  {(form.body || "").split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={form.body}
                onChange={(e) => set("body", e.target.value)}
                rows={20}
                placeholder="Write your full article here. You can use Markdown syntax for formatting."
                className="w-full resize-none font-mono text-sm leading-relaxed text-stone-800 placeholder-stone-300 outline-none"
              />
            </div>

            {/* Featured image */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                <ImageIcon className="h-3.5 w-3.5" />
                Featured Image URL
              </label>
              <input
                value={form.featured_image}
                onChange={(e) => set("featured_image", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none focus:border-[#808b47]"
              />
              {form.featured_image && (
                <div className="mt-3 relative h-40 w-full overflow-hidden rounded-xl bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.featured_image}
                    alt="Featured"
                    className="h-full w-full object-cover"
                    onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                  />
                </div>
              )}
            </div>

            {/* Delete */}
            {article && mode === "super_admin" && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <h3 className="text-sm font-bold text-red-800 mb-2">Danger Zone</h3>
                {deleteConfirm ? (
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-red-700">Are you sure? This cannot be undone.</p>
                    <button
                      onClick={handleDelete}
                      disabled={isPending}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(false)}
                      className="text-xs text-stone-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete article
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── SEO Panel ─────────────────────────────────────── */}
          {showSeo && (
            <div className="space-y-4">
              {/* Score */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-[#808b47]" />
                    <h3 className="font-bold text-stone-900">SEO Score</h3>
                  </div>
                  <button
                    onClick={() => setShowSeo(false)}
                    className="text-xs text-stone-400 hover:text-stone-600"
                  >
                    Hide
                  </button>
                </div>

                {/* Score ring */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-stone-100">
                    <span className={`text-2xl font-black ${scoreColor(score)}`}>{score}</span>
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(${score >= 80 ? "#808b47" : score >= 55 ? "#c4891a" : "#e14851"} ${score * 3.6}deg, #f5f0e8 0deg)`,
                        borderRadius: "50%",
                        mask: "radial-gradient(circle at center, transparent 60%, black 60%)",
                        WebkitMask: "radial-gradient(circle at center, transparent 60%, black 60%)",
                      }}
                    />
                  </div>
                  <div>
                    <p className={`text-lg font-black ${scoreColor(score)}`}>{scoreLabel(score)}</p>
                    <p className="text-xs text-stone-500">out of 100 points</p>
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-2">
                  {checks.map((c) => (
                    <div key={c.id} className="flex items-start gap-2">
                      {c.pass ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#808b47]" />
                      ) : c.partial ? (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#c4891a]" />
                      ) : (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#e14851]" />
                      )}
                      <p className="text-xs text-stone-600">{c.label}</p>
                      <span className="ml-auto text-xs text-stone-400">+{c.points}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Google SERP preview */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Google Preview
                </h3>
                <div className="rounded-xl bg-white p-3 shadow-sm border border-stone-100">
                  <p className="text-xs text-stone-400 mb-0.5">
                    olivebuzz.com › {form.slug || "article-slug"}
                  </p>
                  <p className="text-[#1a0dab] text-sm font-medium line-clamp-1 hover:underline cursor-pointer">
                    {form.meta_title || form.title || "Article Title · Olive Buzz"}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-stone-600 line-clamp-2">
                    {form.meta_description || form.excerpt || "Article description will appear here. Make it compelling to increase click-through rate."}
                  </p>
                </div>
                <p className="mt-2 text-[11px] text-stone-400">
                  Title: {(form.meta_title || form.title || "").length}/60 · Desc: {(form.meta_description || form.excerpt || "").length}/160
                </p>
              </div>

              {/* OG Card preview */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Social Share Preview
                </h3>
                <div className="overflow-hidden rounded-xl border border-stone-200">
                  <div className="relative h-28 w-full bg-stone-100">
                    {(form.og_image || form.featured_image) && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={form.og_image || form.featured_image}
                        alt="OG preview"
                        className="h-full w-full object-cover"
                        onError={(e) =>
                          ((e.currentTarget as HTMLImageElement).style.display = "none")
                        }
                      />
                    )}
                    {!(form.og_image || form.featured_image) && (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-xs text-stone-400">No OG image set</p>
                      </div>
                    )}
                  </div>
                  <div className="bg-stone-50 px-3 py-2">
                    <p className="text-[10px] uppercase text-stone-400">olivebuzz.com</p>
                    <p className="text-sm font-semibold text-stone-900 line-clamp-1">
                      {form.og_title || form.meta_title || form.title || "Article Title"}
                    </p>
                    <p className="text-xs text-stone-500 line-clamp-1">
                      {form.og_description || form.meta_description || form.excerpt}
                    </p>
                  </div>
                </div>
              </div>

              {/* SEO Fields */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  SEO Fields
                </h3>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-600">Focus Keyword</label>
                  </div>
                  <input
                    value={form.focus_keyword}
                    onChange={(e) => set("focus_keyword", e.target.value)}
                    placeholder="e.g. school newspaper"
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm outline-none focus:border-[#808b47]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-600">Meta Title</label>
                    <span className={`text-[10px] ${(form.meta_title || "").length > 60 ? "text-[#e14851]" : "text-stone-400"}`}>
                      {(form.meta_title || "").length}/60
                    </span>
                  </div>
                  <input
                    value={form.meta_title}
                    onChange={(e) => set("meta_title", e.target.value)}
                    placeholder="SEO title (if different from article title)"
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm outline-none focus:border-[#808b47]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-600">Meta Description</label>
                    <span className={`text-[10px] ${(form.meta_description || "").length > 160 ? "text-[#e14851]" : "text-stone-400"}`}>
                      {(form.meta_description || "").length}/160
                    </span>
                  </div>
                  <textarea
                    value={form.meta_description}
                    onChange={(e) => set("meta_description", e.target.value)}
                    rows={3}
                    placeholder="SEO meta description (if different from excerpt)..."
                    className="w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm outline-none focus:border-[#808b47]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">OG Title</label>
                  <input
                    value={form.og_title}
                    onChange={(e) => set("og_title", e.target.value)}
                    placeholder="Social share title"
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm outline-none focus:border-[#808b47]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">OG Image URL</label>
                  <input
                    value={form.og_image}
                    onChange={(e) => set("og_image", e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm outline-none focus:border-[#808b47]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Schema Type</label>
                  <select
                    value={form.schema_type}
                    onChange={(e) => set("schema_type", e.target.value as CMSContent["schema_type"])}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm outline-none focus:border-[#808b47]"
                  >
                    {SCHEMA_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Canonical URL (optional)
                  </label>
                  <input
                    value={form.canonical_url}
                    onChange={(e) => set("canonical_url", e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm outline-none focus:border-[#808b47]"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.allow_comments}
                    onChange={(e) => set("allow_comments", e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-xs font-semibold text-stone-600">Allow comments</span>
                </label>
              </div>

              {/* Submit status buttons */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Publish
                </h3>
                <div className="space-y-2">
                  {(["draft", "pending", "published"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSubmit(s)}
                      disabled={isPending}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:opacity-50 ${
                        s === "published"
                          ? "bg-[#808b47] text-white hover:bg-[#57714d]"
                          : "border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {s === "draft" ? "Save as Draft" : s === "pending" ? "Submit for Review" : "Publish Now"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
