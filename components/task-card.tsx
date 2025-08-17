"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CheckCircle2, Circle, MoreVertical, Edit3, Trash2, Calendar, Tag } from "lucide-react"

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

interface TaskCardProps {
  task: Task
  onToggle: (taskId: number) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed

  return (
    <Card
      className={`border-border/50 transition-all duration-200 hover:shadow-md ${
        task.completed ? "bg-muted/30" : "bg-card"
      } ${isOverdue ? "border-destructive/50" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <button onClick={() => onToggle(task.id)} className="flex-shrink-0 mt-0.5">
            {task.completed ? (
              <CheckCircle2 className="w-6 h-6 text-primary" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3
                  className={`font-sans font-medium ${
                    task.completed ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-muted-foreground font-sans mt-1 line-clamp-2">{task.description}</p>
                )}
              </div>

              <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => onEdit(task)} className="font-sans">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(task.id)}
                    className="font-sans text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge
                variant={
                  task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                }
                className="text-xs font-sans"
              >
                {task.priority}
              </Badge>

              <Badge variant="outline" className="text-xs font-sans">
                <Tag className="w-3 h-3 mr-1" />
                {task.category}
              </Badge>

              {task.dueDate && (
                <Badge variant={isOverdue ? "destructive" : "outline"} className="text-xs font-sans">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDueDate(task.dueDate)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
