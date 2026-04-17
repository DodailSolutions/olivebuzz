import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getDashboardContext } from "@/lib/data/queries"
import { ArticleEditor } from "@/components/cms/article-editor"

export const metadata: Metadata = {
  title: "New Article | CMS",
}

export default async function NewArticlePage() {
  const { profile, school, error } = await getDashboardContext()
  if (error || !profile) redirect("/login")

  const allowed = ["school_admin", "super_admin", "content_manager", "teacher"]
  if (!allowed.includes(profile.role)) redirect("/dashboard")

  return (
    <ArticleEditor
      article={null}
      schoolId={school?.id ?? null}
      backHref="/dashboard/cms"
      mode="school"
    />
  )
}
