import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? ""

  if (q.length < 2 || q.length > 100) {
    return NextResponse.json({ results: [] })
  }

  // Sanitize: strip characters that have no search meaning and could confuse ilike patterns
  const sanitized = q.replace(/[%_\\]/g, "")
  if (sanitized.length < 2) return NextResponse.json({ results: [] })

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, excerpt, category, slug")
    .eq("status", "published")
    .or(`title.ilike.%${sanitized}%,content.ilike.%${sanitized}%,excerpt.ilike.%${sanitized}%,category.ilike.%${sanitized}%`)
    .order("published_at", { ascending: false })
    .limit(8)

  if (error) {
    return NextResponse.json({ results: [] })
  }

  const results = (data ?? []).map((p) => ({
    id: p.id,
    title: p.title ?? "Untitled",
    excerpt: p.excerpt ?? "",
    category: p.category ?? "General",
    slug: p.slug ?? p.id,
  }))

  return NextResponse.json({ results }, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
  })
}
