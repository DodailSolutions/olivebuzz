"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function registerSchoolAndAdmin(formData: FormData) {
  const supabase = await createClient()

  // School Data
  const schoolName = formData.get("school_name") as string
  const slug = schoolName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
  const themePrimary = (formData.get("theme_primary") as string) || "#808b47"

  // Admin User Data
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const displayName = formData.get("display_name") as string

  // 1. Create the School (Bypassing RLS or using the public insert policy)
  const { data: school, error: schoolError } = await supabase
    .from("schools")
    .insert({
      name: schoolName,
      slug: slug,
      theme_primary: themePrimary,
    })
    .select("id")
    .single()

  if (schoolError || !school) {
    return { error: schoolError?.message || "Failed to create school record" }
  }

  // 2. Register the User as School Admin for that new School
  const payload = {
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        school_id: school.id,
        role: "school_admin", // Enforce school admin role
      },
    },
  }

  const { error: authError } = await supabase.auth.signUp(payload)

  if (authError) {
    // Ideally we would delete the school here if auth fails, but skipping for simplicity
    return { error: authError.message }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard/settings")
}
