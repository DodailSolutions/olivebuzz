import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Rss, Users, BookOpen, GraduationCap, Globe } from "lucide-react"
import Link from "next/link"
import { getDashboardContext, getFeedPosts } from "@/lib/data/queries"
import { CreatePost } from "@/components/feed/create-post"
import { PostCard } from "@/components/feed/post-card"

export const metadata: Metadata = {
  title: "Feed | Olive Buzz",
}

const FILTER_TABS = [
  { key: "school", label: "School", icon: Users },
  { key: "grade", label: "Grade", icon: GraduationCap },
  { key: "class", label: "Class", icon: BookOpen },
  { key: "public", label: "Public", icon: Globe },
] as const

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { profile, school, error } = await getDashboardContext()
  if (error || !profile) redirect("/login")
  if (!school) redirect("/dashboard")

  const sp = await searchParams
  const filter = (sp.filter as "school" | "class" | "grade") || "school"

  const posts = await getFeedPosts(school.id, profile.id, filter)
  const isKg5 = profile.age_tier === "kg_5"

  if (isKg5) {
    return (
      <div className="space-y-5 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#808b47] text-white text-2xl">
            🌟
          </div>
          <div>
            <h1 className="text-3xl font-black text-stone-900">My School Feed!</h1>
            <p className="text-stone-500">See what your friends are sharing</p>
          </div>
        </div>

        <CreatePost profile={profile} />

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-xl font-black text-stone-500">Nothing here yet!</p>
            <p className="text-stone-400">Be the first to share something 😊</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} currentProfile={profile} isKg5 />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Rss className="h-5 w-5 text-[#808b47]" />
          <h1 className="text-2xl font-black text-stone-900">School Feed</h1>
        </div>
        <Link
          href="/dashboard/bookmarks"
          className="text-xs font-medium text-[#808b47] hover:underline"
        >
          My Bookmarks →
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 rounded-xl border border-stone-200 bg-white p-1">
        {FILTER_TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`/dashboard/feed?filter=${tab.key}`}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
              filter === tab.key
                ? "bg-[#808b47] text-white shadow-sm"
                : "text-stone-500 hover:bg-stone-50"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Create Post */}
      <CreatePost profile={profile} />

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-16">
          <Rss className="mb-3 h-10 w-10 text-stone-200" />
          <p className="text-sm font-semibold text-stone-500">No posts yet</p>
          <p className="mt-1 text-xs text-stone-400">Be the first to share something with your school!</p>
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
