"use client"

import { useState, useEffect } from "react"
import { TodoList } from "@/components/todo-list"
import { CustomizationPanel } from "@/components/customization-panel"
import { Header } from "@/components/header"
import { FloatingActionButton } from "@/components/floating-action-button"

export default function HomePage() {
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10">
        <Header onCustomizeClick={() => setIsCustomizationOpen(true)} />

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-slide-in-up">
            <TodoList />
          </div>
        </main>

        {/* زر الإعدادات العائم */}
        <FloatingActionButton onClick={() => setIsCustomizationOpen(true)} />

        {/* لوحة التخصيص */}
        <CustomizationPanel isOpen={isCustomizationOpen} onClose={() => setIsCustomizationOpen(false)} />
      </div>
    </div>
  )
}
