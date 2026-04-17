"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, X } from "lucide-react"
import { useTransition } from "react"

export function SchoolSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const current = searchParams.get("q") ?? ""

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    if (val) {
      params.set("q", val)
    } else {
      params.delete("q")
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  function clearSearch() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("q")
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="flex items-center gap-2 border-b border-stone-100 px-4 py-3">
      <Search className="h-4 w-4 shrink-0 text-stone-400" />
      <input
        type="text"
        defaultValue={current}
        onChange={handleChange}
        placeholder="Search schools..."
        className="flex-1 text-sm text-stone-700 outline-none placeholder-stone-400"
      />
      {current && (
        <button
          onClick={clearSearch}
          className="text-stone-400 hover:text-stone-600"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
