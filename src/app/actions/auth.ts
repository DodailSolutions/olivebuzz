"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = (formData.get("email") as string).trim().toLowerCase()
  const password = formData.get("password") as string

  // Basic input validation
  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Email and password are required.")}`)
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect(`/login?error=${encodeURIComponent("Please enter a valid email address.")}`)
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = (formData.get("email") as string).trim().toLowerCase()
  const password = formData.get("password") as string
  const displayName = (formData.get("display_name") as string).trim()

  // Allowlist roles — never trust client-supplied role for privileged values
  const SELF_REGISTER_ROLES = ["student", "parent", "teacher"] as const
  type SelfRegisterRole = (typeof SELF_REGISTER_ROLES)[number]
  const rawRole = formData.get("role") as string
  const role: SelfRegisterRole = SELF_REGISTER_ROLES.includes(rawRole as SelfRegisterRole)
    ? (rawRole as SelfRegisterRole)
    : "student"

  // school_id from form is informational only; real assignment happens via invite flow or school code
  const schoolId = formData.get("school_id") as string | null

  const payload = {
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        school_id: schoolId || null,
        role: role || "student",
      },
    },
  }

  const { error } = await supabase.auth.signUp(payload)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  // Using verify page if email confirmation is on, otherwise redirect to dashboard
  redirect("/verify-email")
}

export async function signupFromInvite(formData: FormData) {
  const supabase = await createClient()

  const token = formData.get("token") as string
  const password = formData.get("password") as string
  const displayName = formData.get("display_name") as string
  const grade = formData.get("grade") as string

  const redirectWithError = (message: string): never => {
    redirect(`/invite/${token}?error=${encodeURIComponent(message)}`)
  }

  // Cryptographically secure: Verify the token natively on the server
  const { data: invite, error: inviteError } = await supabase
    .from("invitations")
    .select("school_id, role, email, accepted")
    .eq("token", token)
    .single()

  if (inviteError || !invite) {
    redirectWithError("Invalid or expired invitation token.")
  }

  const inviteData = invite!

  if (inviteData.accepted) {
    redirectWithError("This invitation has already been used.")
  }

  // Age Tier Inference Engine
  let ageTier = "adult"
  if (inviteData.role === "student" && grade) {
    if (grade.includes("Pre") || grade.match(/Grade [1-5]$/)) {
      ageTier = "kg_5"
    } else if (grade.match(/Grade ([6-9]|1[0-2])$/)) {
      ageTier = "grade_6_12"
    }
  }

  const payload = {
    email: inviteData.email,
    password,
    options: {
      data: {
        display_name: displayName,
        school_id: inviteData.school_id,
        role: inviteData.role,
        grade: grade || null,
        age_tier: ageTier,
      },
    },
  }

  const { error } = await supabase.auth.signUp(payload)

  if (error) {
    redirectWithError(error.message)
  }

  // Mark the invitation as accepted securely
  await supabase.from("invitations").update({ accepted: true }).eq("token", token)

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signInWithMagicLink(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // The redirect URL will typically point to your auth/callback route
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: "Check your email for the magic link!" }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath("/", "layout")
  redirect("/")
}
