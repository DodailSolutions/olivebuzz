import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  Newspaper,
  Shield,
} from "lucide-react"
import { APP_NAME } from "@/lib/constants"
import { getPublishedPosts } from "@/lib/data/queries"
import { SearchButton } from "@/components/newspaper/search-button"
import { CreativeSubmitDialog } from "@/components/newspaper/creative-submit-dialog"
import { LanguageSwitcher } from "@/components/language-switcher"

export const metadata: Metadata = {
  title: "Digital Newspaper | Olive Buzz",
}

const editionDate = "Thursday, April 17, 2026"

const MUST_READ =
  "Science fair winners publish their projects in the school edition · Click to read more"

const NEWS_BYTES = [
  {
    category: "GREEN NEWS",
    badgeBg: "bg-[#808b47]",
    gradient: "linear-gradient(to bottom right, #808b47, #57714d)",
    title: "School garden project wins city sustainability award",
    author: "Campus Desk",
    image: "/green-news.png",
  },
  {
    category: "WORLD NEWS",
    badgeBg: "bg-[#c4891a]",
    gradient: "linear-gradient(to bottom right, #c4891a, #a07015)",
    title: "Students discuss global education summit outcomes",
    author: "World Desk",
    image: "/world-news.png",
  },
  {
    category: "SPORTS",
    badgeBg: "bg-[#e14851]",
    gradient: "linear-gradient(to bottom right, #e14851, #a82030)",
    title: "School athletics team wins regional championship",
    author: "Sports Desk",
    image: "/sports-team.png",
  },
  {
    category: "YOUNG ACHIEVERS",
    badgeBg: "bg-[#c4891a]",
    gradient: "linear-gradient(to bottom right, #f2b239, #c4891a)",
    title: "12-year-old wins national science olympiad first place",
    author: "Achievers Desk",
    image: "/young-achievers.png",
  },
]

const NEWS_BULLETS = [
  "Global education summit discusses AI in classrooms.",
  "New after-school coding program launches this term.",
  "Annual book fair returns to library next week.",
  "Inter-school quiz league registrations now open.",
]

const STUDENT_WALL = [
  {
    type: "CREATIVE WRITING",
    title: "The Olive Tree",
    author: "Priya S, Class 7",
    school: "Delhi Public School",
    gradient: "linear-gradient(to bottom right, #808b47, #57714d)",
    image: "/creative-writing.png",
  },
  {
    type: "CREATIVE WRITING",
    title: "A Lesson in Kindness",
    author: "Rohan M, Class 8",
    school: "Greenwood Academy",
    gradient: "linear-gradient(to bottom right, #f2b239, #c4891a)",
    image: "/creative-writing.png",
  },
  {
    type: "CREATIVE WRITING",
    title: "Summer at Camp",
    author: "Zara K, Class 9",
    school: "St. Mary's School",
    gradient: "linear-gradient(to bottom right, #e14851, #a82030)",
    image: "/creative-writing.png",
  },
  {
    type: "ARTWORK",
    title: "Thank You Teachers",
    author: "Ananya T, Class 5",
    school: "Sunrise School",
    gradient: "linear-gradient(to bottom right, #808b47, #57714d)",
    image: "/artwork.png",
  },
  {
    type: "ARTWORK",
    title: "Dreams by the Sea",
    author: "Kabir R, Class 6",
    school: "Horizon Academy",
    gradient: "linear-gradient(to bottom right, #57714d, #3a5038)",
    image: "/artwork.png",
  },
  {
    type: "ARTWORK",
    title: "Adventures in Dino Land",
    author: "Meera P, Class 4",
    school: "Little Stars School",
    gradient: "linear-gradient(to bottom right, #f2b239, #c4891a)",
    image: "/artwork.png",
  },
]

const LEARN_ARTICLES = [
  {
    tag: "STUDY BRIGHT",
    tagBg: "bg-[#808b47]",
    title: "How to Make Your Study Schedule",
    excerpt:
      "A good study schedule strikes the perfect balance between work and relaxation, sets realistic goals and is flexible to meet.",
    image: "/study.png",
    gradient: "linear-gradient(to bottom right, #808b47, #57714d)",
  },
  {
    tag: "STUDY BRIGHT",
    tagBg: "bg-[#808b47]",
    title: "How to Prepare for an Exam",
    excerpt:
      "Exams can feel stressful and overwhelming, but the key to a calm and successful exam season is solid preparation.",
    image: "/study.png",
    gradient: "linear-gradient(to bottom right, #f2b239, #c4891a)",
  },
  {
    tag: "CAMPUS LIFE",
    tagBg: "bg-[#e14851]",
    title: "How to Introduce Yourself to New People",
    excerpt:
      "We meet so many people at school — the principal, teachers, friends, seniors or even new batchmates.",
    image: "/campus-life.png",
    gradient: "linear-gradient(to bottom right, #e14851, #a82030)",
  },
  {
    tag: "CAMPUS LIFE",
    tagBg: "bg-[#e14851]",
    title: "How to Collaborate With Classmates in Group Work",
    excerpt:
      "Group work can be a mix of great ideas, new friendships and some head-scratching moments.",
    image: "/campus-life.png",
    gradient: "linear-gradient(to bottom right, #57714d, #3a5038)",
  },
]

export default async function NewspaperPage() {
  const postsData = await getPublishedPosts()

  return (
    <div className="min-h-screen bg-white text-stone-900">
      {/* ── MUST READ TOP BAR ─────────────────────────────────── */}
      <div className="bg-[#e14851] text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 text-sm sm:px-6">
          <span className="shrink-0 rounded bg-white px-2 py-0.5 text-xs font-black uppercase tracking-wide text-[#e14851]">
            Must Read
          </span>
          <ChevronLeft className="h-4 w-4 shrink-0 opacity-70" />
          <span className="line-clamp-1 flex-1">{MUST_READ}</span>
          <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />
          <span className="ml-auto hidden shrink-0 text-xs opacity-80 sm:block">{editionDate}</span>
        </div>
      </div>

      {/* ── MASTHEAD ──────────────────────────────────────────── */}
      <div className="bg-white/80 backdrop-blur-xl sticky top-10 z-30 border-b border-stone-200/60 dark:bg-black/80 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="overflow-hidden rounded-xl border border-stone-200 shadow-sm">
              <Image
                src="/olive-buzz-logo.svg"
                alt="Olive Buzz logo"
                width={56}
                height={56}
                priority
                className="h-14 w-14"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
                {APP_NAME}
              </p>
              <p className="font-serif text-2xl font-black leading-tight">Daily Edition</p>
            </div>
          </Link>

          <div
            className="mx-auto hidden max-w-sm flex-1 overflow-hidden rounded-xl p-4 text-white lg:block"
            style={{ background: "linear-gradient(to right, #808b47, #57714d)" }}
          >
            <p className="flex items-center text-xs font-semibold uppercase tracking-wider opacity-80">
              <Megaphone className="mr-1.5 h-3.5 w-3.5" /> School Announcement
            </p>
            <p className="mt-1 text-xl font-bold leading-tight">Science &amp; Arts Festival 2025–26</p>
            <p className="mt-0.5 text-xs opacity-80">
              Click here to register · Deadline: April 30
            </p>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <LanguageSwitcher variant="icon" />
            <SearchButton
              className="hidden rounded-lg border border-stone-300 p-2 hover:bg-stone-50 sm:block"
              iconClassName="h-4 w-4 text-stone-600"
            />
            <Link
              href="/onboarding/school"
              className="rounded-lg bg-[#e14851] px-4 py-2 text-sm font-bold text-white hover:bg-[#c02030]"
            >
              Subscribe
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-50"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-40 bg-[#808b47]/95 backdrop-blur-md text-white shadow-lg border-b border-[#57714d]/50">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6">
          {postsData.sections.map((section: string, i: number) => (
            <Link
              key={section}
              href={i === 0 ? "/newspaper" : `#${section.toLowerCase().replace(/ /g, "-")}`}
              className={`shrink-0 rounded px-3 py-1.5 text-sm font-medium transition hover:bg-white/20 ${i === 0 ? "bg-white/25 font-bold" : ""}`}
            >
              {section}
            </Link>
          ))}
          <div className="ml-auto flex shrink-0 items-center gap-2 pl-2">
            <LanguageSwitcher variant="icon" className="text-white hover:bg-white/20" />
            <Link
              href="/onboarding/school"
              className="shrink-0 rounded bg-[#e14851] px-3 py-1.5 text-sm font-bold hover:bg-[#c02030]"
            >
              Subscribe Now
            </Link>
            <SearchButton
              className="shrink-0 rounded p-1.5 hover:bg-white/20"
              iconClassName="h-4 w-4"
            />
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* HERO */}
        <section className="grid gap-6 lg:grid-cols-[2fr_1fr] animate-in slide-in-from-bottom-8 fade-in duration-700">
          <article className="group cursor-pointer overflow-hidden rounded-[2rem] glass-card border-[0.5px]">
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <Image
                src="/newspaper-top.png"
                alt="Students collaborating in newspaper"
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2">
                <span className="rounded bg-[#e14851] px-2 py-0.5 text-xs font-bold uppercase text-white">
                  Top Story
                </span>
                <span className="text-xs text-stone-500">{editionDate}</span>
              </div>
              <h2 className="mt-3 font-serif text-2xl font-black leading-tight sm:text-3xl">
                {postsData.featuredStory.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {postsData.featuredStory.excerpt}
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-stone-500">
                <span className="font-semibold text-stone-700">{postsData.featuredStory.author}</span>
                <span>·</span>
                <span>5 min read</span>
              </div>
            </div>
          </article>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <article className="group cursor-pointer overflow-hidden rounded-3xl glass-card border-[0.5px]">
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src="/quiz.png"
                  alt="Personality Quiz"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-bold uppercase text-[#c4891a]">Personality Quiz</span>
                <h3 className="mt-1 font-serif text-base font-bold leading-tight">
                  How Do You Handle Conflict in School?
                </h3>
              </div>
            </article>

            <article className="group cursor-pointer overflow-hidden rounded-3xl glass-card border-[0.5px] sm:col-span-2 lg:col-span-1">
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src="/academics.png"
                  alt="Academics"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-bold uppercase text-[#e14851]">Academics</span>
                <h3 className="mt-1 font-serif text-base font-bold leading-tight">
                  Teachers share revision tips ahead of exam season
                </h3>
              </div>
            </article>

            <article className="group cursor-pointer overflow-hidden rounded-3xl glass-card border-[0.5px] sm:col-span-2 lg:col-span-1">
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src="/hero-students.png"
                  alt="Students on campus"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-bold uppercase text-[#57714d]">World News</span>
                <h3 className="mt-1 font-serif text-base font-bold leading-tight">
                  How global news shapes what we learn in school
                </h3>
              </div>
            </article>
          </div>
        </section>

        {/* PROMO BANNER */}
        <div
          className="mt-8 overflow-hidden rounded-[2rem] px-10 py-8 text-white shadow-2xl shadow-[#808b47]/20 border border-white/20 animate-in slide-in-from-bottom fade-in duration-700 delay-150 fill-mode-both"
          style={{ background: "linear-gradient(to right, #808b47, #57714d, #3a5038)" }}
        >
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex-1">
              <p className="flex items-center text-xs font-semibold uppercase tracking-widest opacity-80">
                <Megaphone className="mr-2 h-4 w-4" /> School Event
              </p>
              <p className="mt-1 text-3xl font-black sm:text-4xl">
                Science &amp; Arts Festival 2025–26
              </p>
              <p className="mt-1 text-sm opacity-80">
                Registrations open for all students · Click to learn more
              </p>
            </div>
            <Link
              href="#"
              className="shrink-0 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#808b47] hover:bg-stone-100"
            >
              Register Now →
            </Link>
          </div>
        </div>

        {/* SUBSCRIBE PROMO */}
        <div className="mt-5 flex flex-col items-center gap-4 overflow-hidden rounded-2xl border border-stone-200 bg-[#f5f0e8] px-8 py-6 text-center sm:flex-row sm:text-left">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-stone-200/50 shadow-sm">
            <Image src="/study.png" alt="Subscribe" fill sizes="64px" className="object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-xl font-black sm:text-2xl">
              1 article a day keeps students informed and engaged!
            </p>
            <p className="mt-1 text-sm text-stone-600">
              That&apos;s all it takes to build a reading habit and stay connected with school life.
            </p>
          </div>
          <Link
            href="#"
            className="shrink-0 rounded-xl bg-[#d62828] px-6 py-3 text-sm font-bold text-white hover:bg-red-700"
          >
            Subscribe Now →
          </Link>
        </div>

        {/* NEWS BYTES */}
        <section className="mt-8" id="campus">
          <div className="mb-4 flex items-center gap-3 border-b-2 border-[#808b47] pb-2">
            <Newspaper className="h-5 w-5 text-[#808b47]" />
            <h2 className="text-xl font-black uppercase tracking-wide text-[#808b47]">
              News Bytes
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-in slide-in-from-bottom fade-in duration-700 delay-300 fill-mode-both">
            {NEWS_BYTES.map((article) => (
              <article
                key={article.title}
                className="group cursor-pointer overflow-hidden rounded-3xl glass-card border-[0.5px]"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 z-0"
                  />
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                </div>
                <div className="p-5">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-bold uppercase text-white ${article.badgeBg}`}
                  >
                    {article.category}
                  </span>
                  <h3 className="mt-2 font-serif text-base font-bold leading-snug">
                    {article.title}
                  </h3>
                  <p className="mt-1 text-xs text-stone-500">{article.author}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* DON'T MISS */}
        <section className="mt-8">
          <div className="mb-4 border-b-2 border-stone-900 pb-2">
            <h2 className="text-xl font-black uppercase tracking-wide">Don&apos;t Miss</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3 animate-in slide-in-from-bottom fade-in duration-700">
            <article className="group cursor-pointer overflow-hidden rounded-3xl glass-card border-[0.5px]">
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src="/sports-team.png"
                  alt="Sports team victory"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-bold uppercase text-[#808b47]">
                  Big Friendly Profile
                </span>
                <p className="text-xs font-semibold uppercase text-stone-400">Focus on Student</p>
                <h3 className="mt-1 font-serif text-xl font-bold leading-tight">
                  Aarav Sharma: Digging Into the Story
                </h3>
              </div>
            </article>

            <article className="group cursor-pointer overflow-hidden rounded-3xl glass-card border-[0.5px]">
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src="/creative-writing.png"
                  alt="Student-Led Journalism"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-bold uppercase text-[#808b47]">Learn More</span>
                <h3 className="mt-2 font-serif text-xl font-bold leading-tight">
                  What is Student-Led Journalism?
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Young reporters at Olive Buzz schools are redefining how news is made safely in
                  education.
                </p>
              </div>
            </article>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 border-b border-stone-200 pb-3">
                <Bell className="h-4 w-4 text-[#e14851]" />
                <p className="text-sm font-bold uppercase tracking-wide text-[#e14851]">
                  News Bulletin
                </p>
              </div>
              <ul className="space-y-3">
                {NEWS_BULLETS.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-2 border-b border-stone-100 pb-3 text-sm last:border-0 last:pb-0"
                  >
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#808b47]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* WALL OF FAME */}
        <section id="hall-of-fame" className="mt-8">
          <div className="mb-4 flex items-center gap-3 border-b-2 border-[#808b47] pb-2">
            <BookOpen className="h-5 w-5 text-[#808b47]" />
            <h2 className="text-xl font-black uppercase tracking-wide text-[#808b47]">
              Wall of Fame
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-in slide-in-from-bottom fade-in duration-700">
            {STUDENT_WALL.map((item) => (
              <article
                key={item.title}
                className="group cursor-pointer overflow-hidden rounded-3xl glass-card border-[0.5px]"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="rounded bg-stone-100 px-2 py-0.5 text-xs font-bold uppercase text-stone-600">
                    {item.type}
                  </span>
                  <h3 className="mt-2 font-serif text-lg font-bold leading-tight">{item.title}</h3>
                  <p className="mt-1 text-xs text-stone-500">{item.author}</p>
                  <p className="text-xs text-stone-400">{item.school}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* UPLOAD CTA */}
        <div
          className="mt-6 overflow-hidden rounded-2xl p-8 text-center text-white"
          style={{ background: "linear-gradient(135deg, #f2b239 0%, #808b47 50%, #e14851 100%)" }}
        >
          <p className="text-3xl font-black sm:text-4xl">Upload Your Creative Best</p>
          <p className="mt-2 text-sm opacity-90">
            and get featured on Olive Buzz Wall of Fame
          </p>
          <CreativeSubmitDialog />
          <p className="mt-4 text-right text-xs opacity-70">
            → Follow Olive Buzz on Social Media
          </p>
        </div>

        {/* LEARN WITH OLIVE BUZZ + SAFETY SIDEBAR */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="mb-4 flex items-center justify-between border-b-2 border-stone-900 pb-2">
              <h2 className="text-xl font-black uppercase tracking-wide">
                Learn With Olive Buzz
              </h2>
              <Link href="#" className="text-xs font-semibold text-[#808b47] hover:underline">
                Load More Posts →
              </Link>
            </div>
            <div className="space-y-4">
              {LEARN_ARTICLES.map((article) => (
                <article
                  key={article.title}
                  className="group flex cursor-pointer gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-bold uppercase text-white ${article.tagBg}`}
                    >
                      {article.tag}
                    </span>
                    <h3 className="mt-1 font-serif text-lg font-bold leading-snug">
                      {article.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-stone-600">{article.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl p-6 text-white"
            style={{ background: "linear-gradient(to bottom right, #808b47, #57714d)" }}
          >
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6" />
              <p className="font-bold uppercase tracking-wide">Check Your Child&apos;s Safety Meter</p>
            </div>
            <p className="mt-3 text-sm leading-6 opacity-90">
              Olive Buzz keeps students safe with AI moderation, teacher approval, and
              age-appropriate content controls.
            </p>
            <Link
              href="/safety-quiz"
              className="mt-4 block rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-[#808b47] hover:bg-stone-100"
            >
              Take the Quiz →
            </Link>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
                ✅ Teacher-approved publishing
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
                ✅ Age-appropriate visibility
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
                ✅ No ads · No data sharing
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL LINKS */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-stone-200 pt-6">
          <p className="text-sm font-semibold text-stone-600">{APP_NAME} on Social Media:</p>
          {["📘", "🐦", "📸", "▶️"].map((icon, i) => (
            <Link key={i} href="#" className="text-2xl transition hover:scale-110">
              {icon}
            </Link>
          ))}
        </div>
      </div>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="mt-6 border-t border-stone-200 bg-stone-50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4 py-5 text-xs text-stone-500 sm:px-6">
          {[
            { label: "Subscribe", href: "/subscribe" },
            { label: "Contact Us", href: "/contact" },
            { label: "About Us", href: "/about" },
            { label: "Advertise", href: "/advertise" },
            { label: "For Schools", href: "/for-schools" },
            { label: "My Bookmarks", href: "/dashboard/bookmarks" },
            { label: "Testimonials", href: "/testimonials" },
          ].map((item, i, arr) => (
            <span key={item.label} className="flex items-center gap-3">
              <Link href={item.href} className="hover:text-stone-800 hover:underline">
                {item.label}
              </Link>
              {i < arr.length - 1 && <span className="text-stone-300">·</span>}
            </span>
          ))}
        </div>
        <div className="border-t border-stone-200 py-3 text-center text-xs text-stone-400">
          © 2026 {APP_NAME}. All content is created by students and reviewed by educators.
        </div>
        <div className="flex items-center justify-center gap-6 py-3 text-xs text-stone-400">
          <Link href="/refund" className="hover:underline">
            Shipping &amp; Refund Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Use
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  )
}
