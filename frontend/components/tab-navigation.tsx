"use client"

import { Search, FileText, Edit3, BookOpen, User } from "lucide-react"

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "home", icon: Search, label: "Home" },
  { id: "summarizer", icon: FileText, label: "Summarizer" },
  { id: "notes", icon: Edit3, label: "Notes" },
  { id: "citations", icon: BookOpen, label: "Citations" },
  { id: "profile", icon: User, label: "Profile" },
]

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-4 mb-4">
        <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-lg">
          <div className="flex items-center justify-around py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-medium-aqua/20 text-medium-aqua dark:text-dark-teal scale-105"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <Icon size={20} className={`transition-transform duration-300 ${isActive ? "scale-110" : ""}`} />
                  <span
                    className={`text-xs mt-1 font-medium transition-all duration-300 ${
                      isActive ? "opacity-100" : "opacity-70"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
