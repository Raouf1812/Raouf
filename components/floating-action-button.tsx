"use client"

import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

interface FloatingActionButtonProps {
  onClick: () => void
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full shadow-2xl hover-lift animate-pulse-glow"
    >
      <Settings className="w-6 h-6" />
    </Button>
  )
}
