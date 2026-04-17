"use client"

import { useLocale, useTranslations } from "next-intl"
import { Globe, Check } from "lucide-react"
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
  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0]

  function handleLocaleChange(code: string) {
    if (code === locale) return
    document.cookie = `OLIVE_LOCALE=${code}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    window.location.reload()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground focus-visible:outline-none",
          className,
        )}
        aria-label={t("select")}
      >
        <Globe className="h-4 w-4 shrink-0" />
        {variant === "full" && (
          <span lang={current.code}>{current.native}</span>
        )}
        {variant === "icon" && (
          <span className="text-xs font-bold uppercase tracking-wide">
            {locale.toUpperCase()}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[160px]">
        {LANGUAGES.map((lang) => {
          const isActive = locale === lang.code
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLocaleChange(lang.code)}
              className={cn(
                "flex items-center justify-between gap-3 cursor-pointer",
                isActive && "text-primary font-semibold bg-primary/5",
              )}
            >
              <div className="flex flex-col">
                <span lang={lang.code}>{lang.native}</span>
                <span className="text-[10px] text-muted-foreground">{lang.label}</span>
              </div>
              {isActive && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
