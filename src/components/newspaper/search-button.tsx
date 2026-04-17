"use client"

import { useState, useEffect, useRef, useTransition } from "react"
import { Search, X, Loader2, FileText, ExternalLink } from "lucide-react"

interface SearchResult {
  id: string
  title: string
  excerpt: string
  category: string
  slug: string
}

interface SearchOverlayProps {
  className?: string
  iconClassName?: string
}

export function SearchButton({ className, iconClassName }: SearchOverlayProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when overlay opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery("")
      setResults([])
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  // Debounced search against published posts
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    const timer = setTimeout(() => {
      startTransition(async () => {
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(query.trim())}`
          )
          if (res.ok) {
            const data = await res.json()
            setResults(data.results ?? [])
          }
        } catch {
          // silently fail
        }
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <>
      <button
        aria-label="Search"
        onClick={() => setOpen(true)}
        className={className}
      >
        <Search className={iconClassName} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center bg-black/50 backdrop-blur-sm pt-[10vh] px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl">
            {/* Input */}
            <div className="flex items-center gap-3 border-b border-stone-100 px-4 py-3.5">
              {isPending ? (
                <Loader2 className="h-5 w-5 shrink-0 animate-spin text-stone-400" />
              ) : (
                <Search className="h-5 w-5 shrink-0 text-stone-400" />
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, topics, categories…"
                className="flex-1 text-base text-stone-900 outline-none placeholder-stone-400"
              />
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim().length < 2 ? (
                <div className="px-4 py-8 text-center">
                  <Search className="mx-auto mb-3 h-8 w-8 text-stone-200" />
                  <p className="text-sm text-stone-400">Type at least 2 characters to search</p>
                </div>
              ) : results.length === 0 && !isPending ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm font-semibold text-stone-500">No results for &ldquo;{query}&rdquo;</p>
                  <p className="mt-1 text-xs text-stone-400">Try different keywords or browse sections below</p>
                </div>
              ) : (
                <ul className="divide-y divide-stone-100">
                  {results.map((r) => (
                    <li key={r.id}>
                      <a
                        href={`/newspaper/article/${r.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-start gap-3 px-4 py-3.5 hover:bg-stone-50"
                      >
                        <FileText className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#808b47]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-stone-900 truncate">{r.title}</p>
                          <p className="mt-0.5 text-xs text-stone-500 line-clamp-2">{r.excerpt}</p>
                        </div>
                        <span className="shrink-0 rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
                          {r.category}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-stone-100 px-4 py-2.5">
              <p className="text-xs text-stone-400">Press <kbd className="rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd> to close</p>
              <a
                href="/newspaper"
                className="flex items-center gap-1 text-xs text-[#808b47] hover:underline"
                onClick={() => setOpen(false)}
              >
                Browse all <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
