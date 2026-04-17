import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { PenTool } from "lucide-react"
import { getDashboardContext } from "@/lib/data/queries"
import { CreatePost } from "@/components/feed/create-post"

export const metadata: Metadata = {
  title: "New Post | Olive Buzz",
}

export default async function CreatePostPage() {
  const { profile, school, error } = await getDashboardContext()
  if (error || !profile) redirect("/login")

  const allowed = ["school_admin", "super_admin", "content_manager", "teacher", "student"]
  if (!allowed.includes(profile.role)) redirect("/dashboard")
  if (!school) redirect("/dashboard")

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2.5">
        <PenTool className="h-5 w-5 text-[#808b47]" />
        <h1 className="text-2xl font-black text-stone-900">New Post</h1>
      </div>
      <p className="text-sm text-stone-500">
        Share something with your school community.
      </p>
      <CreatePost profile={profile} />
    </div>
  )
}
