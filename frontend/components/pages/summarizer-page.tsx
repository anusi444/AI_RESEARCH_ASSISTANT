"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Sparkles } from "lucide-react"

export function SummarizerPage() {
  const [content, setContent] = useState("")
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSummarize = async () => {
    if (!content.trim()) return

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const mockSummary = `**Key Points Summary:**

• **Main Topic**: The provided text discusses the fundamental concepts and applications of artificial intelligence in modern technology.

• **Core Concepts**: 
  - Machine learning algorithms and their implementation
  - Neural networks and deep learning architectures
  - Natural language processing capabilities

• **Applications**: 
  - Healthcare diagnostics and treatment recommendations
  - Financial analysis and fraud detection
  - Autonomous vehicle navigation systems

• **Future Implications**: The text suggests that AI will continue to revolutionize various industries while raising important ethical considerations about automation and human-AI collaboration.

• **Conclusion**: The integration of AI technologies requires careful balance between innovation and responsible implementation to maximize benefits while minimizing potential risks.`

      setSummary(mockSummary)
      setLoading(false)
    }, 2000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setContent(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="min-h-screen p-4 pt-16">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-light-aqua/20 to-medium-aqua/20 border border-light-aqua/30 dark:border-medium-aqua/30">
            <FileText className="w-4 h-4 text-light-aqua dark:text-medium-aqua" />
            <span className="text-sm font-medium text-light-aqua dark:text-medium-aqua">Text Summarizer</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Summarize Content
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Upload a file or paste text to get an AI-powered summary</p>
        </div>

        {/* Input Section */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-700/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Input Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-medium-aqua dark:hover:border-dark-teal transition-colors duration-300">
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Upload a file</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Supports TXT, PDF, DOC, DOCX files</p>
              </label>
            </div>

            <div className="text-center text-gray-500 dark:text-gray-400">or</div>

            {/* Text Input */}
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your text content here..."
              className="min-h-[200px] rounded-2xl border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 resize-none"
            />

            <Button
              onClick={handleSummarize}
              disabled={loading || !content.trim()}
              className="w-full rounded-xl bg-gradient-to-r from-light-aqua to-dark-teal hover:from-light-aqua/90 hover:to-dark-teal/90 text-white font-medium py-3 transition-all duration-300 transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Summarizing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate Summary
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Summary Output */}
        {summary && (
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-700/30 shadow-xl animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-medium-aqua dark:text-dark-teal" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">{summary}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
