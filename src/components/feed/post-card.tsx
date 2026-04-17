"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import {
  Bookmark,
  BookmarkCheck,
  Globe,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Send,
  Trash2,
} from "lucide-react"
import { toggleReaction, addComment, deletePost, toggleBookmark } from "@/app/actions/feed"
import type { FeedPost, FeedComment } from "@/lib/data/queries"
import type { Profile } from "@/types"

const REACTIONS = [
  { type: "like", emoji: "👍", label: "Like" },
  { type: "love", emoji: "❤️", label: "Love" },
  { type: "celebrate", emoji: "🎉", label: "Celebrate" },
  { type: "insightful", emoji: "💡", label: "Insightful" },
  { type: "curious", emoji: "🤔", label: "Curious" },
]

const ROLE_COLORS: Record<string, string> = {
  teacher: "bg-blue-50 text-blue-700",
  school_admin: "bg-[#808b47]/15 text-[#57714d]",
  super_admin: "bg-purple-50 text-purple-700",
  content_manager: "bg-amber-50 text-amber-700",
  student: "bg-stone-100 text-stone-600",
  parent: "bg-pink-50 text-pink-700",
  guest: "bg-stone-100 text-stone-500",
}

const ROLE_LABELS: Record<string, string> = {
  teacher: "Teacher",
  school_admin: "Admin",
  super_admin: "Super Admin",
  content_manager: "Content Manager",
  student: "Student",
  parent: "Parent",
}

interface PostCardProps {
  post: FeedPost
  currentProfile: Profile
  initialComments?: FeedComment[]
  isKg5?: boolean
}

export function PostCard({ post, currentProfile, initialComments, isKg5 = false }: PostCardProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<FeedComment[]>(initialComments ?? [])
  const [commentText, setCommentText] = useState("")
  const [showMenu, setShowMenu] = useState(false)
  const [optimisticReaction, setOptimisticReaction] = useState<string | null>(post.user_reaction)
  const [optimisticBookmark, setOptimisticBookmark] = useState(post.is_bookmarked)
  const [isPending, startTransition] = useTransition()
  const [isDeleted, setIsDeleted] = useState(false)

  if (isDeleted) return null

  const totalReactions = Object.values(post.reactions).reduce((a, b) => a + b, 0)
  const canDelete =
    post.author_id === currentProfile.id ||
    ["school_admin", "super_admin", "content_manager"].includes(currentProfile.role)

  const initials = post.author_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  function handleReaction(type: string) {
    setShowReactionPicker(false)
    setOptimisticReaction(optimisticReaction === type ? null : type)
    startTransition(async () => {
      const fd = new FormData()
      fd.set("post_id", post.id)
      fd.set("reaction_type", type)
      await toggleReaction(fd)
    })
  }

  function handleBookmark() {
    setOptimisticBookmark(!optimisticBookmark)
    const fd = new FormData()
    fd.set("post_id", post.id)
    startTransition(async () => { await toggleBookmark(fd) })
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentText.trim()) return
    const text = commentText
    setCommentText("")
    const fd = new FormData()
    fd.set("post_id", post.id)
    fd.set("content", text)
    startTransition(async () => {
      const res = await addComment(fd)
      if (res.success) {
        setComments((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            post_id: post.id,
            content: text,
            created_at: new Date().toISOString(),
            author_name: currentProfile.display_name,
            author_avatar: currentProfile.avatar_url,
            author_role: currentProfile.role,
          },
        ])
      }
    })
  }

  function handleDelete() {
    setShowMenu(false)
    const fd = new FormData()
    fd.set("post_id", post.id)
    startTransition(async () => {
      const res = await deletePost(fd)
      if (res.success) setIsDeleted(true)
    })
  }

  if (isKg5) {
    return (
      <div className="rounded-3xl border-2 border-stone-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#808b47] text-white font-black text-lg">
            {initials}
          </div>
          <div>
            <p className="font-black text-stone-900 text-lg">{post.author_name}</p>
            <p className="text-sm text-stone-500">{formatTime(post.created_at)}</p>
          </div>
        </div>
        <p className="text-xl text-stone-800 leading-relaxed">{post.content}</p>
        {post.media_urls[0] && (
          <div className="mt-3 overflow-hidden rounded-2xl">
            <Image src={post.media_urls[0]} alt="Post image" width={600} height={300} className="w-full object-cover" />
          </div>
        )}
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={() => handleReaction("love")}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xl transition ${
              optimisticReaction === "love" ? "bg-red-50 text-red-500" : "bg-stone-50 hover:bg-stone-100"
            }`}
          >
            ❤️ <span className="text-base font-bold">{post.reactions.love ?? 0}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 rounded-2xl bg-stone-50 px-4 py-2 text-xl hover:bg-stone-100"
          >
            💬 <span className="text-base font-bold">{comments.length}</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#808b47] text-sm font-black text-white">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-stone-900">{post.author_name}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ROLE_COLORS[post.author_role] ?? "bg-stone-100 text-stone-500"}`}>
                {ROLE_LABELS[post.author_role] ?? post.author_role}
              </span>
              {post.visibility === "public" && (
                <Globe className="h-3.5 w-3.5 text-stone-400" />
              )}
            </div>
            <p className="text-xs text-stone-400">{formatTime(post.created_at)}</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-50 hover:text-stone-600"
          >
            <MoreHorizontal className="h-4.5 w-4.5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 z-10 min-w-32 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
              <button
                onClick={handleBookmark}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50"
              >
                {optimisticBookmark ? <BookmarkCheck className="h-4 w-4 text-[#808b47]" /> : <Bookmark className="h-4 w-4" />}
                {optimisticBookmark ? "Bookmarked" : "Bookmark"}
              </button>
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm leading-relaxed text-stone-800 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Media */}
      {post.media_urls.length > 0 && (
        <div className={`grid gap-1 ${post.media_urls.length > 1 ? "grid-cols-2" : ""}`}>
          {post.media_urls.slice(0, 4).map((url, i) => (
            <div key={i} className="relative aspect-video overflow-hidden bg-stone-100">
              <Image src={url} alt={`Post image ${i + 1}`} fill sizes="600px" className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Reaction Summary */}
      {(totalReactions > 0 || post.comments_count > 0) && (
        <div className="flex items-center justify-between border-t border-stone-100 px-4 py-2">
          <div className="flex items-center gap-1">
            {Object.entries(post.reactions)
              .filter(([, count]) => count > 0)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([type]) => {
                const r = REACTIONS.find((r) => r.type === type)
                return r ? <span key={type} className="text-sm">{r.emoji}</span> : null
              })}
            {totalReactions > 0 && (
              <span className="ml-1 text-xs text-stone-500">{totalReactions}</span>
            )}
          </div>
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-xs text-stone-400 hover:text-stone-600"
          >
            {comments.length} comment{comments.length !== 1 ? "s" : ""}
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center border-t border-stone-100 px-2">
        <div className="relative flex-1">
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className={`flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
              optimisticReaction
                ? "text-[#808b47]"
                : "text-stone-500 hover:bg-stone-50"
            }`}
          >
            {optimisticReaction
              ? REACTIONS.find((r) => r.type === optimisticReaction)?.emoji
              : "👍"}
            {optimisticReaction
              ? REACTIONS.find((r) => r.type === optimisticReaction)?.label ?? "Like"
              : "React"}
          </button>

          {showReactionPicker && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl">
              {REACTIONS.map((r) => (
                <button
                  key={r.type}
                  onClick={() => handleReaction(r.type)}
                  title={r.label}
                  className={`group flex flex-col items-center rounded-xl p-1.5 transition hover:scale-125 ${
                    optimisticReaction === r.type ? "bg-[#808b47]/10" : ""
                  }`}
                >
                  <span className="text-xl">{r.emoji}</span>
                  <span className="mt-0.5 text-[9px] text-stone-400 group-hover:text-stone-600">
                    {r.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-stone-200" />
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-stone-500 hover:bg-stone-50"
        >
          <MessageCircle className="h-3.5 w-3.5" /> Comment
        </button>
        <div className="h-4 w-px bg-stone-200" />
        <button
          onClick={handleBookmark}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
            optimisticBookmark ? "text-[#808b47]" : "text-stone-500 hover:bg-stone-50"
          }`}
        >
          {optimisticBookmark ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
          Save
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-stone-100 bg-stone-50 px-4 py-3 space-y-3">
          {comments.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-2">No comments yet. Be first!</p>
          ) : (
            comments.map((c) => {
              const cInitials = c.author_name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
              return (
                <div key={c.id} className="flex gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-300 text-xs font-bold text-stone-700">
                    {cInitials}
                  </div>
                  <div className="flex-1 rounded-xl bg-white border border-stone-100 px-3 py-2">
                    <p className="text-xs font-bold text-stone-900">{c.author_name}</p>
                    <p className="text-xs text-stone-700 leading-relaxed">{c.content}</p>
                    <p className="mt-1 text-[10px] text-stone-400">{formatTime(c.created_at)}</p>
                  </div>
                </div>
              )
            })
          )}

          <form onSubmit={handleComment} className="flex items-center gap-2 pt-1">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#808b47] text-xs font-black text-white">
              {currentProfile.display_name.charAt(0).toUpperCase()}
            </div>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment…"
              maxLength={500}
              className="flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#808b47]"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || isPending}
              className="flex items-center justify-center rounded-xl bg-[#808b47] p-2 text-white disabled:opacity-40"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

function formatTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}
