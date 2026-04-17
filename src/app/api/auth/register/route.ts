import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Only these roles may self-register. Never allow school_admin or super_admin via public API.
const ALLOWED_ROLES = ["student", "parent", "teacher"] as const
type AllowedRole = (typeof ALLOWED_ROLES)[number]

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const { email, password, display_name, role, school_code } = body as Record<string, unknown>

  // ── Input validation ─────────────────────────────────────────
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 })
  }
  if (typeof display_name !== "string" || display_name.trim().length < 2) {
    return NextResponse.json(
      { error: "Display name must be at least 2 characters." },
      { status: 400 },
    )
  }
  if (typeof display_name === "string" && display_name.trim().length > 80) {
    return NextResponse.json({ error: "Display name is too long." }, { status: 400 })
  }

  // Strictly allowlist the role — never accept super_admin / school_admin from public API
  const safeRole: AllowedRole = ALLOWED_ROLES.includes(role as AllowedRole)
    ? (role as AllowedRole)
    : "student"

  if (typeof school_code !== "string" || school_code.trim().length < 2) {
    return NextResponse.json(
      { error: "Please enter your school code." },
      { status: 400 },
    )
  }

  const supabase = await createClient()

  // ── Look up the school by slug (school_code is the school slug) ──
  const { data: school, error: schoolErr } = await supabase
    .from("schools")
    .select("id, name")
    .eq("slug", school_code.trim().toLowerCase())
    .single()

  if (schoolErr || !school) {
    return NextResponse.json(
      { error: "School code not found. Please double-check with your school administrator." },
      { status: 400 },
    )
  }

  // ── Create the user via Supabase Auth ────────────────────────
  const { error: signUpErr } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        display_name: display_name.trim(),
        school_id: school.id,
        role: safeRole,
      },
    },
  })

  if (signUpErr) {
    // Avoid leaking whether an email is already registered
    if (signUpErr.message.toLowerCase().includes("already registered")) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in instead." },
        { status: 409 },
      )
    }
    return NextResponse.json({ error: signUpErr.message }, { status: 400 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
