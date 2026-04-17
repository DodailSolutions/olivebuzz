"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function createInvite(formData: FormData) {
  const supabase = await createClient()

  // Verify the executing user has admin rights and grab their school_id
  const { data: userData, error: authError } = await supabase.auth.getUser()
  if (authError || !userData?.user) {
    return { error: "Authentication required" }
  }

  // Get auth user's school context
  const { data: profile } = await supabase
    .from("profiles")
    .select("school_id, role")
    .eq("id", userData.user.id)
    .single()

  if (!profile || !profile.school_id || (profile.role !== "super_admin" && profile.role !== "school_admin")) {
    return { error: "Unauthorized to send invitations for this school" }
  }

  const email = formData.get("email") as string
  const role = formData.get("role") as string

  // Insert the invitation record
  const { data: invite, error } = await supabase
    .from("invitations")
    .insert({
      school_id: profile.school_id,
      email: email,
      role: role,
      created_by: userData.user.id
    })
    .select("token")
    .single()

  if (error) {
    return { error: error.message }
  }

  // Note: Here you would integrate an email sending service (Resend, SendGrid) to send the invite
  // link containing the token: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.token}`

  revalidatePath("/dashboard/settings/invites")
  return { success: true, token: invite.token, message: "Invitation generated successfully" }
}
