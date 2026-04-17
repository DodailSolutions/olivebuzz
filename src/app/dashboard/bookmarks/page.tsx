import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Bookmark } from "lucide-react"
import { getDashboardContext, getBookmarkedPosts } from "@/lib/data/queries"
import { PostCard } from "@/components/feed/post-card"

export const metadata: Metadata = {
  title: "Bookmarks | Olive Buzz",
}

export default async function BookmarksPage() {
  const { profile, school, error } = await getDashboardContext()
  if (error || !profile) redirect("/login")

  const posts = await getBookmarkedPosts(profile.id)

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center gap-2.5">
        <Bookmark className="h-5 w-5 text-[#808b47]" />
        <h1 className="text-2xl font-black text-stone-900">My Bookmarks</h1>
      </div>
      <p className="text-sm text-stone-500">{posts.length} saved post{posts.length !== 1 ? "s" : ""}</p>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-20">
          <Bookmark className="mb-3 h-10 w-10 text-stone-200" />
          <p className="text-sm font-semibold text-stone-500">No bookmarks yet</p>
          <p className="mt-1 text-xs text-stone-400">
            Tap the bookmark icon on any post to save it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} currentProfile={profile} />
          ))}
        </div>
      )}
    </div>
  )
}
