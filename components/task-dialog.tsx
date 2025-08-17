"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays } from "lucide-react"

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

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task
  onSave: (task: Omit<Task, "id" | "createdAt"> & { id?: number }) => void
}

export function TaskDialog({ open, onOpenChange, task, onSave }: TaskDialogProps) {
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [priority, setPriority] = useState<"low" | "medium" | "high">(task?.priority || "medium")
  const [category, setCategory] = useState(task?.category || "Personal")
  const [dueDate, setDueDate] = useState(task?.dueDate || "")

  const handleSave = () => {
    if (!title.trim()) return

    onSave({
      id: task?.id,
      title: title.trim(),
      description: description.trim() || undefined,
      completed: task?.completed || false,
      priority,
      category,
      dueDate: dueDate || undefined,
    })

    // Reset form
    setTitle("")
    setDescription("")
    setPriority("medium")
    setCategory("Personal")
    setDueDate("")
    onOpenChange(false)
  }

  const handleCancel = () => {
    // Reset form to original values
    setTitle(task?.title || "")
    setDescription(task?.description || "")
    setPriority(task?.priority || "medium")
    setCategory(task?.category || "Personal")
    setDueDate(task?.dueDate || "")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-serif">{task ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription className="font-sans">
            {task ? "Make changes to your task here." : "Add a new task to your list."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-sans">
              Task Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to do?"
              className="font-sans"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-sans">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              className="font-sans resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-sans">Priority</Label>
              <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                <SelectTrigger className="font-sans">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-sans">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="font-sans">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Learning">Learning</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="font-sans flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="font-sans"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} className="font-sans bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-sans"
          >
            {task ? "Save Changes" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
