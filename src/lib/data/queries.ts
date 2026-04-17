import { cache } from "react"
import { createClient } from "@/lib/supabase/server"
import type { CMSContent, CMSListItem } from "@/types"
import {
  FEATURES,
  HOW_IT_WORKS,
  TESTIMONIALS,
  NEWSPAPER_ARTICLES,
  NEWSPAPER_FEATURED_STORY,
  NEWSPAPER_SECTIONS,
} from "@/lib/constants"


export async function getLandingPageContent() {
  try {
    const supabase = await createClient()
    const { data: cmsData, error } = await supabase
      .from("landing_page_cms")
      .select("*")
      .eq("active", true)
      .single()

    if (error || !cmsData) {
      console.warn("Using fallback constants for landing page:", error?.message)
      return {
        features: FEATURES,
        howItWorks: HOW_IT_WORKS,
        testimonials: TESTIMONIALS,
      }
    }

    return {
      features: cmsData.features || FEATURES,
      howItWorks: cmsData.how_it_works || HOW_IT_WORKS,
      testimonials: cmsData.testimonials || TESTIMONIALS,
    }
  } catch (error) {
    console.error("Failed to fetch landing page content:", error)
    return {
      features: FEATURES,
      howItWorks: HOW_IT_WORKS,
      testimonials: TESTIMONIALS,
    }
  }
}

export async function getPublishedPosts() {
  try {
    const supabase = await createClient()
    const { data: posts, error } = await supabase
      .from("posts")
      .select(`
        *,
        author:profiles(*)
      `)
      .eq("visibility", "public")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(20)

    if (error || !posts || posts.length === 0) {
      console.warn("Using fallback constants for newspaper articles:", error?.message)
      return {
        featuredStory: NEWSPAPER_FEATURED_STORY,
        articles: NEWSPAPER_ARTICLES,
        sections: NEWSPAPER_SECTIONS,
      }
    }

    // We take the most recent post as the featured story
    const [featured, ...rest] = posts

    // Map database posts to UI components (which usually require specific string structures)
    const featuredStory = {
      category: "Top Story",
      title: featured.content.split("\n")[0].substring(0, 50) + "...", // Placeholder since title isn't in Post schema yet
      excerpt: featured.content.substring(0, 100) + "...",
      author: featured.author?.display_name || "Editorial Desk",
      readTime: "5 min read",
    }

    const articles = rest.map((p) => ({
      category: "Community", 
      title: p.content.split("\n")[0].substring(0, 40) + "...",
      summary: p.content.substring(0, 80) + "...",
      meta: `By ${p.author?.display_name || "Author"} • 3 min read`,
    }))

    return {
      featuredStory,
      articles: articles.length > 0 ? articles : NEWSPAPER_ARTICLES,
      sections: NEWSPAPER_SECTIONS,
    }
  } catch (error) {
    console.error("Failed to fetch posts:", error)
    return {
      featuredStory: NEWSPAPER_FEATURED_STORY,
      articles: NEWSPAPER_ARTICLES,
      sections: NEWSPAPER_SECTIONS,
    }
  }
}

export const getDashboardContext = cache(async function getDashboardContext() {
  try {
    const supabase = await createClient()
    const { data: userData, error: authError } = await supabase.auth.getUser()

    if (authError || !userData?.user) {
      return { profile: null, school: null, error: "Unauthorized" }
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        `
        *,
        school:schools (
          id, name, slug, theme_primary, theme_accent, logo_url, city, country, student_count, plan
        )
      `,
      )
      .eq("id", userData.user.id)
      .single()

    if (profileError || !profile) {
      return {
        profile: null,
        school: null,
        error: profileError?.message || "Profile missing",
      }
    }

    return {
      profile,
      school: profile.school ?? null,
      error: null,
    }
  } catch (error) {
    console.error("Dashboard Context Error:", error)
    return { profile: null, school: null, error: "Internal Server Error" }
  }
})

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

export type PendingItem = {
  id: string
  title: string
  author: string
  submitted: string
}

export type ActivityItem = {
  id: string
  text: string
  icon: string
  time: string
}

export type AnnouncementItem = {
  id: string
  title: string
  from: string
  time: string
  priority: "high" | "normal"
}

export async function getAdminDashboardStats(schoolId: string) {
  try {
    const supabase = await createClient()
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    ).toISOString()

    const [pendingResult, publishedResult, staffResult, recentResult] = await Promise.all([
      supabase
        .from("posts")
        .select("id, content, created_at, author:profiles(display_name)")
        .eq("school_id", schoolId)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("school_id", schoolId)
        .eq("status", "published")
        .gte("created_at", startOfMonth),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("school_id", schoolId)
        .in("role", ["teacher", "content_manager", "school_admin"]),
      supabase
        .from("posts")
        .select("id, content, created_at, status, author:profiles(display_name)")
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false })
        .limit(5),
    ])

    const pendingItems: PendingItem[] = (pendingResult.data ?? []).map((p) => ({
      id: p.id as string,
      title: ((p.content as string).split("\n")[0] || "Untitled").substring(0, 60),
      author: (p.author as unknown as { display_name: string } | null)?.display_name ?? "Unknown",
      submitted: formatRelative(p.created_at as string),
    }))

    const recentActivity: ActivityItem[] = (recentResult.data ?? []).map((p) => {
      const name = (p.author as unknown as { display_name: string } | null)?.display_name ?? "A student"
      const title = ((p.content as string).split("\n")[0] || "an article").substring(0, 40)
      const status = p.status as string
      const icon = status === "published" ? "✅" : status === "pending" ? "📋" : "🚩"
      const verb = status === "published" ? "published" : "submitted for review"
      return { id: p.id as string, text: `${name} ${verb} "${title}"`, icon, time: formatRelative(p.created_at as string) }
    })

    return {
      pendingItems,
      articlesThisMonth: publishedResult.count ?? 0,
      staffCount: staffResult.count ?? 0,
      recentActivity,
    }
  } catch {
    return { pendingItems: [], articlesThisMonth: 0, staffCount: 0, recentActivity: [] }
  }
}

export async function getTeacherDashboardStats(schoolId: string) {
  try {
    const supabase = await createClient()
    const [pendingResult, studentResult] = await Promise.all([
      supabase
        .from("posts")
        .select("id, content, created_at, author:profiles(display_name)")
        .eq("school_id", schoolId)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("school_id", schoolId)
        .eq("role", "student"),
    ])

    const pendingReviews: PendingItem[] = (pendingResult.data ?? []).map((p) => ({
      id: p.id as string,
      title: ((p.content as string).split("\n")[0] || "Untitled").substring(0, 60),
      author: (p.author as unknown as { display_name: string } | null)?.display_name ?? "Unknown",
      submitted: formatRelative(p.created_at as string),
    }))

    return { pendingReviews, studentCount: studentResult.count ?? 0 }
  } catch {
    return { pendingReviews: [], studentCount: 0 }
  }
}

export async function getParentDashboardStats(schoolId: string) {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("posts")
      .select("id, content, created_at, author:profiles(display_name, role)")
      .eq("school_id", schoolId)
      .eq("visibility", "school")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(5)

    const announcements: AnnouncementItem[] = (data ?? []).map((p) => {
      const author = p.author as unknown as { display_name: string; role: string } | null
      return {
        id: p.id as string,
        title: ((p.content as string).split("\n")[0] || "School Announcement").substring(0, 80),
        from: author?.display_name ?? "School",
        time: formatRelative(p.created_at as string),
        priority:
          author?.role === "school_admin" || author?.role === "super_admin"
            ? ("high" as const)
            : ("normal" as const),
      }
    })

    return { announcements }
  } catch {
    return { announcements: [] }
  }
}

export async function getStudentDashboardStats(studentId: string, schoolId: string) {
  try {
    const supabase = await createClient()
    const [myPostsResult, feedResult] = await Promise.all([
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("author_id", studentId),
      supabase
        .from("posts")
        .select("id, content, created_at, author:profiles(display_name)")
        .eq("school_id", schoolId)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(5),
    ])

    const recentActivity: ActivityItem[] = (feedResult.data ?? []).map((p) => ({
      id: p.id as string,
      text: `New article: ${((p.content as string).split("\n")[0] || "").substring(0, 50)}`,
      icon: "📰",
      time: formatRelative(p.created_at as string),
    }))

    return { articlesWritten: myPostsResult.count ?? 0, recentActivity }
  } catch {
    return { articlesWritten: 0, recentActivity: [] }
  }
}

// ─── Super Admin Queries ──────────────────────────────────────────────────────

export type SchoolRow = {
  id: string
  name: string
  slug: string
  plan: string
  student_count: number
  city: string | null
  country: string | null
  created_at: string
  theme_primary: string
  logo_url: string | null
}

export async function getSuperAdminStats() {
  try {
    const supabase = await createClient()

    const [schoolsRes, usersRes, postsRes, pendingRes] = await Promise.all([
      supabase.from("schools").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
    ])

    return {
      schools: schoolsRes.count ?? 0,
      users: usersRes.count ?? 0,
      articles: postsRes.count ?? 0,
      pending: pendingRes.count ?? 0,
    }
  } catch {
    return { schools: 0, users: 0, articles: 0, pending: 0 }
  }
}

export async function getAllSchools(): Promise<SchoolRow[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("schools")
      .select("id, name, slug, plan, student_count, city, country, created_at, theme_primary, logo_url")
      .order("created_at", { ascending: false })
    return (data ?? []) as SchoolRow[]
  } catch {
    return []
  }
}

export async function getSchoolById(id: string) {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("schools")
      .select("*")
      .eq("id", id)
      .single()
    return data
  } catch {
    return null
  }
}

// ─── CMS Article Queries ──────────────────────────────────────────────────────

export type CMSRow = {
  id: string
  school_id: string | null
  author_id: string
  content: string
  visibility: string
  status: string
  created_at: string
  updated_at: string
  author_name: string
}

/** Helper: extract title from CMS JSON content or fall back to plain text */
function cmsTitle(content: string): string {
  try {
    const p = JSON.parse(content)
    if (p.__cms && p.title) return p.title as string
  } catch { /* empty */ }
  return content.split("\n")[0].substring(0, 60) || "Untitled"
}

/** Helper: extract excerpt from CMS JSON content */
function cmsExcerpt(content: string): string {
  try {
    const p = JSON.parse(content)
    if (p.__cms && p.excerpt) return p.excerpt as string
    if (p.__cms && p.body) return (p.body as string).substring(0, 120)
  } catch { /* empty */ }
  return content.substring(0, 120)
}

function mapRowToCMSListItem(row: Record<string, unknown>, authorName: string): CMSListItem {
  const content = row.content as string
  let cms: CMSContent | null = null
  try {
    const p = JSON.parse(content)
    if (p.__cms === true) cms = p as CMSContent
  } catch { /* empty */ }
  return {
    id: row.id as string,
    school_id: (row.school_id as string) ?? null,
    title: cmsTitle(content),
    excerpt: cmsExcerpt(content),
    status: row.status as string,
    visibility: row.visibility as string,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    author_name: authorName,
    is_cms: cms !== null,
    cms,
  }
}

/** School-scoped CMS articles (for school admin/content manager/teacher) */
export async function getSchoolCMSArticles(schoolId: string): Promise<CMSListItem[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("posts")
      .select("id, school_id, author_id, content, visibility, status, created_at, updated_at, author:profiles(display_name)")
      .eq("school_id", schoolId)
      .order("updated_at", { ascending: false })
      .limit(50)
    return (data ?? []).map((row) => {
      const authorName = (row.author as unknown as { display_name: string } | null)?.display_name ?? "Unknown"
      return mapRowToCMSListItem(row as Record<string, unknown>, authorName)
    })
  } catch {
    return []
  }
}

/** Platform-wide CMS articles (super admin) */
export async function getPlatformCMSArticles(): Promise<CMSListItem[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("posts")
      .select("id, school_id, author_id, content, visibility, status, created_at, updated_at, author:profiles(display_name)")
      .order("updated_at", { ascending: false })
      .limit(100)
    return (data ?? []).map((row) => {
      const authorName = (row.author as unknown as { display_name: string } | null)?.display_name ?? "Unknown"
      return mapRowToCMSListItem(row as Record<string, unknown>, authorName)
    })
  } catch {
    return []
  }
}

/** Single CMS article by id */
export async function getCMSArticleById(id: string): Promise<CMSListItem | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("posts")
      .select("id, school_id, author_id, content, visibility, status, created_at, updated_at, author:profiles(display_name)")
      .eq("id", id)
      .single()
    if (!data) return null
    const authorName = (data.author as unknown as { display_name: string } | null)?.display_name ?? "Unknown"
    return mapRowToCMSListItem(data as unknown as Record<string, unknown>, authorName)
  } catch {
    return null
  }
}

// ─── Social Feed Queries ──────────────────────────────────────────────────────

export type FeedPost = {
  id: string
  school_id: string
  author_id: string
  content: string
  media_urls: string[]
  visibility: string
  status: string
  created_at: string
  updated_at: string
  author_name: string
  author_avatar: string | null
  author_role: string
  reactions: Record<string, number>
  comments_count: number
  user_reaction: string | null
  is_bookmarked: boolean
}

export type FeedComment = {
  id: string
  post_id: string
  content: string
  created_at: string
  author_name: string
  author_avatar: string | null
  author_role: string
}

export async function getFeedPosts(
  schoolId: string,
  currentUserId: string,
  filter: "school" | "class" | "grade" = "school",
): Promise<FeedPost[]> {
  try {
    const supabase = await createClient()

    const { data } = await supabase
      .from("posts")
      .select(
        `
        id, school_id, author_id, content, media_urls, visibility, status, created_at, updated_at,
        author:profiles(display_name, avatar_url, role)
      `,
      )
      .eq("school_id", schoolId)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(30)

    if (!data) return []

    const postIds = data.map((p) => p.id)

    // Fetch reactions for all posts at once
    const { data: reactions } = await supabase
      .from("reactions")
      .select("post_id, reaction_type, user_id")
      .in("post_id", postIds)

    // Fetch comment counts
    const { data: comments } = await supabase
      .from("comments")
      .select("post_id")
      .in("post_id", postIds)

    // Fetch user bookmarks
    const { data: bookmarks } = await supabase
      .from("bookmarks")
      .select("post_id")
      .eq("user_id", currentUserId)
      .in("post_id", postIds)

    const bookmarkedIds = new Set((bookmarks ?? []).map((b) => b.post_id))
    const commentsByPost = (comments ?? []).reduce(
      (acc, c) => ({ ...acc, [c.post_id]: (acc[c.post_id] ?? 0) + 1 }),
      {} as Record<string, number>,
    )

    return data.map((p) => {
      const postReactions = (reactions ?? []).filter((r) => r.post_id === p.id)
      const reactionCounts = postReactions.reduce(
        (acc, r) => ({ ...acc, [r.reaction_type]: (acc[r.reaction_type] ?? 0) + 1 }),
        {} as Record<string, number>,
      )
      const userReaction = postReactions.find((r) => r.user_id === currentUserId)?.reaction_type ?? null
      const author = p.author as unknown as { display_name: string; avatar_url: string | null; role: string } | null

      return {
        id: p.id,
        school_id: p.school_id,
        author_id: p.author_id,
        content: p.content,
        media_urls: p.media_urls ?? [],
        visibility: p.visibility,
        status: p.status,
        created_at: p.created_at,
        updated_at: p.updated_at,
        author_name: author?.display_name ?? "Anonymous",
        author_avatar: author?.avatar_url ?? null,
        author_role: author?.role ?? "student",
        reactions: reactionCounts,
        comments_count: commentsByPost[p.id] ?? 0,
        user_reaction: userReaction,
        is_bookmarked: bookmarkedIds.has(p.id),
      }
    })
  } catch {
    return []
  }
}

export async function getPostComments(postId: string): Promise<FeedComment[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("comments")
      .select("id, post_id, content, created_at, author:profiles(display_name, avatar_url, role)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true })
      .limit(50)

    if (!data) return []
    return data.map((c) => {
      const author = c.author as unknown as { display_name: string; avatar_url: string | null; role: string } | null
      return {
        id: c.id,
        post_id: c.post_id,
        content: c.content,
        created_at: c.created_at,
        author_name: author?.display_name ?? "Anonymous",
        author_avatar: author?.avatar_url ?? null,
        author_role: author?.role ?? "student",
      }
    })
  } catch {
    return []
  }
}

export async function getBookmarkedPosts(userId: string): Promise<FeedPost[]> {
  try {
    const supabase = await createClient()
    const { data: bk } = await supabase
      .from("bookmarks")
      .select("post_id")
      .eq("user_id", userId)
    if (!bk || bk.length === 0) return []
    const ids = bk.map((b) => b.post_id)
    const { data } = await supabase
      .from("posts")
      .select("id, school_id, author_id, content, media_urls, visibility, status, created_at, updated_at, author:profiles(display_name, avatar_url, role)")
      .in("id", ids)
      .eq("status", "published")
      .order("created_at", { ascending: false })
    if (!data) return []
    return data.map((p) => {
      const author = p.author as unknown as { display_name: string; avatar_url: string | null; role: string } | null
      return {
        id: p.id,
        school_id: p.school_id,
        author_id: p.author_id,
        content: p.content,
        media_urls: p.media_urls ?? [],
        visibility: p.visibility,
        status: p.status,
        created_at: p.created_at,
        updated_at: p.updated_at,
        author_name: author?.display_name ?? "Anonymous",
        author_avatar: author?.avatar_url ?? null,
        author_role: author?.role ?? "student",
        reactions: {},
        comments_count: 0,
        user_reaction: null,
        is_bookmarked: true,
      }
    })
  } catch {
    return []
  }
}

