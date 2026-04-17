// ─── User & Auth Types ───────────────────────────────────────────

export type AgeTier = "kg_5" | "grade_6_12" | "undergrad" | "postgrad" | "adult"

export type UserRole =
  | "super_admin"
  | "school_admin"
  | "teacher"
  | "content_manager"
  | "student"
  | "parent"
  | "guest"

export interface Profile {
  id: string
  school_id: string
  email: string
  display_name: string
  avatar_url: string | null
  role: UserRole
  age_tier: AgeTier
  grade: string | null
  bio: string | null
  has_completed_tutorial: boolean
  created_at: string
  updated_at: string
}

// ─── School Types ────────────────────────────────────────────────

export type SchoolPlan = "free" | "starter" | "pro" | "enterprise"

export interface School {
  id: string
  name: string
  slug: string
  logo_url: string | null
  theme_primary: string
  theme_accent: string
  plan: SchoolPlan
  address: string | null
  city: string | null
  country: string | null
  student_count: number
  created_at: string
}

// ─── Post Types ──────────────────────────────────────────────────

export type PostVisibility = "class" | "grade" | "school" | "public"
export type PostStatus = "draft" | "pending" | "published" | "flagged" | "removed"
export type ReactionType = "like" | "love" | "celebrate" | "insightful" | "curious"

export interface Post {
  id: string
  school_id: string
  author_id: string
  content: string
  media_urls: string[]
  visibility: PostVisibility
  status: PostStatus
  created_at: string
  updated_at: string
  // Joined fields
  author?: Profile
  reactions_count?: Record<ReactionType, number>
  comments_count?: number
  user_reaction?: ReactionType | null
}

export interface Comment {
  id: string
  post_id: string
  author_id: string
  content: string
  created_at: string
  author?: Profile
}

export interface Reaction {
  id: string
  post_id: string
  user_id: string
  type: ReactionType
  created_at: string
}

// ─── Navigation Types ────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  icon: string
  roles?: UserRole[]
  badge?: string
}

// ─── CMS / Article Types ─────────────────────────────────────────

export type CMSStatus = "draft" | "pending" | "published" | "archived"
export type CMSSchemaType = "Article" | "BlogPosting" | "NewsArticle" | "WebPage"

export interface CMSContent {
  __cms: true
  v: 1
  title: string
  slug: string
  excerpt: string
  body: string
  featured_image: string
  category: string
  tags: string[]
  meta_title: string
  meta_description: string
  og_title: string
  og_description: string
  og_image: string
  focus_keyword: string
  canonical_url: string
  schema_type: CMSSchemaType
  allow_comments: boolean
}

export interface CMSArticle {
  id: string
  school_id: string | null
  author_id: string
  cms: CMSContent
  visibility: PostVisibility
  status: CMSStatus
  created_at: string
  updated_at: string
  author?: Pick<Profile, "id" | "display_name" | "avatar_url" | "role">
}

/** Parses a post's `content` string into CMSContent if it is a CMS article */
export function parseCMSContent(content: string): CMSContent | null {
  try {
    const parsed = JSON.parse(content)
    if (parsed.__cms === true) return parsed as CMSContent
    return null
  } catch {
    return null
  }
}

/** Flat list item used in CMS article lists and the article editor */
export interface CMSListItem {
  id: string
  school_id: string | null
  title: string
  excerpt: string
  status: string
  visibility: string
  created_at: string
  updated_at: string
  author_name: string
  is_cms: boolean
  cms: CMSContent | null
}

/** Returns a safe empty CMSContent skeleton */
export function emptyCMSContent(overrides: Partial<CMSContent> = {}): CMSContent {
  return {
    __cms: true,
    v: 1,
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    featured_image: "",
    category: "General",
    tags: [],
    meta_title: "",
    meta_description: "",
    og_title: "",
    og_description: "",
    og_image: "",
    focus_keyword: "",
    canonical_url: "",
    schema_type: "NewsArticle",
    allow_comments: true,
    ...overrides,
  }
}
