"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Copy, Check } from "lucide-react"

export function CitationsPage() {
  const [citationStyle, setCitationStyle] = useState("apa")
  const [sourceType, setSourceType] = useState("book")
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: "",
    publisher: "",
    url: "",
    journal: "",
    volume: "",
    issue: "",
    pages: "",
  })
  const [citation, setCitation] = useState("")
  const [copied, setCopied] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateCitation = () => {
    const { title, author, year, publisher, url, journal, volume, issue, pages } = formData

    if (!title || !author) return

    let generatedCitation = ""

    if (citationStyle === "apa") {
      if (sourceType === "book") {
        generatedCitation = `${author} (${year}). *${title}*. ${publisher}.`
      } else if (sourceType === "journal") {
        generatedCitation = `${author} (${year}). ${title}. *${journal}*, *${volume}*(${issue}), ${pages}.`
      } else if (sourceType === "website") {
        generatedCitation = `${author} (${year}). *${title}*. Retrieved from ${url}`
      }
    } else if (citationStyle === "mla") {
      if (sourceType === "book") {
        generatedCitation = `${author}. *${title}*. ${publisher}, ${year}.`
      } else if (sourceType === "journal") {
        generatedCitation = `${author}. "${title}." *${journal}*, vol. ${volume}, no. ${issue}, ${year}, pp. ${pages}.`
      } else if (sourceType === "website") {
        generatedCitation = `${author}. "*${title}*." Web. ${year}. <${url}>.`
      }
    }

    setCitation(generatedCitation)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(citation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderFormFields = () => {
    const commonFields = (
      <>
        <Input
          placeholder="Title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50"
        />
        <Input
          placeholder="Author(s)"
          value={formData.author}
          onChange={(e) => handleInputChange("author", e.target.value)}
          className="rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50"
        />
        <Input
          placeholder="Year"
          value={formData.year}
          onChange={(e) => handleInputChange("year", e.target.value)}
          className="rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50"
        />
      </>
    )

    if (sourceType === "book") {
      return (
        <>
          {commonFields}
          <Input
            placeholder="Publisher"
            value={formData.publisher}
            onChange={(e) => handleInputChange("publisher", e.target.value)}
            className="rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50"
          />
        </>
      )
    } else if (sourceType === "journal") {
      return (
        <>
          {commonFields}
          <Input
            placeholder="Journal Name"
            value={formData.journal}
            onChange={(e) => handleInputChange("journal", e.target.value)}
            className="rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50"
          />
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="Volume"
              value={formData.volume}
              onChange={(e) => handleInputChange("volume", e.target.value)}
              className="rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50"
            />
            <Input
              placeholder="Issue"
              value={formData.issue}
              onChange={(e) => handleInputChange("issue", e.target.value)}
              className="rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50"
            />
            <Input
              placeholder="Pages"
              value={formData.pages}
              onChange={(e) => handleInputChange("pages", e.target.value)}
              className="rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50"
            />
          </div>
        </>
      )
    } else if (sourceType === "website") {
      return (
        <>
          {commonFields}
          <Input
            placeholder="URL"
            value={formData.url}
            onChange={(e) => handleInputChange("url", e.target.value)}
            className="rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50"
          />
        </>
      )
    }
  }

  return (
    <div className="min-h-screen p-4 pt-16">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-medium-aqua/20 to-dark-teal/20 border border-medium-aqua/30 dark:border-dark-teal/30">
            <BookOpen className="w-4 h-4 text-medium-aqua dark:text-dark-teal" />
            <span className="text-sm font-medium text-medium-aqua dark:text-dark-teal">Citation Generator</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Generate Citations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Create properly formatted APA and MLA citations</p>
        </div>

        {/* Citation Form */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-700/30 shadow-xl">
          <CardHeader>
            <CardTitle>Citation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Style and Type Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Citation Style</label>
                <Select value={citationStyle} onValueChange={setCitationStyle}>
                  <SelectTrigger className="rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apa">APA Style</SelectItem>
                    <SelectItem value="mla">MLA Style</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Source Type</label>
                <Select value={sourceType} onValueChange={setSourceType}>
                  <SelectTrigger className="rounded-xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="journal">Journal Article</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">{renderFormFields()}</div>

            <Button
              onClick={generateCitation}
              disabled={!formData.title || !formData.author}
              className="w-full rounded-xl bg-gradient-to-r from-light-aqua to-dark-teal hover:from-light-aqua/90 hover:to-dark-teal/90 text-white font-medium py-3 transition-all duration-300 transform hover:scale-105"
            >
              Generate Citation
            </Button>
          </CardContent>
        </Card>

        {/* Generated Citation */}
        {citation && (
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-700/30 shadow-xl animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Generated Citation</CardTitle>
              <Button onClick={copyToClipboard} variant="outline" size="sm" className="rounded-xl bg-transparent">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{citation}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
