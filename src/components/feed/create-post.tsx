"use client"

import { useState, useTransition } from "react"
import { Image as ImageIcon, Globe, Users, BookOpen, GraduationCap, Loader2, AlertCircle } from "lucide-react"
import { createPost } from "@/app/actions/feed"
import type { Profile } from "@/types"

interface CreatePostProps {
  profile: Profile
}

const VISIBILITY_OPTIONS = [
  { value: "school", label: "Whole School", icon: Users },
  { value: "grade", label: "My Grade", icon: GraduationCap },
  { value: "class", label: "My Class", icon: BookOpen },
  { value: "public", label: "Public", icon: Globe },
] as const

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  school_admin: "School Admin",
  teacher: "Teacher",
  content_manager: "Content Manager",
  student: "Student",
  parent: "Parent",
  guest: "Guest",
}

export function CreatePost({ profile }: CreatePostProps) {
  const [content, setContent] = useState("")
  const [visibility, setVisibility] = useState<string>("school")
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ error?: string; success?: boolean; status?: string } | null>(null)
  const [showImageInput, setShowImageInput] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  const isKg5 = profile.age_tier === "kg_5"
  const autoPublish = ["school_admin", "super_admin", "content_manager", "teacher"].includes(profile.role)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    setResult(null)
    const formData = new FormData()
    formData.set("content", content)
    formData.set("visibility", visibility)
    formData.set("media_urls", imageUrl)

    startTransition(async () => {
      const res = await createPost(formData)
      setResult(res)
      if (res.success) {
        setContent("")
        setImageUrl("")
        setShowImageInput(false)
      }
    })
  }

  const initials = profile.display_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  if (isKg5) {
    // Simplified "big button" version for young kids
    return (
      <form onSubmit={handleSubmit} className="rounded-3xl border-2 border-[#808b47]/30 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#808b47] text-white text-lg font-black">
            {initials}
          </div>
          <p className="text-xl font-black text-stone-900">Share something! 🌟</p>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What did you do today? 😊"
          className="w-full rounded-2xl border-2 border-stone-200 bg-stone-50 px-4 py-3 text-lg text-stone-900 outline-none focus:border-[#808b47] resize-none"
          rows={3}
          maxLength={280}
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-stone-400">{content.length}/280</span>
          <button
            type="submit"
            disabled={isPending || !content.trim()}
            className="flex items-center gap-2 rounded-2xl bg-[#808b47] px-6 py-3 text-lg font-black text-white disabled:opacity-50 hover:bg-[#57714d]"
          >
            {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "🚀 Share!"}
          </button>
        </div>
        {result?.success && (
          <p className="mt-2 text-center text-sm font-bold text-[#57714d]">
            {result.status === "pending" ? "Sent to teacher for review! ✅" : "Posted! 🎉"}
          </p>
        )}
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#808b47] text-sm font-black text-white">
          {initials}
        </div>
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm font-bold text-stone-900">{profile.display_name}</span>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
              {ROLE_LABELS[profile.role]}
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={autoPublish ? "Share an update with the school…" : "What's on your mind?"}
            className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-[#808b47] focus:bg-white"
            rows={3}
            maxLength={1500}
          />

          {showImageInput && (
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL (https://...)"
              className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-[#808b47]"
            />
          )}

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                  showImageInput ? "bg-[#808b47]/15 text-[#57714d]" : "text-stone-400 hover:bg-stone-50"
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5" /> Image
              </button>

              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="ml-2 rounded-lg border border-stone-200 bg-stone-50 px-2 py-1.5 text-xs font-medium text-stone-600 outline-none focus:border-[#808b47]"
              >
                {VISIBILITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">{content.length}/1500</span>
              <button
                type="submit"
                disabled={isPending || !content.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-[#808b47] px-4 py-2 text-xs font-bold text-white disabled:opacity-50 hover:bg-[#57714d]"
              >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                {autoPublish ? "Post" : "Submit for Review"}
              </button>
            </div>
          </div>

          {result?.error && (
            <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5" />
              {result.error}
            </div>
          )}
          {result?.success && (
            <p className="mt-2 text-xs font-medium text-[#57714d]">
              {result.status === "pending"
                ? "✓ Submitted for teacher review"
                : "✓ Posted to your school feed"}
            </p>
          )}
        </div>
      </div>
    </form>
  )
}
