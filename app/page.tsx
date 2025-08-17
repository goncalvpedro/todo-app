"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Sparkles, Target, Trophy } from "lucide-react"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleAuth = async (type: "signin" | "signup") => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    // For now, redirect to main app (we'll implement proper auth later)
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-serif text-foreground">TaskFlow</h1>
            <p className="text-muted-foreground font-sans">Make every day productive and fun!</p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto">
              <Target className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-xs text-muted-foreground font-sans">Daily Goals</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground font-sans">Rewards</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-sans">Achievements</p>
          </div>
        </div>

        {/* Auth Form */}
        <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-serif text-center">Welcome!</CardTitle>
            <CardDescription className="text-center font-sans">Sign in to continue your journey</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="signin" className="font-sans">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="font-sans">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="font-sans">
                      Email
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      className="bg-input border-border/50 focus:border-primary font-sans"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="font-sans">
                      Password
                    </Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      className="bg-input border-border/50 focus:border-primary font-sans"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => handleAuth("signin")}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-medium py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="font-sans">
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your Name"
                      className="bg-input border-border/50 focus:border-primary font-sans"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="font-sans">
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      className="bg-input border-border/50 focus:border-primary font-sans"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="font-sans">
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      className="bg-input border-border/50 focus:border-primary font-sans"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => handleAuth("signup")}
                  disabled={isLoading}
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-sans font-medium py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground font-sans">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
