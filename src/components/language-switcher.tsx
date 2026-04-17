"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Globe, Loader2, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const VALID_LOCALES = ["en", "hi", "te", "ml", "ta"] as const

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
] as const

interface LanguageSwitcherProps {
  variant?: "icon" | "full"
  className?: string
}

export function LanguageSwitcher({ variant = "full", className }: LanguageSwitcherProps) {
  const locale = useLocale()
  const t = useTranslations("language")
  const [pending, setPending] = useState<string | null>(null)

  function handleLocaleChange(code: string) {
    if (code === locale || pending) return
    if (!(VALID_LOCALES as readonly string[]).includes(code)) return
    setPending(code)
    const returnTo = encodeURIComponent(window.location.pathname + window.location.search)
    window.location.href = `/api/set-locale?locale=${code}&returnTo=${returnTo}`
  }

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0]
  const isLoading = pending !== null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground focus-visible:outline-none",
          isLoading && "opacity-60 pointer-events-none",
          className,
        )}
        aria-label={t("select")}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
        ) : (
          <Globe className="h-4 w-4 shrink-0" />
        )}
        {variant === "full" && (
          <span lang={current.code}>{current.native}</span>
        )}
        {variant === "icon" && (
          <span className="text-xs font-bold uppercase tracking-wide">
            {pending ?? locale}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[160px]">
        {LANGUAGES.map((lang) => {
          const isActive = locale === lang.code
          const isThisPending = pending === lang.code
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLocaleChange(lang.code)}
              className={cn(
                "flex items-center justify-between gap-3 cursor-pointer",
                isActive && "text-primary font-semibold bg-primary/5",
                isThisPending && "opacity-60",
              )}
              disabled={isLoading}
            >
              <div className="flex flex-col">
                <span lang={lang.code}>{lang.native}</span>
                <span className="text-[10px] text-muted-foreground">{lang.label}</span>
              </div>
              {isThisPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              ) : isActive ? (
                <Check className="h-3.5 w-3.5 text-primary" />
              ) : null}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

