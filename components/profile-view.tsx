"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Trophy,
  Target,
  Calendar,
  Coins,
  Flame,
  Star,
  Award,
  TrendingUp,
  CheckCircle2,
  Clock,
} from "lucide-react"

interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  category: string
  dueDate?: string
  createdAt: string
}

interface UserStats {
  coins: number
  tasksCompleted: number
  streak: number
  level: number
  xp: number
  xpToNext: number
  joinDate: string
  totalTasks: number
  averageCompletionTime: number
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  unlocked: boolean
  unlockedAt?: string
  progress?: number
  maxProgress?: number
}

interface ProfileViewProps {
  tasks: Task[]
}

export function ProfileView({ tasks }: ProfileViewProps) {
  const [userStats, setUserStats] = useState<UserStats>({
    coins: 150,
    tasksCompleted: 47,
    streak: 7,
    level: 3,
    xp: 280,
    xpToNext: 320,
    joinDate: "2024-01-15",
    totalTasks: 52,
    averageCompletionTime: 2.5,
  })

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first-task",
      name: "Getting Started",
      description: "Complete your first task",
      icon: CheckCircle2,
      unlocked: true,
      unlockedAt: "2024-01-15",
    },
    {
      id: "streak-7",
      name: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: Flame,
      unlocked: true,
      unlockedAt: "2024-01-22",
    },
    {
      id: "tasks-50",
      name: "Half Century",
      description: "Complete 50 tasks",
      icon: Trophy,
      unlocked: false,
      progress: 47,
      maxProgress: 50,
    },
    {
      id: "level-5",
      name: "Level Up",
      description: "Reach level 5",
      icon: Star,
      unlocked: false,
      progress: 3,
      maxProgress: 5,
    },
    {
      id: "coins-500",
      name: "Coin Collector",
      description: "Earn 500 coins",
      icon: Coins,
      unlocked: false,
      progress: 150,
      maxProgress: 500,
    },
    {
      id: "streak-30",
      name: "Consistency King",
      description: "Maintain a 30-day streak",
      icon: Target,
      unlocked: false,
      progress: 7,
      maxProgress: 30,
    },
  ])

  // Calculate stats from tasks
  useEffect(() => {
    const completedTasks = tasks.filter((task) => task.completed)
    const totalTasks = tasks.length

    // Calculate category breakdown
    const categoryStats = tasks.reduce(
      (acc, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Update user stats based on actual task data
    setUserStats((prev) => ({
      ...prev,
      tasksCompleted: completedTasks.length,
      totalTasks: totalTasks,
    }))
  }, [tasks])

  const xpProgress = (userStats.xp / userStats.xpToNext) * 100
  const completionRate = userStats.totalTasks > 0 ? (userStats.tasksCompleted / userStats.totalTasks) * 100 : 0

  const categoryStats = tasks.reduce(
    (acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const getDaysActive = () => {
    const joinDate = new Date(userStats.joinDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - joinDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold">Profile</h1>
              <p className="text-xs text-muted-foreground font-sans">Your productivity journey</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-accent" />
            <span className="text-sm font-sans font-medium">{userStats.streak}</span>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/diverse-user-avatars.png" />
            <AvatarFallback className="bg-primary text-primary-foreground font-serif text-xl">TF</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-serif font-bold">TaskFlow User</h2>
            <p className="text-sm text-muted-foreground font-sans">Member since {formatDate(userStats.joinDate)}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-accent" />
                <span className="text-sm font-sans font-medium">Level {userStats.level}</span>
              </div>
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-accent" />
                <span className="text-sm font-sans font-medium">{userStats.coins}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Level Progress */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-serif flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Level Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-sans text-muted-foreground">Level {userStats.level}</span>
                <span className="text-sm font-sans font-medium">
                  {userStats.xp} / {userStats.xpToNext} XP
                </span>
              </div>
              <Progress value={xpProgress} className="h-3" />
              <p className="text-xs font-sans text-muted-foreground">
                {userStats.xpToNext - userStats.xp} XP until next level
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold font-sans">{userStats.tasksCompleted}</span>
              </div>
              <p className="text-sm font-sans text-muted-foreground">Tasks Completed</p>
              <p className="text-xs font-sans text-muted-foreground mt-1">
                {Math.round(completionRate)}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-accent" />
                <span className="text-2xl font-bold font-sans">{userStats.streak}</span>
              </div>
              <p className="text-sm font-sans text-muted-foreground">Day Streak</p>
              <p className="text-xs font-sans text-muted-foreground mt-1">Keep it up!</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-5 h-5 text-secondary" />
                <span className="text-2xl font-bold font-sans">{getDaysActive()}</span>
              </div>
              <p className="text-sm font-sans text-muted-foreground">Days Active</p>
              <p className="text-xs font-sans text-muted-foreground mt-1">Since joining</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="text-2xl font-bold font-sans">{userStats.averageCompletionTime}</span>
              </div>
              <p className="text-sm font-sans text-muted-foreground">Avg. Days</p>
              <p className="text-xs font-sans text-muted-foreground mt-1">To complete tasks</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Categories */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-serif">Top Categories</CardTitle>
            <CardDescription className="font-sans">Your most active task categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCategories.map(([category, count], index) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        index === 0 ? "bg-primary/20" : index === 1 ? "bg-secondary/20" : "bg-accent/20"
                      }`}
                    >
                      <span className="text-sm font-sans font-bold">#{index + 1}</span>
                    </div>
                    <span className="font-sans font-medium">{category}</span>
                  </div>
                  <Badge variant="outline" className="font-sans">
                    {count} tasks
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-serif flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Achievements
            </CardTitle>
            <CardDescription className="font-sans">
              {achievements.filter((a) => a.unlocked).length} of {achievements.length} unlocked
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {achievements.map((achievement) => {
                const Icon = achievement.icon
                const progress =
                  achievement.progress && achievement.maxProgress
                    ? (achievement.progress / achievement.maxProgress) * 100
                    : 0

                return (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      achievement.unlocked ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border/50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        achievement.unlocked ? "bg-primary/20" : "bg-muted"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${achievement.unlocked ? "text-primary" : "text-muted-foreground"}`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`font-sans font-medium ${
                            achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {achievement.name}
                        </h4>
                        {achievement.unlocked && (
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-sans">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-sans mt-1">{achievement.description}</p>
                      {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-sans text-muted-foreground">
                              {achievement.progress} / {achievement.maxProgress}
                            </span>
                            <span className="text-xs font-sans text-muted-foreground">{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>
                      )}
                      {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-xs text-muted-foreground font-sans mt-1">
                          Unlocked on {formatDate(achievement.unlockedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
