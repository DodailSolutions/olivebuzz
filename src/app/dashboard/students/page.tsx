import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Users } from "lucide-react"
import { getDashboardContext } from "@/lib/data/queries"
import { getSchoolStudents } from "@/lib/data/school-queries"

export const metadata: Metadata = {
  title: "Students | Olive Buzz",
}

export default async function StudentsPage() {
  const { profile, school, error } = await getDashboardContext()
  if (error || !profile) redirect("/login")

  if (profile.role !== "parent") redirect("/dashboard")
  if (!school) redirect("/dashboard")

  const students = await getSchoolStudents(school.id)

  // Group by grade
  const byGrade = students.reduce<Record<string, typeof students>>((acc, s) => {
    const key = s.grade ?? "Unassigned"
    acc[key] = acc[key] ?? []
    acc[key].push(s)
    return acc
  }, {})
  const grades = Object.keys(byGrade).sort()

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2.5">
          <Users className="h-5 w-5 text-[#808b47]" />
          <h1 className="text-2xl font-black text-stone-900">My Students</h1>
        </div>
        <p className="mt-1 text-sm text-stone-500">
          {school.name} · {students.length} student{students.length !== 1 ? "s" : ""}
        </p>
      </div>

      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-20">
          <Users className="mb-3 h-10 w-10 text-stone-300" />
          <p className="text-sm font-semibold text-stone-500">No students found</p>
          <p className="mt-1 text-xs text-stone-400">
            Students will appear here once they join the school.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grades.map((grade) => (
            <div key={grade}>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-400">
                {grade === "Unassigned" ? "Unassigned" : `Grade ${grade}`}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {byGrade[grade].map((student) => {
                  const initials = student.display_name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)

                  return (
                    <div
                      key={student.id}
                      className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 transition-shadow hover:shadow-sm"
                    >
                      {student.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={student.avatar_url}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#808b47] text-sm font-black text-white">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-stone-900">
                          {student.display_name}
                        </p>
                        {student.grade && (
                          <p className="text-xs text-stone-400">Grade {student.grade}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Link to school feed */}
          <Link
            href="/dashboard/feed"
            className="inline-flex items-center gap-2 rounded-xl border border-[#808b47]/30 bg-[#808b47]/5 px-4 py-2.5 text-sm font-semibold text-[#57714d] transition hover:bg-[#808b47]/10"
          >
            View School Feed →
          </Link>
        </div>
      )}
    </div>
  )
}
