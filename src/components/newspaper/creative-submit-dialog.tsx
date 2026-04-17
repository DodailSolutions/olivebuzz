"use client"

import { useRef, useState } from "react"
import { Upload, CheckCircle, ImageIcon, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const CATEGORIES = [
  "Creative Writing",
  "Art / Illustration",
  "Photography",
  "Poetry",
  "Comic Strip",
  "Science Project",
  "Other",
]

type Step = "form" | "success"

export function CreativeSubmitDialog() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>("form")
  const [submitting, setSubmitting] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: "",
    school: "",
    grade: "",
    category: "",
    title: "",
    description: "",
  })

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  function clearFile() {
    setPreview(null)
    setFileName(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    // Simulate async submission (replace with real API call)
    await new Promise((res) => setTimeout(res, 1200))
    setSubmitting(false)
    setStep("success")
  }

  function handleOpenChange(val: boolean) {
    setOpen(val)
    if (!val) {
      // Reset after close animation
      setTimeout(() => {
        setStep("form")
        setForm({ name: "", school: "", grade: "", category: "", title: "", description: "" })
        clearFile()
      }, 300)
    }
  }

  const isValid =
    form.name.trim() &&
    form.school.trim() &&
    form.category &&
    form.title.trim()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-bold text-stone-900 hover:bg-stone-100 transition-colors"
      >
        <Upload className="h-4 w-4" />
        Submit Now
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-black">
                Upload Your Creative Best
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Get featured on the Olive Buzz Wall of Fame
              </p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              {/* Personal details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="grade">Grade / Class</Label>
                  <Input
                    id="grade"
                    name="grade"
                    value={form.grade}
                    onChange={handleChange}
                    placeholder="e.g. Grade 8"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="school">School Name *</Label>
                <Input
                  id="school"
                  name="school"
                  value={form.school}
                  onChange={handleChange}
                  placeholder="Your school"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select a category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title">Title of your work *</Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Give your work a title"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description">Brief description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tell us about your work (optional)"
                  rows={3}
                />
              </div>

              {/* File upload */}
              <div className="space-y-1.5">
                <Label>Upload file (image, PDF, or document)</Label>
                {preview ? (
                  <div className="relative overflow-hidden rounded-lg border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-40 w-full object-cover"
                      onError={() => setPreview(null)}
                    />
                    <button
                      type="button"
                      onClick={clearFile}
                      className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <p className="truncate px-3 py-1 text-xs text-muted-foreground">{fileName}</p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border py-6 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                  >
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-sm font-medium">Click to choose file</span>
                    <span className="text-xs opacity-70">JPG, PNG, PDF up to 10 MB</span>
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFile}
                  className="hidden"
                />
              </div>

              <Button
                type="submit"
                disabled={!isValid || submitting}
                className="w-full"
              >
                {submitting ? "Submitting…" : "Submit for review"}
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <div>
              <p className="text-xl font-black">Thank you, {form.name}!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your submission &ldquo;{form.title}&rdquo; has been received. Our team will review
                it and reach out if it&rsquo;s selected for the Wall of Fame.
              </p>
            </div>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog></>
  )
}
