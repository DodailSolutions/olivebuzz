"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const ALLOWED_STATUSES = ["published", "flagged", "removed"] as const
type AllowedStatus = (typeof ALLOWED_STATUSES)[number]

export async function moderatePost(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr || !user) return { error: "Unauthorized" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, school_id")
    .eq("id", user.id)
    .single()

  const allowed = ["school_admin", "super_admin", "content_manager", "teacher"]
  if (!profile || !allowed.includes(profile.role)) return { error: "Forbidden" }

  const postId = formData.get("post_id") as string
  const action = formData.get("action") as string

  if (!UUID_RE.test(postId)) return { error: "Invalid post ID" }
  if (!ALLOWED_STATUSES.includes(action as AllowedStatus)) return { error: "Invalid action" }

  // Verify the post belongs to the user's school (unless super_admin)
  if (profile.role !== "super_admin") {
    const { data: post } = await supabase
      .from("posts")
      .select("school_id")
      .eq("id", postId)
      .single()

    if (!post || post.school_id !== profile.school_id) return { error: "Forbidden" }
  }

  const { error } = await supabase.from("posts").update({ status: action }).eq("id", postId)
  if (error) return { error: error.message }

  revalidatePath("/dashboard/moderation")
  revalidatePath("/dashboard/feed")
  return { success: true }
}
