import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getDashboardContext } from "@/lib/data/queries"
import { ArticleEditor } from "@/components/cms/article-editor"

export const metadata: Metadata = {
  title: "New Platform Article | Super Admin",
}

export default async function SuperAdminNewArticlePage() {
  const { profile } = await getDashboardContext()
  if (!profile || profile.role !== "super_admin") redirect("/dashboard")

  return (
    <ArticleEditor
      article={null}
      schoolId={null}
      backHref="/super-admin/content"
      mode="super_admin"
    />
  )
}
