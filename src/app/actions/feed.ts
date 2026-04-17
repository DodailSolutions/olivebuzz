"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// ─── Create Post ──────────────────────────────────────────────────

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr || !user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("school_id, role")
    .eq("id", user.id)
    .single()

  if (!profile?.school_id) redirect("/login")

  const content = (formData.get("content") as string).trim()
  if (!content) return { error: "Post cannot be empty" }
  if (content.length > 5000) return { error: "Post content exceeds the maximum length of 5000 characters" }

  // Validate visibility against allowed values
  const ALLOWED_VISIBILITY = ["class", "grade", "school", "public"] as const
  type AllowedVisibility = (typeof ALLOWED_VISIBILITY)[number]
  const rawVisibility = formData.get("visibility") as string
  const visibility: AllowedVisibility = ALLOWED_VISIBILITY.includes(rawVisibility as AllowedVisibility)
    ? (rawVisibility as AllowedVisibility)
    : "school"

  // Validate media URLs: only allow http/https protocol, max 10 items
  const rawMediaUrls = (formData.get("media_urls") as string)
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean)
  const mediaUrls = rawMediaUrls
    .filter((url) => {
      try {
        const parsed = new URL(url)
        return parsed.protocol === "https:" || parsed.protocol === "http:"
      } catch {
        return false
      }
    })
    .slice(0, 10)

  // Auto-publish for teachers+, pending for students
  const autoPublishRoles = ["school_admin", "super_admin", "content_manager", "teacher"]
  const status = autoPublishRoles.includes(profile.role) ? "published" : "pending"

  const { error: insertErr } = await supabase.from("posts").insert({
    school_id: profile.school_id,
    author_id: user.id,
    content,
    visibility,
    status,
    media_urls: mediaUrls,
  })

  if (insertErr) return { error: insertErr.message }

  revalidatePath("/dashboard/feed")
  return { success: true, status }
}

// ─── Toggle Reaction ──────────────────────────────────────────────

export async function toggleReaction(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr || !user) return { error: "Unauthorized" }

  const postId = formData.get("post_id") as string
  const reactionType = formData.get("reaction_type") as string

  // Validate inputs
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!UUID_RE.test(postId)) return { error: "Invalid post ID" }

  const ALLOWED_REACTIONS = ["like", "love", "celebrate", "insightful", "curious"] as const
  if (!ALLOWED_REACTIONS.includes(reactionType as (typeof ALLOWED_REACTIONS)[number])) {
    return { error: "Invalid reaction type" }
  }
  const { data: existing } = await supabase
    .from("reactions")
    .select("id, reaction_type")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single()

  if (existing) {
    if (existing.reaction_type === reactionType) {
      // Same reaction → remove it (toggle off)
      await supabase.from("reactions").delete().eq("id", existing.id)
    } else {
      // Different reaction → update it
      await supabase
        .from("reactions")
        .update({ reaction_type: reactionType })
        .eq("id", existing.id)
    }
  } else {
    // No reaction → add it
    await supabase.from("reactions").insert({
      post_id: postId,
      user_id: user.id,
      reaction_type: reactionType,
    })
  }

  revalidatePath("/dashboard/feed")
  return { success: true }
}

// ─── Add Comment ──────────────────────────────────────────────────

export async function addComment(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr || !user) return { error: "Unauthorized" }

  const postId = formData.get("post_id") as string
  const content = (formData.get("content") as string).trim()

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!UUID_RE.test(postId)) return { error: "Invalid post ID" }

  if (!content || content.length < 1) return { error: "Comment cannot be empty" }
  if (content.length > 1000) return { error: "Comment too long" }

  const { error: insertErr } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: user.id,
    content,
  })

  if (insertErr) return { error: insertErr.message }

  revalidatePath("/dashboard/feed")
  return { success: true }
}

// ─── Delete Post ──────────────────────────────────────────────────

export async function deletePost(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr || !user) return { error: "Unauthorized" }

  const postId = formData.get("post_id") as string

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const { data: post } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single()

  const canDelete =
    post?.author_id === user.id ||
    ["school_admin", "super_admin", "content_manager"].includes(profile?.role ?? "")

  if (!canDelete) return { error: "Unauthorized" }

  await supabase.from("posts").delete().eq("id", postId)

  revalidatePath("/dashboard/feed")
  return { success: true }
}

// ─── Bookmark Post ────────────────────────────────────────────────

export async function toggleBookmark(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr || !user) return { error: "Unauthorized" }

  const postId = formData.get("post_id") as string

  const { data: existing } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single()

  if (existing) {
    await supabase.from("bookmarks").delete().eq("id", existing.id)
  } else {
    await supabase.from("bookmarks").insert({ post_id: postId, user_id: user.id })
  }

  revalidatePath("/dashboard/feed")
  revalidatePath("/dashboard/bookmarks")
  return { success: true }
}
