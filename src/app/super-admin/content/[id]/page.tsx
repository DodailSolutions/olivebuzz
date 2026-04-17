import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getDashboardContext, getCMSArticleById } from "@/lib/data/queries"
import { ArticleEditor } from "@/components/cms/article-editor"

export const metadata: Metadata = {
  title: "Edit Article | Super Admin",
}

export default async function SuperAdminEditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  const { profile } = await getDashboardContext()
  if (!profile || profile.role !== "super_admin") redirect("/dashboard")

  const { id } = await params
  const article = await getCMSArticleById(id)
  if (!article) redirect("/super-admin/content")

  const sp = await searchParams

  return (
    <div>
      {sp.saved && (
        <div className="border-b border-[#808b47]/30 bg-[#808b47]/10 px-6 py-2 text-sm font-medium text-[#57714d]">
          ✓ Article saved successfully
        </div>
      )}
      {sp.error && (
        <div className="border-b border-red-200 bg-red-50 px-6 py-2 text-sm text-red-700">
          {decodeURIComponent(sp.error)}
        </div>
      )}
      <ArticleEditor
        article={article}
        schoolId={null}
        backHref="/super-admin/content"
        mode="super_admin"
      />
    </div>
  )
}
