"use client"

import { useTransition } from "react"
import { CheckCircle2, Flag, Trash2 } from "lucide-react"
import { moderatePost } from "@/app/actions/moderation"
import type { ModerationPost } from "@/lib/data/school-queries"

const VISIBILITY_LABELS: Record<string, string> = {
  school: "School",
  grade: "Grade",
  class: "Class",
  public: "Public",
}

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function PostModerationCard({ post }: { post: ModerationPost }) {
  const [isPending, startTransition] = useTransition()

  function act(action: string) {
    const fd = new FormData()
    fd.set("post_id", post.id)
    fd.set("action", action)
    startTransition(async () => {
      await moderatePost(fd)
    })
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-stone-900">{post.author_name}</span>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-500">
              {VISIBILITY_LABELS[post.visibility] ?? post.visibility}
            </span>
            {post.school_name && (
              <span className="rounded-full bg-[#808b47]/10 px-2 py-0.5 text-[10px] font-medium text-[#57714d]">
                {post.school_name}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-stone-400">{formatRelative(post.created_at)}</p>
        </div>
      </div>

      <p className="text-sm text-stone-700 leading-relaxed line-clamp-4 whitespace-pre-wrap">
        {post.content}
      </p>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => act("published")}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-xl bg-[#808b47] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#57714d] disabled:opacity-50"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Approve
        </button>
        <button
          onClick={() => act("flagged")}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
        >
          <Flag className="h-3.5 w-3.5" />
          Flag
        </button>
        <button
          onClick={() => act("removed")}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>
      </div>
    </div>
  )
}

export function ModerationQueue({ posts }: { posts: ModerationPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-20">
        <CheckCircle2 className="mb-3 h-10 w-10 text-[#808b47]/40" />
        <p className="text-sm font-semibold text-stone-500">All clear! No pending posts.</p>
        <p className="mt-1 text-xs text-stone-400">
          New submissions will appear here for review.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <PostModerationCard key={post.id} post={post} />
      ))}
    </div>
  )
}
