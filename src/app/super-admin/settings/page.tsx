import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getDashboardContext } from "@/lib/data/queries"
import { updateSchoolSettings } from "@/app/actions/cms"
import { Bell, Globe, Mail, Palette, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Platform Settings | Super Admin",
}

export default async function SuperAdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  const { profile } = await getDashboardContext()
  if (!profile || profile.role !== "super_admin") redirect("/dashboard")

  const sp = await searchParams

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-stone-900">Platform Settings</h1>
        <p className="mt-1 text-stone-500">Configure global platform behavior and defaults.</p>
      </div>

      {sp.saved && (
        <div className="rounded-xl border border-[#808b47]/30 bg-[#808b47]/10 px-4 py-3 text-sm font-medium text-[#57714d]">
          ✓ Settings saved
        </div>
      )}
      {sp.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {decodeURIComponent(sp.error)}
        </div>
      )}

      <div className="space-y-5">
        {/* Branding */}
        <Section icon={Palette} title="Branding & Identity">
          <div className="space-y-4">
            <Field label="Platform Name">
              <input
                name="platform_name"
                defaultValue="Olive Buzz"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-[#808b47] focus:bg-white"
              />
            </Field>
            <Field label="Platform Tagline">
              <input
                name="platform_tagline"
                defaultValue="Your school's voice, amplified."
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-[#808b47] focus:bg-white"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Primary Color">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    defaultValue="#808b47"
                    className="h-10 w-10 cursor-pointer rounded-xl border border-stone-200 p-0.5"
                  />
                  <input
                    type="text"
                    defaultValue="#808b47"
                    readOnly
                    className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 font-mono text-sm"
                  />
                </div>
              </Field>
              <Field label="Accent Color">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    defaultValue="#f2b239"
                    className="h-10 w-10 cursor-pointer rounded-xl border border-stone-200 p-0.5"
                  />
                  <input
                    type="text"
                    defaultValue="#f2b239"
                    readOnly
                    className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 font-mono text-sm"
                  />
                </div>
              </Field>
            </div>
          </div>
          <SaveButton />
        </Section>

        {/* SEO Defaults */}
        <Section icon={Globe} title="Default SEO Settings">
          <div className="space-y-4">
            <Field label="Default Meta Title Template" hint="{school} and {article} are available as variables">
              <input
                defaultValue="{article} | {school} · Olive Buzz"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-[#808b47] focus:bg-white"
              />
            </Field>
            <Field label="Default OG Image URL">
              <input
                placeholder="https://yourdomain.com/og-default.png"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-[#808b47] focus:bg-white"
              />
            </Field>
            <Field label="robots.txt Policy">
              <select className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-[#808b47] focus:bg-white">
                <option value="index">Allow indexing (index, follow)</option>
                <option value="noindex">Block all bots (noindex, nofollow)</option>
              </select>
            </Field>
          </div>
          <SaveButton />
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Platform Notifications">
          <div className="space-y-3">
            {[
              { label: "New school registration", defaultChecked: true },
              { label: "Article submitted for review", defaultChecked: true },
              { label: "Weekly platform report", defaultChecked: false },
              { label: "Failed login attempts (security)", defaultChecked: true },
            ].map((item) => (
              <label key={item.label} className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    defaultChecked={item.defaultChecked}
                    className="peer h-4 w-4 rounded border border-stone-300 text-[#808b47] accent-[#808b47]"
                  />
                </div>
                <span className="text-sm text-stone-700">{item.label}</span>
              </label>
            ))}
          </div>
          <SaveButton />
        </Section>

        {/* Email */}
        <Section icon={Mail} title="Email Configuration">
          <div className="space-y-4">
            <Field label="From Email Address">
              <input
                defaultValue="noreply@olivebuzz.com"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-[#808b47] focus:bg-white"
              />
            </Field>
            <Field label="Reply-To Address">
              <input
                defaultValue="support@olivebuzz.com"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-[#808b47] focus:bg-white"
              />
            </Field>
          </div>
          <SaveButton />
        </Section>

        {/* Security */}
        <Section icon={Shield} title="Security">
          <div className="space-y-3">
            {[
              { label: "Require email verification for new users", defaultChecked: true },
              { label: "Allow public article comments", defaultChecked: false },
              { label: "Enable rate limiting on auth endpoints", defaultChecked: true },
            ].map((item) => (
              <label key={item.label} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={item.defaultChecked}
                  className="h-4 w-4 rounded border border-stone-300 accent-[#808b47]"
                />
                <span className="text-sm text-stone-700">{item.label}</span>
              </label>
            ))}
          </div>
          <SaveButton />
        </Section>
      </div>
    </div>
  )
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#808b47]/15">
          <Icon className="h-4.5 w-4.5 text-[#57714d]" />
        </div>
        <h2 className="font-bold text-stone-900">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-stone-700 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-stone-400 mb-1.5">{hint}</p>}
      {children}
    </div>
  )
}

function SaveButton() {
  return (
    <div className="pt-2">
      <button
        type="button"
        className="rounded-xl bg-[#808b47] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#57714d]"
        onClick={() => {}}
      >
        Save Changes
      </button>
    </div>
  )
}
