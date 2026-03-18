"use client"

import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { TabNavigation } from "@/components/tab-navigation"
import HomePage from "@/components/pages/home-page"                    // <- default import
import { SummarizerPage } from "@/components/pages/summarizer-page"
import { NotesPage } from "@/components/pages/notes-page"
import { CitationsPage } from "@/components/pages/citations-page"
import { ProfilePage } from "@/components/pages/profile-page"
import { LoginPage } from "@/components/pages/login-page"
import { useAuth } from "@/components/auth-provider"

function AppContent() {
  const [activeTab, setActiveTab] = useState("home")
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage />
      case "summarizer":
        return <SummarizerPage />
      case "notes":
        return <NotesPage />
      case "citations":
        return <CitationsPage />
      case "profile":
        return <ProfilePage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-mint via-light-aqua to-medium-aqua dark:from-gray-900 dark:via-gray-800 dark:to-dark-teal transition-colors duration-500">
      <div className="pb-20">{renderPage()}</div>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}
