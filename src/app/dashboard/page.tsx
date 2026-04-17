import type { Metadata } from "next"
import { redirect } from "next/navigation"
import {
  getDashboardContext,
  getAdminDashboardStats,
  getTeacherDashboardStats,
  getParentDashboardStats,
  getStudentDashboardStats,
} from "@/lib/data/queries"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { TeacherDashboard } from "@/components/dashboard/teacher-dashboard"
import { ParentDashboard } from "@/components/dashboard/parent-dashboard"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const { profile, school, error } = await getDashboardContext()

  if (error || !profile) {
    redirect("/login")
  }

  switch (profile.role) {
    case "super_admin":
    case "school_admin":
    case "content_manager": {
      const stats = school
        ? await getAdminDashboardStats(school.id)
        : { pendingItems: [], articlesThisMonth: 0, staffCount: 0, recentActivity: [] }
      return <AdminDashboard profile={profile} school={school ?? null} stats={stats} />
    }
    case "teacher": {
      const stats = school
        ? await getTeacherDashboardStats(school.id)
        : { pendingReviews: [], studentCount: 0 }
      return <TeacherDashboard profile={profile} school={school ?? null} stats={stats} />
    }
    case "parent": {
      const stats = school
        ? await getParentDashboardStats(school.id)
        : { announcements: [] }
      return <ParentDashboard profile={profile} school={school ?? null} stats={stats} />
    }
    case "student":
    case "guest":
    default: {
      const stats = school
        ? await getStudentDashboardStats(profile.id, school.id)
        : { articlesWritten: 0, recentActivity: [] }
      return <StudentDashboard profile={profile} school={school ?? null} stats={stats} />
    }
  }
}
