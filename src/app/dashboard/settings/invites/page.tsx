"use client"

import { useState } from "react"
import { createInvite } from "@/app/actions/invites"
import { Copy, Plus, Send } from "lucide-react"

export default function InvitesDashboard() {
  const [error, setError] = useState<string | null>(null)
  const [successLink, setSuccessLink] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccessLink(null)
    const result = await createInvite(formData)
    
    if (result.error) {
      setError(result.error)
    } else if (result.token) {
      setSuccessLink(`${window.location.origin}/invite/${result.token}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 border-b border-stone-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-900">User Invitations</h1>
          <p className="text-sm text-stone-500">Securely invite students, parents, and teachers to your school.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Plus className="h-5 w-5 text-[#808b47]" />
            Generate New Invitation
          </h2>
        </div>
        
        <form action={handleSubmit} className="p-6 space-y-5">
          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Recipient Email</label>
              <input 
                name="email" 
                type="email" 
                required 
                placeholder="student@school.org" 
                className="w-full rounded-xl border border-stone-300 px-4 py-2.5 focus:border-[#808b47] outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Assign Role</label>
              <select 
                name="role" 
                required 
                className="w-full rounded-xl border border-stone-300 px-4 py-2.5 focus:border-[#808b47] outline-none bg-white"
              >
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="teacher">Teacher</option>
                <option value="content_manager">Content Manager</option>
              </select>
            </div>
          </div>
          <button 
            type="submit" 
            className="flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-[#808b47] transition-colors"
          >
            <Send className="h-4 w-4" />
            Generate Token
          </button>
        </form>
      </div>

      {successLink && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 animate-in slide-in-from-bottom flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-green-900 uppercase">Invitation Generated</p>
            <p className="text-sm text-green-700 mt-1 font-mono select-all truncate max-w-xl">{successLink}</p>
          </div>
          <button 
            type="button"
            onClick={() => navigator.clipboard.writeText(successLink)}
            className="flex items-center gap-2 rounded-lg bg-green-200/50 px-4 py-2 text-sm font-bold text-green-900 hover:bg-green-200"
          >
            <Copy className="h-4 w-4" />
            Copy Link
          </button>
        </div>
      )}
    </div>
  )
}
