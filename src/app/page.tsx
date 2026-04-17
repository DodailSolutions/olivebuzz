import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BellRing,
  Brain,
  CheckCircle2,
  Globe,
  Lock,
  MessageCircle,
  Newspaper,
  Shield,
  Smartphone,
  Sparkles,
  Users,
  Video,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { APP_NAME, NEWSPAPER_FEATURED_STORY } from "@/lib/constants"
import { getLandingPageContent } from "@/lib/data/queries"
import { LanguageSwitcher } from "@/components/language-switcher"

const iconMap = {
  MessageCircle,
  Newspaper,
  Video,
  Shield,
  Globe,
  Brain,
}

type LandingFeature = {
  title: string
  description: string
  icon: keyof typeof iconMap
}

type LandingStep = {
  step: number
  title: string
  description: string
}

type LandingTestimonial = {
  quote: string
  author: string
  role: string
  avatar: string
}

export default async function Home() {
  const { features, howItWorks, testimonials } = await getLandingPageContent()
  const featureItems = features as LandingFeature[]
  const stepItems = howItWorks as LandingStep[]
  const testimonialItems = testimonials as LandingTestimonial[]

  const t = await getTranslations()

  const safetyHighlights = [
    { title: t("safety.ageAware"), description: t("safety.ageAwareDesc"), icon: Lock },
    { title: t("safety.humanAI"), description: t("safety.humanAIDesc"), icon: Shield },
    { title: t("safety.webApp"), description: t("safety.webAppDesc"), icon: Smartphone },
  ]

  const feedPreview = [
    { title: t("feed.science"), meta: t("feed.scienceMeta") },
    { title: t("feed.debate"), meta: t("feed.debateMeta") },
    { title: t("feed.transport"), meta: t("feed.transportMeta") },
  ]

  const stats = [
    { value: "500+", label: t("stats.schools") },
    { value: "200K+", label: t("stats.students") },
    { value: "50K+", label: t("stats.articles") },
    { value: "99.9%", label: t("stats.uptime") },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-160 bg-[radial-gradient(circle_at_top,rgba(123,157,74,0.15),transparent_60%)]" />

      <header className="sticky top-0 z-30 glass border-b-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-lg shadow-primary/15">
              <Image
                src="/olive-buzz-icon.svg"
                alt="Olive Buzz logo"
                width={40}
                height={40}
                priority
                className="h-10 w-10"
              />
            </div>
            <div>
              <p className="text-sm font-semibold">{APP_NAME}</p>
              <p className="text-xs text-muted-foreground">{t("nav.tagline")}</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="/#platform" className="transition hover:text-foreground">
              {t("nav.platform")}
            </Link>
            <Link href="/newspaper" className="transition hover:text-foreground">
              {t("nav.newspaper")}
            </Link>
            <Link href="/#safety" className="transition hover:text-foreground">
              {t("nav.safety")}
            </Link>
            <Link href="/#stories" className="transition hover:text-foreground">
              {t("nav.stories")}
            </Link>
          </nav>

          <div className="hidden shrink-0 items-center gap-2 sm:flex pl-2">
            <LanguageSwitcher variant="icon" />
            <Link
              href="/newspaper"
              className="rounded-lg px-4 py-2 text-sm font-bold text-accent-foreground hover:bg-black/5"
            >
              {t("nav.schoolNews")}
            </Link>
            <Link
              href="/onboarding/school"
              className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-stone-800"
            >
              {t("nav.requestDemo")}
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-8 lg:py-16">
          <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700 fill-mode-both">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary shadow-sm">
              <CheckCircle2 className="h-4 w-4" />
              {t("hero.badge")}
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-black tracking-tighter sm:text-6xl lg:text-[4.5rem] text-stone-900 dark:text-stone-50 pb-2 leading-[1.05]">
                {t("hero.title")}
              </h1>
              <p className="max-w-2xl text-xl leading-relaxed text-muted-foreground font-medium">
                {t("hero.subtitle")}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/onboarding/school"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 font-bold text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/40"
              >
                {t("hero.ctaPrimary")}
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/newspaper"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-7 py-3.5 font-bold shadow-sm transition hover:bg-accent"
              >
                {t("hero.ctaSecondary")}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-card rounded-2xl p-4">
                  <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/40 bg-white/40 backdrop-blur-2xl p-3 shadow-2xl shadow-primary/10 animate-in slide-in-from-right-8 fade-in duration-700 delay-150 fill-mode-both dark:bg-black/20">
            <div className="rounded-[1.5rem] border border-border/40 bg-white/60 p-4 shadow-inner dark:bg-stone-900/60">
              <div className="relative mb-5 h-56 w-full overflow-hidden rounded-2xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)]">
                <Image
                  src="/hero-students.png"
                  alt="Students looking at tablet"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{t("pulse.title")}</p>
                  <p className="text-xs text-muted-foreground">{t("pulse.subtitle")}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {t("pulse.live")}
                </span>
              </div>

              <div className="space-y-3">
                {feedPreview.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-border/60 bg-background/90 p-3 shadow-sm">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.meta}</p>
                      </div>
                      <div className="rounded-full bg-accent p-2 text-primary">
                        <BellRing className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] font-medium text-muted-foreground">
                      <span>{t("pulse.moderated")}</span>
                      <span>{t("pulse.familyVisible")}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-primary p-4 text-primary-foreground">
                  <p className="text-sm font-semibold">{t("pulse.dailyDigest")}</p>
                  <p className="mt-1 text-sm opacity-90">{t("pulse.dailyDigestDesc")}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/90 p-4">
                  <div className="mb-2 flex items-center gap-2 font-semibold">
                    <Users className="h-4 w-4 text-primary" />
                    {t("pulse.trustedCircles")}
                  </div>
                  <p className="text-sm text-muted-foreground">{t("pulse.trustedCirclesDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mb-6 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              {t("platform.label")}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {t("platform.title")}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featureItems.map((feature) => {
              const Icon = iconMap[feature.icon as keyof typeof iconMap] ?? Sparkles

              return (
                <div
                  key={feature.title}
                  className="group glass-card rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-tr from-primary/20 to-primary/5 text-primary shadow-inner transition-colors duration-500 group-hover:from-primary/30 group-hover:to-primary/10">
                    <Icon className="h-6 w-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-5deg]" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        <section id="safety" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/20">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] opacity-85">
                {t("safety.label")}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">{t("safety.title")}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 opacity-90">{t("safety.desc")}</p>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {t("safety.point1")}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {t("safety.point2")}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {t("safety.point3")}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {safetyHighlights.map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.title} className="group rounded-3xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/40 hover:-translate-y-1">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary transition-colors duration-500 group-hover:bg-primary/20">
                      <Icon className="h-5 w-5 transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mb-6 flex items-center gap-2 text-primary">
            <Globe className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-[0.22em]">
              {t("howItWorks.label")}
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-3 animate-in slide-in-from-bottom fade-in duration-700">
            {stepItems.map((item) => (
              <div key={item.step} className="group glass-card rounded-3xl p-6 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-primary to-[#57714d] text-sm font-bold text-primary-foreground shadow-md transition-transform duration-500 group-hover:scale-[1.15] group-hover:shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm font-semibold text-primary">
                  <Newspaper className="h-4 w-4" />
                  {t("newspaper.label")}
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {t("newspaper.title")}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                  {NEWSPAPER_FEATURED_STORY.excerpt}
                </p>
              </div>

              <div className="rounded-3xl border border-border/70 bg-background p-4 shadow-sm lg:max-w-md">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  {NEWSPAPER_FEATURED_STORY.category}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{NEWSPAPER_FEATURED_STORY.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {NEWSPAPER_FEATURED_STORY.author} • {NEWSPAPER_FEATURED_STORY.readTime}
                </p>
                <Link
                  href="/newspaper"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  {t("newspaper.open")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="stories" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mb-6 flex items-center gap-2 text-primary">
            <Newspaper className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-[0.22em]">
              {t("stories.label")}
            </span>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {testimonialItems.map((item) => (
              <div key={item.author} className="group glass-card rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                <p className="text-sm leading-6 text-muted-foreground italic tracking-wide transition-colors duration-300 group-hover:text-foreground">"{item.quote}"</p>
                <div className="mt-6 flex items-center gap-4 border-t border-border/40 pt-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/20">
                    {item.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{item.author}</p>
                    <p className="text-sm text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="launch" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="rounded-[2rem] border border-border/70 bg-linear-to-r from-primary to-[#7f9f4e] p-6 text-primary-foreground shadow-2xl shadow-primary/20 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] opacity-85">
                  {t("launch.label")}
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  {t("launch.title")}
                </h2>
                <p className="mt-3 text-sm leading-6 opacity-90 sm:text-base">{t("launch.desc")}</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#platform"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-primary transition hover:opacity-90"
                >
                  <Video className="h-4 w-4" />
                  {t("launch.highlights")}
                </Link>
                <Link
                  href="#safety"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  {t("launch.security")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

