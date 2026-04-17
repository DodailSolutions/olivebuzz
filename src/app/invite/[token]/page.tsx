import { createClient } from "@/lib/supabase/server"
import { ShieldCheck, Mail, AlertTriangle, School } from "lucide-react"
import { signupFromInvite } from "@/app/actions/auth"

export default async function InviteReceptionPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const supabase = await createClient()

  // Find the invitation securely on the server
  const { data: invite, error } = await supabase
    .from("invitations")
    .select("school_id, role, email, accepted, schools(name)")
    .eq("token", resolvedParams.token)
    .single()

  if (error || !invite || invite.accepted) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-stone-900 mb-2">Invalid Invite</h1>
          <p className="text-sm text-stone-600 mb-6">This invitation link is invalid, expired, or has already been used to join the school.</p>
        </div>
      </div>
    )
  }

  const schoolName = (invite.schools as { name?: string } | null)?.name || "Your Campus"

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-xl p-8 border border-stone-200">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#808b47]/10 text-[#808b47] mb-4">
            <School className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black font-serif text-stone-900">Join {schoolName}</h1>
          <p className="mt-2 text-stone-500">You have been invited securely as a <strong className="text-stone-900 capitalize">{invite.role.replace("_", " ")}</strong>.</p>
        </div>

        {resolvedSearchParams.error && (
          <div className="mb-5 rounded-2xl border border-[#e14851]/30 bg-[#e14851]/10 px-4 py-3 text-sm text-[#a82030]">
            {decodeURIComponent(resolvedSearchParams.error)}
          </div>
        )}

        <form action={signupFromInvite} className="space-y-5 animate-in slide-in-from-bottom-4 fade-in">
          {/* Secret Token Field */}
          <input type="hidden" name="token" value={resolvedParams.token} />
          
          <div className="opacity-60 cursor-not-allowed">
            <label className="block text-sm font-bold text-stone-700 mb-2">Registered Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-stone-400">
                <Mail className="h-4 w-4" />
              </div>
              <input 
                disabled 
                value={invite.email}
                className="w-full rounded-xl border border-stone-300 bg-stone-50 pl-11 px-4 py-3 text-stone-500 pointer-events-none"
              />
            </div>
            <p className="text-xs text-stone-400 mt-2 flex items-center gap-1 justify-end">
              <ShieldCheck className="h-3 w-3" /> Locked by Administrator
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Your Full Name</label>
            <input 
              name="display_name"
              required 
              placeholder="Real name required"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:border-[#808b47] outline-none transition-shadow"
            />
          </div>

          {invite.role === "student" && (
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Current Grade</label>
              <select 
                name="grade"
                required
                defaultValue=""
                className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:border-[#808b47] outline-none bg-white"
              >
                <option value="" disabled>Select your grade...</option>
                <option value="Pre-K">Pre-K & Kindergarten</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Create Password</label>
            <input 
              name="password"
              type="password"
              required 
              placeholder="••••••••"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:border-[#808b47] outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="mt-6 w-full rounded-xl bg-[#808b47] px-4 py-3.5 text-center text-sm font-bold text-white hover:opacity-90 transition-opacity"
          >
            Create My Secure Account
          </button>
        </form>
      </div>
    </div>
  )
}
