"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { CMSContent, PostVisibility, PostStatus } from "@/types"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// ─── Create CMS Article ───────────────────────────────────────────

export async function createCMSArticle(formData: FormData) {
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

  const title = (formData.get("title") as string).trim()
  const rawSlug = (formData.get("slug") as string).trim()
  const slug = rawSlug || slugify(title)

  const cms: CMSContent = {
    __cms: true,
    v: 1,
    title,
    slug,
    excerpt: (formData.get("excerpt") as string).trim(),
    body: (formData.get("body") as string).trim(),
    featured_image: (formData.get("featured_image") as string).trim(),
    category: (formData.get("category") as string).trim() || "General",
    tags: (formData.get("tags") as string)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    meta_title: (formData.get("meta_title") as string).trim(),
    meta_description: (formData.get("meta_description") as string).trim(),
    og_title: (formData.get("og_title") as string).trim(),
    og_description: (formData.get("og_description") as string).trim(),
    og_image: (formData.get("og_image") as string).trim(),
    focus_keyword: (formData.get("focus_keyword") as string).trim(),
    canonical_url: (formData.get("canonical_url") as string).trim(),
    schema_type:
      ((formData.get("schema_type") as string) as CMSContent["schema_type"]) || "NewsArticle",
    allow_comments: formData.get("allow_comments") === "on",
  }

  const visibility = (formData.get("visibility") as PostVisibility) || "school"
  const status = (formData.get("status") as PostStatus) || "draft"
  const schoolId =
    profile?.role === "super_admin" ? null : (profile?.school_id ?? null)

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      school_id: schoolId,
      content: JSON.stringify(cms),
      media_urls: cms.featured_image ? [cms.featured_image] : [],
      visibility,
      status,
    })
    .select("id")
    .single()

  if (error || !data) {
    const base =
      profile?.role === "super_admin"
        ? "/super-admin/content"
        : "/dashboard/cms"
    redirect(`${base}?error=${encodeURIComponent(error?.message ?? "Failed to create article")}`)
  }

  revalidatePath("/dashboard/cms")
  revalidatePath("/super-admin/content")
  revalidatePath("/newspaper")

  const base =
    profile?.role === "super_admin" ? "/super-admin/content" : "/dashboard/cms"
  redirect(`${base}/${data.id}?saved=1`)
}

// ─── Update CMS Article ───────────────────────────────────────────

export async function updateCMSArticle(formData: FormData) {
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

  const articleId = formData.get("article_id") as string
  const title = (formData.get("title") as string).trim()
  const rawSlug = (formData.get("slug") as string).trim()
  const slug = rawSlug || slugify(title)

  const cms: CMSContent = {
    __cms: true,
    v: 1,
    title,
    slug,
    excerpt: (formData.get("excerpt") as string).trim(),
    body: (formData.get("body") as string).trim(),
    featured_image: (formData.get("featured_image") as string).trim(),
    category: (formData.get("category") as string).trim() || "General",
    tags: (formData.get("tags") as string)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    meta_title: (formData.get("meta_title") as string).trim(),
    meta_description: (formData.get("meta_description") as string).trim(),
    og_title: (formData.get("og_title") as string).trim(),
    og_description: (formData.get("og_description") as string).trim(),
    og_image: (formData.get("og_image") as string).trim(),
    focus_keyword: (formData.get("focus_keyword") as string).trim(),
    canonical_url: (formData.get("canonical_url") as string).trim(),
    schema_type:
      ((formData.get("schema_type") as string) as CMSContent["schema_type"]) || "NewsArticle",
    allow_comments: formData.get("allow_comments") === "on",
  }

  const visibility = (formData.get("visibility") as PostVisibility) || "school"
  const status = (formData.get("status") as PostStatus) || "draft"

  // Authorization: verify ownership before update
  const { data: existing } = await supabase
    .from("posts")
    .select("author_id, school_id")
    .eq("id", articleId)
    .single()

  const isSuperAdmin = profile?.role === "super_admin"
  const isOwner = existing?.author_id === user.id
  const isSameSchoolAdmin =
    (profile?.role === "school_admin" || profile?.role === "content_manager") &&
    existing?.school_id === profile?.school_id

  if (!existing || (!isSuperAdmin && !isOwner && !isSameSchoolAdmin)) {
    const base = isSuperAdmin ? "/super-admin/content" : "/dashboard/cms"
    redirect(`${base}?error=${encodeURIComponent("Not authorized to edit this article.")}`)
  }

  const { error } = await supabase
    .from("posts")
    .update({
      content: JSON.stringify(cms),
      media_urls: cms.featured_image ? [cms.featured_image] : [],
      visibility,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", articleId)

  const base =
    profile?.role === "super_admin" ? "/super-admin/content" : "/dashboard/cms"

  if (error) {
    redirect(
      `${base}/${articleId}?error=${encodeURIComponent(error.message ?? "Failed to save")}`,
    )
  }

  revalidatePath("/dashboard/cms")
  revalidatePath("/super-admin/content")
  revalidatePath("/newspaper")

  redirect(`${base}/${articleId}?saved=1`)
}

// ─── Delete CMS Article ───────────────────────────────────────────

export async function deleteCMSArticle(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr || !user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, school_id")
    .eq("id", user.id)
    .single()

  const articleId = formData.get("article_id") as string

  // Authorization: verify ownership before delete
  const { data: existing } = await supabase
    .from("posts")
    .select("author_id, school_id")
    .eq("id", articleId)
    .single()

  const isSuperAdmin = profile?.role === "super_admin"
  const isOwner = existing?.author_id === user.id
  const isSameSchoolAdmin =
    (profile?.role === "school_admin" || profile?.role === "content_manager") &&
    existing?.school_id === profile?.school_id

  const base = isSuperAdmin ? "/super-admin/content" : "/dashboard/cms"

  if (!existing || (!isSuperAdmin && !isOwner && !isSameSchoolAdmin)) {
    redirect(`${base}?error=${encodeURIComponent("Not authorized to delete this article.")}`)
  }

  await supabase.from("posts").delete().eq("id", articleId)

  revalidatePath("/dashboard/cms")
  revalidatePath("/super-admin/content")
  revalidatePath("/newspaper")

  redirect(base)
}

// ─── Super Admin: Update School Plan ─────────────────────────────

export async function updateSchoolPlan(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr || !user) redirect("/login")

  // Authorization: only super_admin may change school plans
  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!adminProfile || adminProfile.role !== "super_admin") {
    redirect("/dashboard?error=Unauthorized")
  }

  const schoolId = formData.get("school_id") as string
  const plan = formData.get("plan") as string

  await supabase.from("schools").update({ plan }).eq("id", schoolId)
  revalidatePath("/super-admin/schools")
  revalidatePath(`/super-admin/schools/${schoolId}`)
}

// ─── Super Admin: Update School Settings ─────────────────────────

export async function updateSchoolSettings(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr || !user) redirect("/login")

  // Authorization: only super_admin may change school settings via this action
  const { data: settingsProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!settingsProfile || settingsProfile.role !== "super_admin") {
    redirect("/dashboard?error=Unauthorized")
  }

  const schoolId = formData.get("school_id") as string
  const name = (formData.get("name") as string).trim()
  const city = (formData.get("city") as string).trim() || null
  const country = (formData.get("country") as string).trim() || null
  const theme_primary = (formData.get("theme_primary") as string).trim() || "#808b47"
  const plan = formData.get("plan") as string

  await supabase
    .from("schools")
    .update({ name, city, country, theme_primary, plan })
    .eq("id", schoolId)

  revalidatePath("/super-admin/schools")
  revalidatePath(`/super-admin/schools/${schoolId}`)
  redirect(`/super-admin/schools/${schoolId}?saved=1`)
}
