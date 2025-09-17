"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit3, Calendar, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Todo {
  id: string
  text: string
  completed: boolean
  priority: "low" | "medium" | "high"
  createdAt: Date
  category: string
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  // تحميل البيانات من التخزين المحلي
  useEffect(() => {
    const savedTodos = localStorage.getItem("professional-todos")
    if (savedTodos) {
      const parsed = JSON.parse(savedTodos)
      setTodos(
        parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
        })),
      )
    }
  }, [])

  // حفظ البيانات في التخزين المحلي
  useEffect(() => {
    localStorage.setItem("professional-todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        priority: "medium",
        createdAt: new Date(),
        category: "عام",
      }
      setTodos([todo, ...todos])
      setNewTodo("")
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = () => {
    if (editText.trim()) {
      setTodos(todos.map((todo) => (todo.id === editingId ? { ...todo, text: editText.trim() } : todo)))
    }
    setEditingId(null)
    setEditText("")
  }

  const togglePriority = (id: string) => {
    const priorities: ("low" | "medium" | "high")[] = ["low", "medium", "high"]
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const currentIndex = priorities.indexOf(todo.priority)
          const nextIndex = (currentIndex + 1) % priorities.length
          return { ...todo, priority: priorities[nextIndex] }
        }
        return todo
      }),
    )
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed
    if (filter === "completed") return todo.completed
    return true
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-primary text-primary-foreground"
      case "low":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "عالية"
      case "medium":
        return "متوسطة"
      case "low":
        return "منخفضة"
      default:
        return "متوسطة"
    }
  }

  return (
    <div className="space-y-6">
      {/* إضافة مهمة جديدة */}
      <Card className="p-6 glass-effect hover-lift">
        <div className="flex gap-3">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="أضف مهمة جديدة..."
            className="flex-1 arabic-text bg-input/50 border-border/50"
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
          />
          <Button onClick={addTodo} className="hover-lift animate-pulse-glow" disabled={!newTodo.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* فلاتر */}
      <div className="flex gap-2 justify-center">
        {[
          { key: "all", label: "الكل" },
          { key: "active", label: "نشطة" },
          { key: "completed", label: "مكتملة" },
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(key as any)}
            className="arabic-text hover-lift"
          >
            {label}
          </Button>
        ))}
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center glass-effect hover-lift">
          <div className="text-2xl font-bold text-primary">{todos.length}</div>
          <div className="text-sm text-muted-foreground arabic-text">إجمالي المهام</div>
        </Card>
        <Card className="p-4 text-center glass-effect hover-lift">
          <div className="text-2xl font-bold text-accent">{todos.filter((t) => !t.completed).length}</div>
          <div className="text-sm text-muted-foreground arabic-text">مهام نشطة</div>
        </Card>
        <Card className="p-4 text-center glass-effect hover-lift">
          <div className="text-2xl font-bold text-green-500">{todos.filter((t) => t.completed).length}</div>
          <div className="text-sm text-muted-foreground arabic-text">مهام مكتملة</div>
        </Card>
      </div>

      {/* قائمة المهام */}
      <div className="space-y-3">
        {filteredTodos.map((todo, index) => (
          <Card
            key={todo.id}
            className={cn("p-4 glass-effect hover-lift transition-all duration-300", todo.completed && "opacity-60")}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-4">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />

              <div className="flex-1">
                {editingId === todo.id ? (
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                    onBlur={saveEdit}
                    className="arabic-text bg-transparent border-none p-0 h-auto"
                    autoFocus
                  />
                ) : (
                  <div className="space-y-2">
                    <p
                      className={cn("arabic-text text-balance", todo.completed && "line-through text-muted-foreground")}
                    >
                      {todo.text}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{todo.createdAt.toLocaleDateString("ar-EG")}</span>
                      <Badge
                        className={cn("text-xs cursor-pointer", getPriorityColor(todo.priority))}
                        onClick={() => togglePriority(todo.id)}
                      >
                        <Star className="w-3 h-3 ml-1" />
                        {getPriorityText(todo.priority)}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => startEdit(todo)} className="hover-lift">
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  className="hover-lift text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTodos.length === 0 && (
        <Card className="p-12 text-center glass-effect">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-2 arabic-text">لا توجد مهام</h3>
          <p className="text-muted-foreground arabic-text">
            {filter === "all"
              ? "ابدأ بإضافة مهمة جديدة"
              : filter === "active"
                ? "لا توجد مهام نشطة"
                : "لا توجد مهام مكتملة"}
          </p>
        </Card>
      )}
    </div>
  )
}
