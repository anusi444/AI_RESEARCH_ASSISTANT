"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { useTheme } from "@/components/theme-provider"
import { User, Moon, Sun, LogOut, History, Settings } from "lucide-react"

export function ProfilePage() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [recentActivity] = useState([
    { id: 1, type: "question", content: "What is photosynthesis?", timestamp: "2 hours ago" },
    { id: 2, type: "summary", content: "AI Research Paper Summary", timestamp: "1 day ago" },
    { id: 3, type: "note", content: "Biology Study Notes", timestamp: "2 days ago" },
    { id: 4, type: "citation", content: "APA Citation Generated", timestamp: "3 days ago" },
  ])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "question":
        return "🔍"
      case "summary":
        return "📄"
      case "note":
        return "📝"
      case "citation":
        return "📚"
      default:
        return "📋"
    }
  }

  return (
    <div className="min-h-screen p-4 pt-16">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-light-mint/20 to-medium-aqua/20 border border-light-mint/30 dark:border-medium-aqua/30">
            <User className="w-4 h-4 text-light-mint dark:text-medium-aqua" />
            <span className="text-sm font-medium text-light-mint dark:text-medium-aqua">Profile</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            My Profile
          </h1>
        </div>

        {/* Profile Card */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-700/30 shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-white/50 dark:border-gray-700/50 shadow-lg">
                <AvatarImage src="/placeholder-user.jpg" alt={user?.name} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-medium-aqua to-dark-teal text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-medium-aqua/20 dark:bg-medium-aqua/30 text-medium-aqua dark:text-dark-teal rounded-full text-sm font-medium">
                    Student
                  </span>
                  <span className="px-3 py-1 bg-dark-teal/20 dark:bg-dark-teal/30 text-dark-teal dark:text-medium-aqua rounded-full text-sm font-medium">
                    Active User
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-700/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {theme === "dark" ? "Dark mode" : "Light mode"}
                  </p>
                </div>
              </div>
              <Button onClick={toggleTheme} variant="outline" size="sm" className="rounded-xl bg-transparent">
                Switch to {theme === "dark" ? "Light" : "Dark"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-700/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors duration-200"
                >
                  <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{activity.content}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-700/30 shadow-xl">
          <CardContent className="p-6">
            <Button
              onClick={logout}
              variant="outline"
              className="w-full rounded-xl border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
