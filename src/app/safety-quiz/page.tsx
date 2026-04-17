"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, ChevronRight, AlertTriangle, CheckCircle2, Phone } from "lucide-react"
import { APP_NAME } from "@/lib/constants"

const QUESTIONS = [
  {
    id: 1,
    question: "Someone online asks you for your home address. What do you do?",
    options: [
      { label: "Give it to them — they seem friendly", score: 0 },
      { label: "Ask a trusted adult before sharing anything", score: 3 },
      { label: "Share only my city name", score: 1 },
      { label: "Block and report them immediately", score: 3 },
    ],
    tip: "Never share your home address, school name, or any personal details with someone you don't know in real life. Always tell a trusted adult.",
  },
  {
    id: 2,
    question: "A classmate keeps saying mean things about you online and your friends can see it. How do you feel and what should you do?",
    options: [
      { label: "Say mean things back to them", score: 0 },
      { label: "Ignore it — it's just the internet", score: 1 },
      { label: "Screenshot it, block them, and tell a trusted adult", score: 3 },
      { label: "Delete my account so no one can see", score: 1 },
    ],
    tip: "Online bullying is real bullying. Always screenshot evidence, block the person, and tell a parent or teacher.",
  },
  {
    id: 3,
    question: "An adult you don't know offers you a prize if you meet them alone. What do you do?",
    options: [
      { label: "Meet them in a public place only", score: 1 },
      { label: "Go if they seem trustworthy online", score: 0 },
      { label: "Say no and immediately tell a parent or teacher", score: 3 },
      { label: "Ask a friend to come along", score: 1 },
    ],
    tip: "Never agree to meet someone you only know from the internet. Tell a trusted adult immediately — this is serious.",
  },
  {
    id: 4,
    question: "You see a news article that says something shocking. Your friends are sharing it everywhere. You should:",
    options: [
      { label: "Share it immediately so everyone knows", score: 0 },
      { label: "Check if a trusted news source also reports it first", score: 3 },
      { label: "Believe it because your friends shared it", score: 0 },
      { label: "Ignore it — it might be fake anyway", score: 1 },
    ],
    tip: "Before sharing news, check two reliable sources. If you can't verify it, don't share it. Misinformation spreads faster than truth.",
  },
  {
    id: 5,
    question: "A friend shows you a message that makes them feel unsafe. What's the best thing to do?",
    options: [
      { label: "Keep it secret — they said not to tell anyone", score: 0 },
      { label: "Ignore it — it's their problem", score: 0 },
      { label: "Help them tell a trusted adult right away", score: 3 },
      { label: "Screenshot it and post it to get attention", score: 0 },
    ],
    tip: "If a friend is in trouble, the bravest thing you can do is help them get help from an adult. Real friends keep each other safe.",
  },
]

const EMERGENCY_CONTACTS = [
  { name: "CHILDLINE India", number: "1098", desc: "24/7 helpline for children in need" },
  { name: "Cyber Crime Helpline", number: "1930", desc: "Report online crime or abuse" },
  { name: "National Emergency", number: "112", desc: "Police, fire, ambulance" },
]

type AnswerMap = Record<number, number>

function ScoreGate({ score, onRestart }: { score: number; onRestart: () => void }) {
  const total = QUESTIONS.length * 3
  const pct = Math.round((score / total) * 100)
  const level = pct >= 80 ? "safety-star" : pct >= 50 ? "learning" : "needs-help"

  return (
    <div className="text-center space-y-6">
      {/* Meter */}
      <div className="relative mx-auto h-48 w-48">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#e8e3d8" strokeWidth="16" />
          <circle
            cx="100" cy="100" r="80"
            fill="none"
            stroke={level === "safety-star" ? "#808b47" : level === "learning" ? "#f2b239" : "#e14851"}
            strokeWidth="16"
            strokeDasharray={`${(pct / 100) * 502} 502`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-stone-900">{pct}%</span>
          <span className="text-xs text-stone-500">Safety Score</span>
        </div>
      </div>

      {level === "safety-star" && (
        <div>
          <div className="text-5xl mb-2">🌟</div>
          <h2 className="text-2xl font-black text-[#808b47]">Safety Star!</h2>
          <p className="text-stone-600 mt-2">
            Excellent! You know how to stay safe online and offline. Keep being a role model for your friends!
          </p>
        </div>
      )}
      {level === "learning" && (
        <div>
          <div className="text-5xl mb-2">🛡️</div>
          <h2 className="text-2xl font-black text-[#c4891a]">Almost There!</h2>
          <p className="text-stone-600 mt-2">
            Good effort! Review the tips below and retake the quiz to strengthen your safety knowledge.
          </p>
        </div>
      )}
      {level === "needs-help" && (
        <div>
          <div className="text-5xl mb-2">⚠️</div>
          <h2 className="text-2xl font-black text-[#e14851]">Time to Learn More</h2>
          <p className="text-stone-600 mt-2">
            Don&apos;t worry — that&apos;s what this quiz is for! Review the tips and talk to a trusted adult about online safety.
          </p>
        </div>
      )}

      <button
        onClick={onRestart}
        className="rounded-2xl bg-[#808b47] px-6 py-3 text-sm font-bold text-white hover:bg-[#57714d]"
      >
        Retake Quiz
      </button>

      {/* Emergency Contacts */}
      <div className="mt-6 rounded-2xl border border-[#e14851]/30 bg-red-50 p-5 text-left">
        <div className="flex items-center gap-2 mb-3">
          <Phone className="h-4 w-4 text-[#e14851]" />
          <p className="font-black text-[#e14851] text-sm">If you feel unsafe, call now:</p>
        </div>
        <div className="space-y-2">
          {EMERGENCY_CONTACTS.map((c) => (
            <a
              key={c.name}
              href={`tel:${c.number}`}
              className="flex items-center justify-between rounded-xl bg-white border border-stone-200 px-4 py-2.5 hover:bg-stone-50"
            >
              <div>
                <p className="text-xs font-bold text-stone-900">{c.name}</p>
                <p className="text-xs text-stone-400">{c.desc}</p>
              </div>
              <span className="text-base font-black text-[#e14851]">{c.number}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SafetyQuizPage() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showTip, setShowTip] = useState(false)
  const [done, setDone] = useState(false)

  const q = QUESTIONS[currentQ]
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0)
  const progress = ((currentQ) / QUESTIONS.length) * 100

  function handleAnswer(optionIndex: number) {
    if (selectedOption !== null) return
    const score = q.options[optionIndex].score
    setSelectedOption(optionIndex)
    setAnswers((prev) => ({ ...prev, [q.id]: score }))
    setShowTip(true)
  }

  function handleNext() {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((prev) => prev + 1)
      setSelectedOption(null)
      setShowTip(false)
    } else {
      setDone(true)
    }
  }

  function handleRestart() {
    setCurrentQ(0)
    setAnswers({})
    setSelectedOption(null)
    setShowTip(false)
    setDone(false)
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-200 bg-white/90 px-6 py-4 backdrop-blur">
        <Link href="/" className="text-xl font-black text-[#808b47]">{APP_NAME}</Link>
        <Link href="/newspaper" className="text-sm font-medium text-stone-600 hover:text-stone-900">← Back to Newspaper</Link>
      </nav>

      <div className="mx-auto max-w-lg px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-[#808b47] mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-stone-900">Check Your Safety Meter</h1>
          <p className="mt-2 text-stone-600 text-sm">5 questions · Takes 3 minutes · No sign-in needed</p>
        </div>

        {!done ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
                <span>{Math.round(progress)}% done</span>
              </div>
              <div className="h-2 w-full rounded-full bg-stone-100">
                <div
                  className="h-2 rounded-full bg-[#808b47] transition-all"
                  style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="text-lg font-black text-stone-900 mb-5">{q.question}</h2>

            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isSelected = selectedOption === i
                const isCorrect = opt.score === 3
                const showResult = selectedOption !== null

                let cls = "border border-stone-200 bg-stone-50 hover:bg-stone-100"
                if (showResult && isSelected && isCorrect) cls = "border-[#808b47] bg-[#808b47]/10"
                else if (showResult && isSelected && !isCorrect) cls = "border-[#e14851] bg-red-50"
                else if (showResult && isCorrect) cls = "border-[#808b47]/40 bg-[#808b47]/5"

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={selectedOption !== null}
                    className={`w-full flex items-center gap-3 rounded-2xl p-4 text-left text-sm transition ${cls} disabled:cursor-default`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-stone-300 text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 text-stone-800">{opt.label}</span>
                    {showResult && isCorrect && <CheckCircle2 className="h-4 w-4 text-[#808b47] shrink-0" />}
                    {showResult && isSelected && !isCorrect && <AlertTriangle className="h-4 w-4 text-[#e14851] shrink-0" />}
                  </button>
                )
              })}
            </div>

            {showTip && (
              <div className="mt-5 rounded-2xl border border-[#808b47]/30 bg-[#808b47]/8 p-4">
                <p className="text-xs font-bold text-[#57714d] mb-1">💡 Safety Tip</p>
                <p className="text-sm text-stone-700 leading-relaxed">{q.tip}</p>
              </div>
            )}

            {selectedOption !== null && (
              <button
                onClick={handleNext}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#808b47] py-3.5 text-sm font-bold text-white hover:bg-[#57714d]"
              >
                {currentQ < QUESTIONS.length - 1 ? "Next Question" : "See My Score"}
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
            <ScoreGate score={totalScore} onRestart={handleRestart} />
          </div>
        )}

        <p className="mt-6 text-center text-xs text-stone-400">
          This quiz is for educational purposes only.{" "}
          <Link href="/contact" className="text-[#808b47] hover:underline">Contact us</Link> to use it in your school.
        </p>
      </div>
    </div>
  )
}
