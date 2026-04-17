"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
  ToggleLeft,
  LogOut,
  ChevronRight,
} from "lucide-react"
import type { Profile } from "@/types"

interface SuperAdminSidebarProps {
  profile: Profile
}

const NAV = [
  {
    label: "Overview",
    href: "/super-admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Schools",
    href: "/super-admin/schools",
    icon: Building2,
  },
  {
    label: "Content & CMS",
    href: "/super-admin/content",
    icon: FileText,
  },
  {
    label: "Analytics",
    href: "/super-admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Feature Flags",
    href: "/super-admin/features",
    icon: ToggleLeft,
  },
  {
    label: "Subscriptions",
    href: "/super-admin/subscriptions",
    icon: CreditCard,
  },
  {
    label: "Platform Settings",
    href: "/super-admin/settings",
    icon: Settings,
  },
]

export function SuperAdminSidebar({ profile }: SuperAdminSidebarProps) {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-[#2d3d1a] bg-[#1a2410] text-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-[#2d3d1a] px-4 py-4">
        <div className="overflow-hidden rounded-xl border border-white/20 bg-white/10 p-0.5">
          <Image
            src="/olive-buzz-icon.svg"
            alt="Olive Buzz"
            width={32}
            height={32}
            className="h-8 w-8"
          />
        </div>
        <div>
          <p className="text-xs font-black tracking-tight text-white">Olive Buzz</p>
          <p className="text-[10px] text-white/50 uppercase tracking-widest">Super Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <div className="space-y-0.5">
          {NAV.map((item) => {
            const active = isActive(item.href, item.exact)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-[#808b47] text-white shadow-md"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className={`h-4.5 w-4.5 shrink-0 ${active ? "text-white" : "text-white/50 group-hover:text-white/80"}`} />
                <span>{item.label}</span>
                {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-white/60" />}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Back to dashboard */}
      <div className="border-t border-[#2d3d1a] p-3 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2.5 rounded-xl px-3 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#808b47] text-xs font-black text-white">
            {profile.display_name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white/80">{profile.display_name}</p>
            <p className="text-[10px] text-white/40">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
