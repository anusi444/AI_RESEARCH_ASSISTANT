"use client"

import React, { useEffect, useState } from "react"

const placeholders = [
  "Explain Newton's laws in simple words",
  "What causes climate change?",
  "Describe the water cycle",
]

export default function HomePage() {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const typeResponse = (text: string) => {
    setIsTyping(true)
    setResponse("") // reset displayed response
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setResponse((prev) => prev + text.charAt(i))
        i++
      } else {
        clearInterval(timer)
        setIsTyping(false)
      }
    }, 16) // ~60 chars/sec
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setResponse("")

    // Simulate a network call
    setTimeout(() => {
      const mockResponse = `Photosynthesis is the process by which plants, algae, and some bacteria convert light energy (usually from sunlight) into chemical energy stored in glucose molecules. This process occurs primarily in the chloroplasts of plant cells and involves two main stages:

1. Light-dependent reactions (occur in the thylakoids):
   - Chlorophyll absorbs light energy
   - Water molecules are split, releasing oxygen as a byproduct
   - Energy is captured in ATP and NADPH molecules

2. Light-independent reactions / Calvin cycle (occur in the stroma):
   - CO₂ is fixed into organic molecules
   - ATP and NADPH provide energy
   - Glucose is produced

Overall: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂`

      setLoading(false)
      typeResponse(mockResponse)
    }, 900)
  }

  return (
    <div className="min-h-screen p-4 pt-16 bg-background text-foreground">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-gradient-to-r from-white/20 to-white/10">
            <span className="text-sm font-medium">AI Research Assistant</span>
          </div>
          <h1 className="text-3xl font-bold">Ask me anything</h1>
          <p className="text-gray-600 dark:text-gray-400">Get instant answers to your academic questions</p>
        </div>

        {/* Search Form */}
        <div className="bg-white/80 dark:bg-gray-900/80 border rounded-2xl shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={`Ask something like: ${placeholders[currentPlaceholder]}`}
                className="w-full pr-24 py-4 text-lg rounded-2xl border focus:ring-2 focus:ring-opacity-30 transition"
                aria-label="Ask a question"
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white disabled:opacity-50"
              >
                {loading ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent inline-block rounded-full" /> : "Send"}
              </button>
            </div>
          </form>
        </div>

        {/* Response Card */}
        {(response || loading) && (
          <div className="bg-white/80 dark:bg-gray-900/80 border rounded-xl shadow p-6 animate-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white flex-shrink-0">
                AI
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">AI Assistant</h3>
                {loading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                    Thinking...
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {response}
                      {isTyping && <span className="animate-pulse">|</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
