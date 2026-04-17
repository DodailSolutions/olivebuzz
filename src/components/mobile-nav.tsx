"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Home, LayoutDashboard, MessageCircle, Newspaper, User } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"

const publicNavItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "News", href: "/newspaper", icon: Newspaper },
  { name: "Alerts", href: "#alerts", icon: Bell },
  { name: "Profile", href: "#profile", icon: User },
]

const dashboardNavItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "News", href: "/newspaper", icon: Newspaper },
  { name: "Inbox", href: "#inbox", icon: MessageCircle },
  { name: "Profile", href: "#profile", icon: User },
]

export function MobileNav() {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith("/dashboard")
  const navItems = isDashboard ? dashboardNavItems : publicNavItems

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-border/40"
      style={{ paddingBottom: "max(calc(env(safe-area-inset-bottom) - 10px), 0px)" }}
    >
      <nav className="flex h-16 items-center justify-around px-2 pt-1 pb-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : item.href !== "/" && item.href !== "#alerts" && item.href !== "#profile" && item.href !== "#inbox"
              ? pathname.startsWith(item.href)
              : pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 gap-1 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon
                className={`h-6 w-6 ${isActive ? "fill-primary/20 bg-primary/10 rounded-full p-1 h-8 w-8" : ""}`}
              />
              <span className="text-[10px] font-semibold">{item.name}</span>
            </Link>
          )
        })}
        <div className="flex flex-col items-center justify-center w-16 gap-1">
          <LanguageSwitcher variant="icon" />
        </div>
      </nav>
    </div>
  )
}
