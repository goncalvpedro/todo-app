"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Plus, CheckCircle2, Circle, CalendarIcon } from "lucide-react"

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

interface CalendarViewProps {
  tasks: Task[]
  onCreateTask: () => void
  onToggleTask: (taskId: number) => void
}

export function CalendarView({ tasks, onCreateTask, onToggleTask }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const today = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay() // 0 = Sunday
  const daysInMonth = lastDayOfMonth.getDate()

  // Get previous month's last days to fill the grid
  const prevMonth = new Date(currentYear, currentMonth - 1, 0)
  const daysInPrevMonth = prevMonth.getDate()

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "next") {
      newDate.setMonth(currentMonth + 1)
    } else {
      newDate.setMonth(currentMonth - 1)
    }
    setCurrentDate(newDate)
    setSelectedDate(null)
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getTasksForDate = (date: Date) => {
    const dateKey = formatDateKey(date)
    return tasks.filter((task) => task.dueDate === dateKey)
  }

  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSameMonth = (date: Date) => {
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  }

  const isSelected = (date: Date) => {
    return (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  // Generate calendar days
  const calendarDays = []

  // Previous month's trailing days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - 1, daysInPrevMonth - i)
    calendarDays.push({ date, isCurrentMonth: false })
  }

  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day)
    calendarDays.push({ date, isCurrentMonth: true })
  }

  // Next month's leading days to complete the grid (6 weeks = 42 days)
  const remainingDays = 42 - calendarDays.length
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(currentYear, currentMonth + 1, day)
    calendarDays.push({ date, isCurrentMonth: false })
  }

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold">Calendar</h1>
              <p className="text-xs text-muted-foreground font-sans">Plan your tasks</p>
            </div>
          </div>
          <Button onClick={onCreateTask} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-1" />
            <span className="font-sans">Task</span>
          </Button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")} className="p-2 hover:bg-muted/50">
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <h2 className="font-serif font-semibold text-foreground">{formatMonthYear(currentDate)}</h2>

          <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")} className="p-2 hover:bg-muted/50">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Calendar Grid */}
        <div className="flex-1 p-4">
          <Card className="bg-card border-border/50">
            <CardContent className="p-4">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center py-2">
                    <span className="text-xs font-sans font-medium text-muted-foreground">{day}</span>
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map(({ date, isCurrentMonth }, index) => {
                  const dayTasks = getTasksForDate(date)
                  const completedTasks = dayTasks.filter((task) => task.completed).length
                  const totalTasks = dayTasks.length
                  const hasHighPriority = dayTasks.some((task) => task.priority === "high" && !task.completed)

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        relative aspect-square p-1 rounded-lg transition-all duration-200 hover:bg-muted/50
                        ${isSelected(date) ? "bg-primary/10 border-2 border-primary" : "border border-transparent"}
                        ${isToday(date) && isCurrentMonth ? "bg-accent/10 border border-accent" : ""}
                        ${!isCurrentMonth ? "opacity-40" : ""}
                      `}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span
                          className={`text-sm font-sans font-medium ${
                            isToday(date) && isCurrentMonth
                              ? "text-accent"
                              : isSelected(date)
                                ? "text-primary"
                                : isCurrentMonth
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                          }`}
                        >
                          {date.getDate()}
                        </span>

                        {/* Task indicators */}
                        {totalTasks > 0 && (
                          <div className="flex items-center gap-0.5 mt-1">
                            {totalTasks <= 3 ? (
                              // Show individual dots for 1-3 tasks
                              dayTasks
                                .slice(0, 3)
                                .map((task, taskIndex) => (
                                  <div
                                    key={taskIndex}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      task.completed
                                        ? "bg-primary"
                                        : task.priority === "high"
                                          ? "bg-destructive"
                                          : task.priority === "medium"
                                            ? "bg-accent"
                                            : "bg-muted-foreground"
                                    }`}
                                  />
                                ))
                            ) : (
                              // Show count for 4+ tasks
                              <div
                                className={`text-xs px-1 py-0.5 rounded-full font-sans font-medium ${
                                  hasHighPriority
                                    ? "bg-destructive text-destructive-foreground"
                                    : completedTasks === totalTasks
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-secondary text-secondary-foreground"
                                }`}
                              >
                                {totalTasks}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Tasks */}
        {selectedDate && (
          <div className="w-full lg:w-80 p-4 lg:border-l border-border">
            <Card className="bg-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-serif font-semibold">
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </h3>
                    <p className="text-sm text-muted-foreground font-sans">
                      {selectedDateTasks.length} {selectedDateTasks.length === 1 ? "task" : "tasks"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDate(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </Button>
                </div>

                <ScrollArea className="h-64">
                  {selectedDateTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground font-sans">No tasks for this date</p>
                      <Button
                        onClick={onCreateTask}
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-primary hover:text-primary/80"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add task
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedDateTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <button onClick={() => onToggleTask(task.id)} className="flex-shrink-0 mt-0.5">
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <h4
                              className={`font-sans font-medium text-sm ${
                                task.completed ? "text-muted-foreground line-through" : "text-foreground"
                              }`}
                            >
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-xs text-muted-foreground font-sans mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant={
                                  task.priority === "high"
                                    ? "destructive"
                                    : task.priority === "medium"
                                      ? "default"
                                      : "secondary"
                                }
                                className="text-xs font-sans"
                              >
                                {task.priority}
                              </Badge>
                              <Badge variant="outline" className="text-xs font-sans">
                                {task.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
