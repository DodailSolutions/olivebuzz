import { createClient } from "@/lib/supabase/server"

export type SchoolMember = {
  id: string
  display_name: string
  email: string
  role: string
  grade: string | null
  avatar_url: string | null
  created_at: string
}

export type ModerationPost = {
  id: string
  content: string
  author_name: string
  author_id: string
  visibility: string
  created_at: string
  school_name: string | null
  school_id: string
}

// ─── Directory ────────────────────────────────────────────────────

export async function getSchoolMembers(schoolId: string): Promise<SchoolMember[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, email, role, grade, avatar_url, created_at")
      .eq("school_id", schoolId)
      .order("display_name")
    return (data ?? []) as SchoolMember[]
  } catch {
    return []
  }
}

// ─── Moderation ───────────────────────────────────────────────────

export async function getPendingPosts(
  schoolId: string | null,
  isSuperAdmin: boolean,
): Promise<ModerationPost[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from("posts")
      .select(
        "id, school_id, content, author_id, visibility, status, created_at, author:profiles(display_name), school:schools(name)",
      )
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(50)

    if (!isSuperAdmin && schoolId) {
      query = query.eq("school_id", schoolId)
    }

    const { data } = await query
    return (data ?? []).map((p) => ({
      id: p.id as string,
      school_id: p.school_id as string,
      content: p.content as string,
      author_name:
        (p.author as unknown as { display_name: string } | null)?.display_name ?? "Unknown",
      author_id: p.author_id as string,
      visibility: p.visibility as string,
      created_at: p.created_at as string,
      school_name: (p.school as unknown as { name: string } | null)?.name ?? null,
    }))
  } catch {
    return []
  }
}

// ─── Classes ──────────────────────────────────────────────────────

export async function getSchoolGrades(schoolId: string): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("profiles")
      .select("grade")
      .eq("school_id", schoolId)
      .eq("role", "student")
      .not("grade", "is", null)

    const grades = [
      ...new Set((data ?? []).map((p) => p.grade as string).filter(Boolean)),
    ] as string[]
    return grades.sort()
  } catch {
    return []
  }
}

export async function getGradeMembers(schoolId: string, grade: string): Promise<SchoolMember[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, email, role, grade, avatar_url, created_at")
      .eq("school_id", schoolId)
      .eq("grade", grade)
      .order("display_name")
    return (data ?? []) as SchoolMember[]
  } catch {
    return []
  }
}

// ─── Students (for parent view) ───────────────────────────────────

export async function getSchoolStudents(schoolId: string): Promise<SchoolMember[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, email, role, grade, avatar_url, created_at")
      .eq("school_id", schoolId)
      .eq("role", "student")
      .order("grade")
      .order("display_name")
    return (data ?? []) as SchoolMember[]
  } catch {
    return []
  }
}
