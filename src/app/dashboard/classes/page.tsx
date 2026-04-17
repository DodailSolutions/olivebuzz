import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { BookOpen, Users } from "lucide-react"
import { getDashboardContext } from "@/lib/data/queries"
import { getSchoolGrades, getGradeMembers } from "@/lib/data/school-queries"

export const metadata: Metadata = {
  title: "Classes | Olive Buzz",
}

export default async function ClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ grade?: string }>
}) {
  const { profile, school, error } = await getDashboardContext()
  if (error || !profile) redirect("/login")

  const allowed = ["school_admin", "super_admin", "teacher", "student", "content_manager"]
  if (!allowed.includes(profile.role)) redirect("/dashboard")
  if (!school) redirect("/dashboard")

  const sp = await searchParams
  const grades = await getSchoolGrades(school.id)

  // If student has a grade, default to their grade
  const defaultGrade = profile.grade ?? grades[0] ?? null
  const selectedGrade = sp.grade ?? defaultGrade

  const members = selectedGrade ? await getGradeMembers(school.id, selectedGrade) : []
  const students = members.filter((m) => m.role === "student")
  const teachers = members.filter((m) => m.role === "teacher")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <BookOpen className="h-5 w-5 text-[#808b47]" />
        <h1 className="text-2xl font-black text-stone-900">Classes</h1>
      </div>

      {grades.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-16">
          <BookOpen className="mb-3 h-10 w-10 text-stone-300" />
          <p className="text-sm font-semibold text-stone-500">No grades set up yet</p>
          <p className="mt-1 text-xs text-stone-400">
            Students need a grade assigned to appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Grade selector */}
          <div className="flex gap-1 overflow-x-auto rounded-xl border border-stone-200 bg-white p-1">
            {grades.map((grade) => (
              <Link
                key={grade}
                href={`/dashboard/classes?grade=${encodeURIComponent(grade)}`}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  selectedGrade === grade
                    ? "bg-[#808b47] text-white shadow-sm"
                    : "text-stone-500 hover:bg-stone-50"
                }`}
              >
                Grade {grade}
              </Link>
            ))}
          </div>

          {selectedGrade && (
            <div className="space-y-5">
              {/* Info bar */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2">
                  <Users className="h-4 w-4 text-[#808b47]" />
                  <span className="text-sm font-bold text-stone-900">{students.length}</span>
                  <span className="text-sm text-stone-500">students</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-bold text-stone-900">{teachers.length}</span>
                  <span className="text-sm text-stone-500">teachers</span>
                </div>
              </div>

              {/* Members grid */}
              {members.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-12">
                  <p className="text-sm text-stone-400">No members in Grade {selectedGrade}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {teachers.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-400">
                        Teachers
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {teachers.map((m) => (
                          <MemberCard key={m.id} member={m} />
                        ))}
                      </div>
                    </div>
                  )}
                  {students.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-400">
                        Students
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {students.map((m) => (
                          <MemberCard key={m.id} member={m} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quick link to grade feed */}
              <Link
                href={`/dashboard/feed?filter=grade`}
                className="inline-flex items-center gap-2 rounded-xl border border-[#808b47]/30 bg-[#808b47]/5 px-4 py-2.5 text-sm font-semibold text-[#57714d] transition hover:bg-[#808b47]/10"
              >
                View Grade {selectedGrade} Feed →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function MemberCard({
  member,
}: {
  member: { id: string; display_name: string; grade: string | null; avatar_url: string | null; role: string }
}) {
  const initials = member.display_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const isTeacher = member.role === "teacher"

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 transition-shadow hover:shadow-sm">
      {member.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={member.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
      ) : (
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black text-white ${
            isTeacher ? "bg-blue-500" : "bg-[#808b47]"
          }`}
        >
          {initials}
        </div>
      )}
      <p className="truncate text-sm font-semibold text-stone-900">{member.display_name}</p>
    </div>
  )
}
