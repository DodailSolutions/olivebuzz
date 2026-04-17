"use client"

import { useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Globe } from "lucide-react"
import { setLocale } from "@/app/actions/locale"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const LANGUAGES = [
  { code: "en", label: "English", script: "en" },
  { code: "hi", label: "हिंदी", script: "hi" },
  { code: "te", label: "తెలుగు", script: "te" },
  { code: "ml", label: "മലയാളം", script: "ml" },
  { code: "ta", label: "தமிழ்", script: "ta" },
] as const

interface LanguageSwitcherProps {
  variant?: "icon" | "full"
  className?: string
}

export function LanguageSwitcher({ variant = "full", className }: LanguageSwitcherProps) {
  const locale = useLocale()
  const t = useTranslations("language")
  const [isPending, startTransition] = useTransition()

  function handleLocaleChange(code: string) {
    startTransition(async () => {
      await setLocale(code)
      window.location.reload()
    })
  }

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground focus-visible:outline-none",
          isPending && "opacity-60 pointer-events-none",
          className,
        )}
        aria-label={t("select")}
      >
        <Globe className="h-4 w-4 shrink-0" />
        {variant === "full" && (
          <span lang={current.script}>{current.label}</span>
        )}
        {variant === "icon" && (
          <span className="text-xs font-bold uppercase tracking-wide">{locale}</span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[140px]">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onSelect={() => handleLocaleChange(lang.code)}
            className={cn(
              "flex items-center justify-between gap-3 cursor-pointer",
              locale === lang.code && "text-primary font-semibold bg-primary/5",
            )}
            lang={lang.script}
          >
            <span>{lang.label}</span>
            {locale === lang.code && (
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
