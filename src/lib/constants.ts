export const APP_NAME = "Olive Buzz"
export const APP_DESCRIPTION =
  "Olive Buzz is a safe, private school social media and news platform connecting students, parents, teachers and administrators. Age-appropriate content, real-time updates, and community-first design — built for schools worldwide."
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export const SITE_KEYWORDS = [
  // Core value props
  "safe school social media",
  "school community platform",
  "student social network",
  "private school app",
  "education social platform",
  // User segments
  "school communication app",
  "parent teacher communication",
  "student news platform",
  "classroom community",
  "school parent portal",
  // Features
  "school newspaper app",
  "student newsroom",
  "age-appropriate social media",
  "school content moderation",
  "student safety online",
  // Long-tail / intent
  "safe social media for students",
  "social platform for schools",
  "school community news",
  "private school network",
  "K-12 social platform",
  "school app for parents",
  "educational social network",
  "school news feed app",
]

export const REACTION_EMOJIS: Record<string, string> = {
  like: "👍",
  love: "❤️",
  celebrate: "🎉",
  insightful: "💡",
  curious: "🤔",
}

export const AGE_TIER_LABELS: Record<string, string> = {
  kg_5: "KG – Grade 5",
  grade_6_12: "Grade 6 – 12",
  undergrad: "Undergraduate",
  postgrad: "Postgraduate",
  adult: "Adult / Staff",
}

export const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  school_admin: "School Admin",
  teacher: "Teacher",
  content_manager: "Content Manager",
  student: "Student",
  parent: "Parent",
  guest: "Guest",
}

export const FEATURES = [
  {
    title: "Social Feed",
    description:
      "Share updates, photos, and videos with your school community. Age-appropriate content for every grade level.",
    icon: "MessageCircle",
  },
  {
    title: "Digital Newspaper",
    description:
      "Write and publish articles with a full editorial workflow. Students become journalists in a safe environment.",
    icon: "Newspaper",
  },
  {
    title: "Video Platform",
    description:
      "Upload and share talent showcases, event recordings, and educational content on school channels.",
    icon: "Video",
  },
  {
    title: "Safe Messaging",
    description:
      "WhatsApp-style messaging with role & age restrictions. No unsupervised cross-school DMs for minors.",
    icon: "Shield",
  },
  {
    title: "Global Campus",
    description:
      "Inter-school forums, debates, and joint projects — all supervised by teacher moderators.",
    icon: "Globe",
  },
  {
    title: "AI Moderation",
    description:
      "Advanced AI-powered content screening ensures every post, image, and video meets safety standards.",
    icon: "Brain",
  },
]

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "School Signs Up",
    description:
      "Your school admin registers, configures branding, and sets up roles in minutes.",
  },
  {
    step: 2,
    title: "Invite Your Community",
    description:
      "Teachers, parents, and students join via secure invitations. Roster upload makes it effortless.",
  },
  {
    step: 3,
    title: "Connect & Learn",
    description:
      "Students post, collaborate, and learn in a safe, ad-free environment built for education.",
  },
]

export const TESTIMONIALS = [
  {
    quote:
      "Olive Buzz transformed how our school communicates. Parents are more engaged than ever, and students love sharing their projects safely.",
    author: "Dr. Sarah Mitchell",
    role: "Principal, Greenwood Academy",
    avatar: "SM",
  },
  {
    quote:
      "As a parent, I finally feel connected to my child's school life. The activity digests and instant notifications give me real peace of mind.",
    author: "Rajesh Kumar",
    role: "Parent, Delhi Public School",
    avatar: "RK",
  },
  {
    quote:
      "My students are writing better articles than ever. The digital newspaper feature turned my class into real journalists!",
    author: "Emily Chen",
    role: "English Teacher, St. Mary's",
    avatar: "EC",
  },
]

export const STATS = [
  { value: "500+", label: "Schools" },
  { value: "200K+", label: "Students" },
  { value: "50K+", label: "Articles Published" },
  { value: "99.9%", label: "Uptime" },
]

export const NEWSPAPER_FEATURED_STORY = {
  category: "Top Story",
  title: "Students turn campus reporting into a living digital newsroom",
  excerpt:
    "Olive Buzz gives schools a safe editorial space for student voices, family updates, academic wins, and community news.",
  author: "Editorial Desk",
  readTime: "5 min read",
}

export const NEWSPAPER_SECTIONS = [
  "Campus",
  "Academics",
  "Sports",
  "Arts",
  "Opinion",
  "Community",
]

export const NEWSPAPER_ARTICLES = [
  {
    category: "Campus",
    title: "Morning assembly highlights student innovation awards",
    summary:
      "A new weekly edition celebrates science, leadership, and acts of kindness across the school community.",
    meta: "By Student Press Club • 3 min read",
  },
  {
    category: "Academics",
    title: "Teachers publish revision tips ahead of exam season",
    summary:
      "Short, trusted learning guides make the digital newspaper useful for students and families alike.",
    meta: "By Faculty Board • 4 min read",
  },
  {
    category: "Sports",
    title: "Debate and athletics teams share this week’s wins",
    summary:
      "A balanced mix of sports, clubs, and co-curricular milestones keeps every learner represented.",
    meta: "By Activities Desk • 2 min read",
  },
  {
    category: "Opinion",
    title: "Why moderated student journalism builds confidence",
    summary:
      "Young writers learn responsibility, editorial review, and respectful storytelling in a safe environment.",
    meta: "By Editorial Mentor • 5 min read",
  },
]

export const NEWSPAPER_VALUES = [
  "Teacher-approved publishing",
  "Age-appropriate visibility",
  "Mobile-friendly reading experience",
  "Family and school communication in one place",
]
