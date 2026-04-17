import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { getDashboardContext } from "@/lib/data/queries"
import { getPendingPosts } from "@/lib/data/school-queries"
import { ModerationQueue } from "@/components/moderation/moderation-queue"

export const metadata: Metadata = {
  title: "Moderation | Olive Buzz",
}

export default async function ModerationPage() {
  const { profile, school, error } = await getDashboardContext()
  if (error || !profile) redirect("/login")

  const allowed = ["school_admin", "super_admin", "content_manager", "teacher"]
  if (!allowed.includes(profile.role)) redirect("/dashboard")

  const isSuperAdmin = profile.role === "super_admin"
  const posts = await getPendingPosts(school?.id ?? null, isSuperAdmin)

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-[#808b47]" />
          <h1 className="text-2xl font-black text-stone-900">Moderation Queue</h1>
        </div>
        {posts.length > 0 && (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#e14851] px-2 text-xs font-black text-white">
            {posts.length}
          </span>
        )}
      </div>

      <p className="text-sm text-stone-500">
        {isSuperAdmin
          ? "Reviewing pending posts across all schools."
          : `Reviewing pending posts for ${school?.name ?? "your school"}.`}
      </p>

      <ModerationQueue posts={posts} />
    </div>
  )
}
