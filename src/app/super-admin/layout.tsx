import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getDashboardContext } from "@/lib/data/queries"
import { SuperAdminSidebar } from "@/components/super-admin/sidebar"

export default async function SuperAdminLayout({ children }: { children: ReactNode }) {
  const { profile, error } = await getDashboardContext()

  if (error || !profile) redirect("/login")
  if (profile.role !== "super_admin") redirect("/dashboard")

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f5f0e8]">
      <SuperAdminSidebar profile={profile} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
