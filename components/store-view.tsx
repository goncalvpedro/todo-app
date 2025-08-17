"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingBag,
  Coins,
  Zap,
  Palette,
  Trophy,
  Star,
  Crown,
  Sparkles,
  Target,
  Calendar,
  CheckCircle2,
  Lock,
  Gift,
} from "lucide-react"

interface StoreItem {
  id: string
  name: string
  description: string
  price: number
  category: "powerups" | "themes" | "features" | "bundles"
  icon: React.ComponentType<{ className?: string }>
  popular?: boolean
  discount?: number
  owned?: boolean
}

interface UserStats {
  coins: number
  tasksCompleted: number
  streak: number
  level: number
  xp: number
  xpToNext: number
}

interface StoreViewProps {
  onPurchase: (itemId: string) => void
}

export function StoreView({ onPurchase }: StoreViewProps) {
  const [userStats, setUserStats] = useState<UserStats>({
    coins: 150,
    tasksCompleted: 47,
    streak: 7,
    level: 3,
    xp: 280,
    xpToNext: 320,
  })

  const [ownedItems, setOwnedItems] = useState<string[]>([])

  // Load user stats and owned items from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem("taskflow-user-stats")
    const savedOwnedItems = localStorage.getItem("taskflow-owned-items")

    if (savedStats) {
      setUserStats(JSON.parse(savedStats))
    }
    if (savedOwnedItems) {
      setOwnedItems(JSON.parse(savedOwnedItems))
    }
  }, [])

  // Save to localStorage when stats change
  useEffect(() => {
    localStorage.setItem("taskflow-user-stats", JSON.stringify(userStats))
  }, [userStats])

  useEffect(() => {
    localStorage.setItem("taskflow-owned-items", JSON.stringify(ownedItems))
  }, [ownedItems])

  const storeItems: StoreItem[] = [
    // Power-ups
    {
      id: "task-boost",
      name: "Task Boost",
      description: "Double XP for the next 10 completed tasks",
      price: 50,
      category: "powerups",
      icon: Zap,
      popular: true,
    },
    {
      id: "streak-freeze",
      name: "Streak Freeze",
      description: "Protect your streak for 3 days if you miss a day",
      price: 75,
      category: "powerups",
      icon: Target,
    },
    {
      id: "priority-boost",
      name: "Priority Boost",
      description: "Highlight high-priority tasks with special effects",
      price: 30,
      category: "powerups",
      icon: Star,
    },

    // Themes
    {
      id: "ocean-theme",
      name: "Ocean Breeze",
      description: "Calming blue and teal color scheme",
      price: 100,
      category: "themes",
      icon: Palette,
    },
    {
      id: "sunset-theme",
      name: "Sunset Glow",
      description: "Warm orange and pink gradient theme",
      price: 100,
      category: "themes",
      icon: Palette,
      discount: 20,
    },
    {
      id: "forest-theme",
      name: "Forest Green",
      description: "Natural green and brown earth tones",
      price: 100,
      category: "themes",
      icon: Palette,
    },

    // Features
    {
      id: "unlimited-tasks",
      name: "Unlimited Tasks",
      description: "Remove the 50 task limit and create as many as you need",
      price: 200,
      category: "features",
      icon: CheckCircle2,
      popular: true,
    },
    {
      id: "advanced-calendar",
      name: "Advanced Calendar",
      description: "Week view, recurring tasks, and calendar integrations",
      price: 150,
      category: "features",
      icon: Calendar,
    },
    {
      id: "task-templates",
      name: "Task Templates",
      description: "Pre-made task templates for common workflows",
      price: 80,
      category: "features",
      icon: Gift,
    },

    // Bundles
    {
      id: "productivity-bundle",
      name: "Productivity Pro",
      description: "Unlimited tasks + Advanced calendar + 3 themes",
      price: 350,
      category: "bundles",
      icon: Crown,
      discount: 30,
      popular: true,
    },
    {
      id: "theme-bundle",
      name: "Theme Collection",
      description: "All 6 premium themes at a special price",
      price: 450,
      category: "bundles",
      icon: Sparkles,
      discount: 25,
    },
  ]

  const handlePurchase = (item: StoreItem) => {
    const finalPrice = item.discount ? Math.round(item.price * (1 - item.discount / 100)) : item.price

    if (userStats.coins >= finalPrice && !ownedItems.includes(item.id)) {
      setUserStats((prev) => ({
        ...prev,
        coins: prev.coins - finalPrice,
      }))
      setOwnedItems((prev) => [...prev, item.id])
      onPurchase(item.id)
    }
  }

  const getItemsByCategory = (category: string) => {
    return storeItems.filter((item) => item.category === category)
  }

  const xpProgress = (userStats.xp / userStats.xpToNext) * 100

  const StoreItemCard = ({ item }: { item: StoreItem }) => {
    const isOwned = ownedItems.includes(item.id)
    const finalPrice = item.discount ? Math.round(item.price * (1 - item.discount / 100)) : item.price
    const canAfford = userStats.coins >= finalPrice
    const Icon = item.icon

    return (
      <Card
        className={`relative transition-all duration-200 hover:shadow-lg ${
          item.popular ? "border-primary/50 bg-primary/5" : "border-border/50"
        } ${isOwned ? "bg-muted/30" : ""}`}
      >
        {item.popular && (
          <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground font-sans text-xs">Popular</Badge>
        )}
        {item.discount && !isOwned && (
          <Badge className="absolute -top-2 -left-2 bg-destructive text-destructive-foreground font-sans text-xs">
            -{item.discount}%
          </Badge>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isOwned ? "bg-primary/20" : "bg-secondary/20"
              }`}
            >
              {isOwned ? (
                <CheckCircle2 className="w-6 h-6 text-primary" />
              ) : (
                <Icon className="w-6 h-6 text-secondary" />
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-base font-serif">{item.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {isOwned ? (
                  <Badge variant="outline" className="text-xs font-sans">
                    Owned
                  </Badge>
                ) : (
                  <>
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-accent" />
                      <span className="font-sans font-medium">
                        {item.discount && (
                          <span className="line-through text-muted-foreground text-sm mr-1">{item.price}</span>
                        )}
                        {finalPrice}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <CardDescription className="font-sans text-sm mb-4">{item.description}</CardDescription>

          <Button
            onClick={() => handlePurchase(item)}
            disabled={isOwned || !canAfford}
            className={`w-full font-sans ${
              isOwned
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : canAfford
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {isOwned ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Owned
              </>
            ) : !canAfford ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Not enough coins
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Purchase
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with User Stats */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold">TaskFlow Store</h1>
              <p className="text-xs text-muted-foreground font-sans">Boost your productivity!</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Coins className="w-5 h-5 text-accent" />
              <span className="font-sans font-bold text-lg">{userStats.coins}</span>
            </div>
          </div>
        </div>

        {/* User Progress */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-sans text-muted-foreground">Level {userStats.level}</span>
                <Trophy className="w-4 h-4 text-accent" />
              </div>
              <Progress value={xpProgress} className="h-2" />
              <p className="text-xs font-sans text-muted-foreground mt-1">
                {userStats.xp} / {userStats.xpToNext} XP
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-sans text-muted-foreground">Streak</span>
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-sans">{userStats.streak}</span>
                <span className="text-sm font-sans text-muted-foreground">days</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earn More Coins */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-semibold text-sm">Earn More Coins</h3>
                <p className="text-xs font-sans text-muted-foreground">Complete tasks to earn coins!</p>
              </div>
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-accent" />
                <span className="font-sans font-bold">+10</span>
                <span className="text-xs font-sans text-muted-foreground">per task</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Store Content */}
      <div className="p-4">
        <Tabs defaultValue="powerups" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="powerups" className="font-sans text-xs">
              Power-ups
            </TabsTrigger>
            <TabsTrigger value="themes" className="font-sans text-xs">
              Themes
            </TabsTrigger>
            <TabsTrigger value="features" className="font-sans text-xs">
              Features
            </TabsTrigger>
            <TabsTrigger value="bundles" className="font-sans text-xs">
              Bundles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="powerups" className="space-y-4">
            <div className="grid gap-4">
              {getItemsByCategory("powerups").map((item) => (
                <StoreItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="themes" className="space-y-4">
            <div className="grid gap-4">
              {getItemsByCategory("themes").map((item) => (
                <StoreItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <div className="grid gap-4">
              {getItemsByCategory("features").map((item) => (
                <StoreItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bundles" className="space-y-4">
            <div className="grid gap-4">
              {getItemsByCategory("bundles").map((item) => (
                <StoreItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
