"use client"

import { Button } from "@/components/ui/button"
import { Settings, Sparkles } from "lucide-react"

interface HeaderProps {
  onCustomizeClick: () => void
}

export function Header({ onCustomizeClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 animate-slide-in-right">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center animate-pulse-glow">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="arabic-text">
            <h1 className="text-2xl font-bold text-primary">قائمة المهام الاحترافية</h1>
            <p className="text-sm text-muted-foreground">منظم مهامك بأسلوب احترافي</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onCustomizeClick}
          className="hover-lift glass-effect bg-transparent"
        >
          <Settings className="w-4 h-4 ml-2" />
          <span className="arabic-text">تخصيص</span>
        </Button>
      </div>
    </header>
  )
}
