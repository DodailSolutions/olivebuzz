"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BookOpen, Hand, LayoutDashboard, LogOut, 
  Settings, Users, Volume2, ShieldCheck, PenTool, FileText, ExternalLink,
  Rss, Home, Bookmark
} from "lucide-react"
import { useAgeGate } from "../age-gate-provider"
import type { Profile, School } from "@/types"

interface SidebarProps {
  profile: Profile
  school: School | null
}

import { logout } from "@/app/actions/auth"

export function DashboardSidebar({ profile, school }: SidebarProps) {
  const pathname = usePathname()
  const { isKg5 } = useAgeGate()

  // Base navigation mappings
  const NAV_CONFIG = {
    super_admin: [
      { label: "Platform Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Feed", href: "/dashboard/feed", icon: Rss },
      { label: "All Schools", href: "/dashboard/directory", icon: Users },
      { label: "Moderation", href: "/dashboard/moderation", icon: ShieldCheck },
      { label: "Settings", href: "/dashboard/settings/invites", icon: Settings },
      { label: "Super Admin Panel", href: "/super-admin", icon: ExternalLink },
    ],
    school_admin: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Feed", href: "/dashboard/feed", icon: Rss },
      { label: "Directory", href: "/dashboard/directory", icon: Users },
      { label: "CMS", href: "/dashboard/cms", icon: FileText },
      { label: "Moderation", href: "/dashboard/moderation", icon: ShieldCheck },
      { label: "Settings", href: "/dashboard/settings/invites", icon: Settings },
    ],
    content_manager: [
      { label: "Content Hub", href: "/dashboard", icon: LayoutDashboard },
      { label: "Feed", href: "/dashboard/feed", icon: Rss },
      { label: "CMS", href: "/dashboard/cms", icon: FileText },
      { label: "Review Queue", href: "/dashboard/moderation", icon: ShieldCheck },
      { label: "New Post", href: "/dashboard/create", icon: PenTool },
      { label: "Newspaper", href: "/newspaper", icon: BookOpen },
    ],
    teacher: [
      { label: "My Hub", href: "/dashboard", icon: LayoutDashboard },
      { label: "Feed", href: "/dashboard/feed", icon: Rss },
      { label: "Classes", href: "/dashboard/classes", icon: BookOpen },
      { label: "CMS", href: "/dashboard/cms", icon: FileText },
      { label: "New Post", href: "/dashboard/create", icon: PenTool },
    ],
    parent: [
      { label: "Updates", href: "/dashboard", icon: Volume2 },
      { label: "Feed", href: "/dashboard/feed", icon: Rss },
      { label: "My Students", href: "/dashboard/students", icon: Users },
    ],
    student: isKg5 ? [
      { label: "My Stuff", href: "/dashboard", icon: Hand },
      { label: "School Feed", href: "/dashboard/feed", icon: Rss },
      { label: "Cool Stories", href: "/newspaper", icon: BookOpen },
    ] : [
      { label: "Planner", href: "/dashboard", icon: LayoutDashboard },
      { label: "Feed", href: "/dashboard/feed", icon: Rss },
      { label: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
      { label: "Classes", href: "/dashboard/classes", icon: BookOpen },
      { label: "School News", href: "/newspaper", icon: Volume2 },
    ]
  }

  // Fallback to student navigation if role is undefined or not mapped
  const navItems = NAV_CONFIG[profile.role as keyof typeof NAV_CONFIG] || NAV_CONFIG.student

  return (
    <aside className="w-64 shrink-0 flex-col justify-between hidden md:flex border-r border-stone-200 bg-white">
      <div>
        <div className="h-20 flex items-center px-6 border-b border-stone-100">
          <Link href="/" className="flex items-center gap-3">
            {school?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={school.logo_url} alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-tenant flex items-center justify-center text-white font-bold">
                {school?.name?.charAt(0) || "O"}
              </div>
            )}
            <span className="font-bold text-stone-900 truncate">
              {school?.name || "Olive Buzz"}
            </span>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors
                  ${isActive 
                    ? "bg-tenant/10 text-tenant" 
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"}
                  ${isKg5 ? "text-lg py-4" : "text-sm"}
                `}
              >
                <item.icon className={isKg5 ? "w-6 h-6" : "w-5 h-5"} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-stone-100">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-stone-100 border flex items-center justify-center font-bold text-stone-500 text-sm">
            {profile.display_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-stone-900 leading-tight truncate w-32">{profile.display_name}</span>
            <span className="text-xs text-stone-500 capitalize">{profile.role.replace("_", " ")}</span>
          </div>
        </div>
        
        <Link
          href="/"
          className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-stone-500 hover:bg-stone-50 hover:text-stone-900 transition-colors text-sm font-medium mt-1"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        {/* We use a form to execute the server action securely */}
        <form action={logout} className="mt-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}
