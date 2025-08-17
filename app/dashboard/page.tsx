"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskCard } from "@/components/task-card"
import { TaskDialog } from "@/components/task-dialog"
import { CalendarView } from "@/components/calendar-view"
import { StoreView } from "@/components/store-view"
import { ProfileView } from "@/components/profile-view"
import { SettingsView } from "@/components/settings-view"
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Home,
  Calendar,
  ShoppingBag,
  User,
  Settings,
  Flame,
  Target,
  Search,
  Filter,
  CheckCircle2,
  Coins,
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

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState("home")
  const [tasks, setTasks] = useState<Task[]>([])
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [userCoins, setUserCoins] = useState(150)

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("taskflow-tasks")
    const savedCoins = localStorage.getItem("taskflow-user-coins")

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      // Default tasks for demo
      const defaultTasks: Task[] = [
        {
          id: 1,
          title: "Complete morning workout",
          description: "30 minutes cardio and strength training",
          completed: true,
          priority: "high",
          category: "Health",
          dueDate: new Date().toISOString().split("T")[0],
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: "Review project proposal",
          description: "Go through the Q3 marketing proposal and provide feedback",
          completed: false,
          priority: "medium",
          category: "Work",
          dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          title: "Call dentist for appointment",
          completed: false,
          priority: "low",
          category: "Personal",
          createdAt: new Date().toISOString(),
        },
        {
          id: 4,
          title: "Grocery shopping",
          description: "Milk, bread, eggs, vegetables",
          completed: true,
          priority: "medium",
          category: "Shopping",
          createdAt: new Date().toISOString(),
        },
      ]
      setTasks(defaultTasks)
      localStorage.setItem("taskflow-tasks", JSON.stringify(defaultTasks))
    }

    if (savedCoins) {
      setUserCoins(Number.parseInt(savedCoins))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks))
  }, [tasks])

  // Save coins to localStorage whenever coins change
  useEffect(() => {
    localStorage.setItem("taskflow-user-coins", userCoins.toString())
  }, [userCoins])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }

  const toggleTask = (taskId: number) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedTask = { ...task, completed: !task.completed }
          if (!task.completed && updatedTask.completed) {
            setUserCoins((prev) => prev + 10)
          } else if (task.completed && !updatedTask.completed) {
            setUserCoins((prev) => Math.max(0, prev - 10))
          }
          return updatedTask
        }
        return task
      }),
    )
  }

  const handleSaveTask = (taskData: Omit<Task, "id" | "createdAt"> & { id?: number }) => {
    if (taskData.id) {
      // Edit existing task
      setTasks(
        tasks.map((task) =>
          task.id === taskData.id ? ({ ...taskData, id: taskData.id, createdAt: task.createdAt } as Task) : task,
        ),
      )
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: Math.max(0, ...tasks.map((t) => t.id)) + 1,
        createdAt: new Date().toISOString(),
      } as Task
      setTasks([...tasks, newTask])
    }
    setEditingTask(undefined)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskDialogOpen(true)
  }

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const handleCreateTask = () => {
    setEditingTask(undefined)
    setIsTaskDialogOpen(true)
  }

  const handlePurchase = (itemId: string) => {
    // Handle store purchases - could trigger notifications, unlock features, etc.
    console.log(`Purchased item: ${itemId}`)
  }

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || task.category === filterCategory
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority

    return matchesSearch && matchesCategory && matchesPriority
  })

  const completedTasks = filteredTasks.filter((task) => task.completed).length
  const totalTasks = filteredTasks.length
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "store", icon: ShoppingBag, label: "Store" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "settings", icon: Settings, label: "Settings" },
  ]

  const categories = ["all", "Personal", "Work", "Health", "Learning", "Shopping"]
  const priorities = ["all", "low", "medium", "high"]

  const renderActiveTabContent = () => {
    if (activeTab === "calendar") {
      return (
        <div className="min-h-screen bg-background">
          <CalendarView tasks={tasks} onCreateTask={handleCreateTask} onToggleTask={toggleTask} />

          {/* Bottom Navigation */}
          <div className="bg-card border-t border-border px-4 py-2">
            <div className="flex justify-around">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors ${
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-sans">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Task Dialog */}
          <TaskDialog
            open={isTaskDialogOpen}
            onOpenChange={setIsTaskDialogOpen}
            task={editingTask}
            onSave={handleSaveTask}
          />
        </div>
      )
    }

    if (activeTab === "store") {
      return (
        <div className="min-h-screen bg-background">
          <StoreView onPurchase={handlePurchase} />

          {/* Bottom Navigation */}
          <div className="bg-card border-t border-border px-4 py-2">
            <div className="flex justify-around">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors ${
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-sans">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )
    }

    if (activeTab === "profile") {
      return (
        <div className="min-h-screen bg-background">
          <ProfileView tasks={tasks} />

          {/* Bottom Navigation */}
          <div className="bg-card border-t border-border px-4 py-2">
            <div className="flex justify-around">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors ${
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-sans">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )
    }

    if (activeTab === "settings") {
      return (
        <div className="min-h-screen bg-background">
          <SettingsView />

          {/* Bottom Navigation */}
          <div className="bg-card border-t border-border px-4 py-2">
            <div className="flex justify-around">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors ${
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-sans">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-background">
        {/* Header with Date Navigation */}
        <div className="bg-card border-b border-border px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-serif font-bold">TaskFlow</h1>
                <p className="text-xs text-muted-foreground font-sans">Stay productive!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Coins className="w-5 h-5 text-accent" />
                <span className="text-sm font-sans font-medium">{userCoins}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-accent" />
                <span className="text-sm font-sans font-medium">7</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigateDate("prev")} className="p-2 hover:bg-muted/50">
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="text-center">
              <h2 className="font-serif font-semibold text-foreground">{formatDate(currentDate)}</h2>
            </div>

            <Button variant="ghost" size="sm" onClick={() => navigateDate("next")} className="p-2 hover:bg-muted/50">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-sans text-muted-foreground">
                {completedTasks} of {totalTasks} tasks completed
              </span>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-sans font-medium">{Math.round(progressPercentage)}%</span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 space-y-3 bg-card/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-sans"
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="flex-1 font-sans">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="font-sans">
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="flex-1 font-sans">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority} value={priority} className="font-sans">
                    {priority === "all" ? "All Priorities" : priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tasks List */}
        <div className="flex-1 p-4 space-y-3">
          {filteredTasks.length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto">
                    <Target className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-serif font-semibold">No tasks found</h3>
                    <p className="text-muted-foreground font-sans text-sm">
                      {searchQuery || filterCategory !== "all" || filterPriority !== "all"
                        ? "Try adjusting your search or filters"
                        : "Create your first task to get started!"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}

          {/* Add New Task Button */}
          <Card
            className="border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={handleCreateTask}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Plus className="w-5 h-5" />
                <span className="font-sans">Add new task</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-card border-t border-border px-4 py-2">
          <div className="flex justify-around">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-sans">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Task Dialog */}
        <TaskDialog
          open={isTaskDialogOpen}
          onOpenChange={setIsTaskDialogOpen}
          task={editingTask}
          onSave={handleSaveTask}
        />
      </div>
    )
  }

  return renderActiveTabContent()
}
