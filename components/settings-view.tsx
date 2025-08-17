"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Bell,
  Palette,
  Shield,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  Smartphone,
  Mail,
  MessageSquare,
  Trash2,
  Download,
  Upload,
} from "lucide-react"

interface SettingsData {
  notifications: {
    taskReminders: boolean
    dailyDigest: boolean
    achievements: boolean
    streakReminders: boolean
  }
  appearance: {
    theme: "light" | "dark" | "system"
    colorScheme: "default" | "ocean" | "sunset" | "forest"
    compactMode: boolean
  }
  privacy: {
    analytics: boolean
    crashReports: boolean
    dataSharing: boolean
  }
  preferences: {
    defaultTaskPriority: "low" | "medium" | "high"
    taskSortOrder: "created" | "priority" | "dueDate"
    weekStartsOn: "sunday" | "monday"
    timeFormat: "12h" | "24h"
  }
}

export function SettingsView() {
  const [settings, setSettings] = useState<SettingsData>({
    notifications: {
      taskReminders: true,
      dailyDigest: true,
      achievements: true,
      streakReminders: true,
    },
    appearance: {
      theme: "system",
      colorScheme: "default",
      compactMode: false,
    },
    privacy: {
      analytics: true,
      crashReports: true,
      dataSharing: false,
    },
    preferences: {
      defaultTaskPriority: "medium",
      taskSortOrder: "created",
      weekStartsOn: "monday",
      timeFormat: "12h",
    },
  })

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("taskflow-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("taskflow-settings", JSON.stringify(settings))
  }, [settings])

  const updateSetting = (section: keyof SettingsData, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  const exportData = () => {
    const data = {
      tasks: JSON.parse(localStorage.getItem("taskflow-tasks") || "[]"),
      settings: settings,
      userStats: JSON.parse(localStorage.getItem("taskflow-user-stats") || "{}"),
      ownedItems: JSON.parse(localStorage.getItem("taskflow-owned-items") || "[]"),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `taskflow-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.removeItem("taskflow-tasks")
      localStorage.removeItem("taskflow-user-stats")
      localStorage.removeItem("taskflow-owned-items")
      localStorage.removeItem("taskflow-settings")
      localStorage.removeItem("taskflow-user-coins")
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold">Settings</h1>
              <p className="text-xs text-muted-foreground font-sans">Customize your experience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Notifications */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-serif flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription className="font-sans">Manage how and when you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-sans font-medium">Task Reminders</Label>
                <p className="text-sm text-muted-foreground font-sans">Get notified about upcoming tasks</p>
              </div>
              <Switch
                checked={settings.notifications.taskReminders}
                onCheckedChange={(checked) => updateSetting("notifications", "taskReminders", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-sans font-medium">Daily Digest</Label>
                <p className="text-sm text-muted-foreground font-sans">Daily summary of your tasks</p>
              </div>
              <Switch
                checked={settings.notifications.dailyDigest}
                onCheckedChange={(checked) => updateSetting("notifications", "dailyDigest", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-sans font-medium">Achievement Alerts</Label>
                <p className="text-sm text-muted-foreground font-sans">Celebrate your accomplishments</p>
              </div>
              <Switch
                checked={settings.notifications.achievements}
                onCheckedChange={(checked) => updateSetting("notifications", "achievements", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-sans font-medium">Streak Reminders</Label>
                <p className="text-sm text-muted-foreground font-sans">Don't break your streak!</p>
              </div>
              <Switch
                checked={settings.notifications.streakReminders}
                onCheckedChange={(checked) => updateSetting("notifications", "streakReminders", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-serif flex items-center gap-2">
              <Palette className="w-5 h-5 text-secondary" />
              Appearance
            </CardTitle>
            <CardDescription className="font-sans">Customize the look and feel of the app</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-sans font-medium">Theme</Label>
              <Select
                value={settings.appearance.theme}
                onValueChange={(value: "light" | "dark" | "system") => updateSetting("appearance", "theme", value)}
              >
                <SelectTrigger className="font-sans">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light" className="font-sans">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark" className="font-sans">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system" className="font-sans">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-sans font-medium">Color Scheme</Label>
              <Select
                value={settings.appearance.colorScheme}
                onValueChange={(value: "default" | "ocean" | "sunset" | "forest") =>
                  updateSetting("appearance", "colorScheme", value)
                }
              >
                <SelectTrigger className="font-sans">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default" className="font-sans">
                    Default (Teal & Blue)
                  </SelectItem>
                  <SelectItem value="ocean" className="font-sans">
                    Ocean Breeze
                  </SelectItem>
                  <SelectItem value="sunset" className="font-sans">
                    Sunset Glow
                  </SelectItem>
                  <SelectItem value="forest" className="font-sans">
                    Forest Green
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-sans font-medium">Compact Mode</Label>
                <p className="text-sm text-muted-foreground font-sans">Reduce spacing for more content</p>
              </div>
              <Switch
                checked={settings.appearance.compactMode}
                onCheckedChange={(checked) => updateSetting("appearance", "compactMode", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-serif flex items-center gap-2">
              <Settings className="w-5 h-5 text-accent" />
              Preferences
            </CardTitle>
            <CardDescription className="font-sans">Configure default behaviors and formats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-sans font-medium">Default Task Priority</Label>
              <Select
                value={settings.preferences.defaultTaskPriority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  updateSetting("preferences", "defaultTaskPriority", value)
                }
              >
                <SelectTrigger className="font-sans">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low" className="font-sans">
                    Low
                  </SelectItem>
                  <SelectItem value="medium" className="font-sans">
                    Medium
                  </SelectItem>
                  <SelectItem value="high" className="font-sans">
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-sans font-medium">Task Sort Order</Label>
              <Select
                value={settings.preferences.taskSortOrder}
                onValueChange={(value: "created" | "priority" | "dueDate") =>
                  updateSetting("preferences", "taskSortOrder", value)
                }
              >
                <SelectTrigger className="font-sans">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created" className="font-sans">
                    Date Created
                  </SelectItem>
                  <SelectItem value="priority" className="font-sans">
                    Priority
                  </SelectItem>
                  <SelectItem value="dueDate" className="font-sans">
                    Due Date
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-sans font-medium">Week Starts On</Label>
              <Select
                value={settings.preferences.weekStartsOn}
                onValueChange={(value: "sunday" | "monday") => updateSetting("preferences", "weekStartsOn", value)}
              >
                <SelectTrigger className="font-sans">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunday" className="font-sans">
                    Sunday
                  </SelectItem>
                  <SelectItem value="monday" className="font-sans">
                    Monday
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-sans font-medium">Time Format</Label>
              <Select
                value={settings.preferences.timeFormat}
                onValueChange={(value: "12h" | "24h") => updateSetting("preferences", "timeFormat", value)}
              >
                <SelectTrigger className="font-sans">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h" className="font-sans">
                    12 Hour (AM/PM)
                  </SelectItem>
                  <SelectItem value="24h" className="font-sans">
                    24 Hour
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-serif flex items-center gap-2">
              <Shield className="w-5 h-5 text-destructive" />
              Privacy & Data
            </CardTitle>
            <CardDescription className="font-sans">Control how your data is used and shared</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-sans font-medium">Analytics</Label>
                <p className="text-sm text-muted-foreground font-sans">Help improve the app with usage data</p>
              </div>
              <Switch
                checked={settings.privacy.analytics}
                onCheckedChange={(checked) => updateSetting("privacy", "analytics", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-sans font-medium">Crash Reports</Label>
                <p className="text-sm text-muted-foreground font-sans">Automatically send crash reports</p>
              </div>
              <Switch
                checked={settings.privacy.crashReports}
                onCheckedChange={(checked) => updateSetting("privacy", "crashReports", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-sans font-medium">Data Sharing</Label>
                <p className="text-sm text-muted-foreground font-sans">Share anonymized data with partners</p>
              </div>
              <Switch
                checked={settings.privacy.dataSharing}
                onCheckedChange={(checked) => updateSetting("privacy", "dataSharing", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-serif">Data Management</CardTitle>
            <CardDescription className="font-sans">Export, import, or clear your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={exportData} variant="outline" className="w-full justify-start font-sans bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>

            <Button variant="outline" className="w-full justify-start font-sans bg-transparent" disabled>
              <Upload className="w-4 h-4 mr-2" />
              Import Data
              <Badge variant="secondary" className="ml-auto text-xs font-sans">
                Coming Soon
              </Badge>
            </Button>

            <Separator />

            <Button onClick={clearAllData} variant="destructive" className="w-full justify-start font-sans">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-serif">Support & Feedback</CardTitle>
            <CardDescription className="font-sans">Get help or share your thoughts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start font-sans bg-transparent" disabled>
              <HelpCircle className="w-4 h-4 mr-2" />
              Help Center
              <Badge variant="secondary" className="ml-auto text-xs font-sans">
                Coming Soon
              </Badge>
            </Button>

            <Button variant="outline" className="w-full justify-start font-sans bg-transparent" disabled>
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Feedback
              <Badge variant="secondary" className="ml-auto text-xs font-sans">
                Coming Soon
              </Badge>
            </Button>

            <Button variant="outline" className="w-full justify-start font-sans bg-transparent" disabled>
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
              <Badge variant="secondary" className="ml-auto text-xs font-sans">
                Coming Soon
              </Badge>
            </Button>
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-serif">Account</CardTitle>
            <CardDescription className="font-sans">Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full justify-start font-sans text-destructive hover:text-destructive bg-transparent"
              disabled
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
              <Badge variant="secondary" className="ml-auto text-xs font-sans">
                Coming Soon
              </Badge>
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground font-sans">TaskFlow v1.0.0</p>
          <p className="text-xs text-muted-foreground font-sans mt-1">Built with ❤️ for productivity enthusiasts</p>
        </div>
      </div>
    </div>
  )
}
