"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { X, Palette, ImageIcon, Type, Layout, Save } from "lucide-react"

interface CustomizationPanelProps {
  isOpen: boolean
  onClose: () => void
}

interface CustomSettings {
  backgroundColor: string
  accentColor: string
  fontSize: number
  borderRadius: number
  showAnimations: boolean
  backgroundImage: string
  theme: "dark" | "darker" | "purple"
}

export function CustomizationPanel({ isOpen, onClose }: CustomizationPanelProps) {
  const [settings, setSettings] = useState<CustomSettings>({
    backgroundColor: "#0a0a0a",
    accentColor: "#8b5cf6",
    fontSize: 16,
    borderRadius: 12,
    showAnimations: true,
    backgroundImage: "",
    theme: "dark",
  })

  // تحميل الإعدادات من التخزين المحلي
  useEffect(() => {
    const savedSettings = localStorage.getItem("customization-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // تطبيق الإعدادات
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--background", settings.backgroundColor)
    root.style.setProperty("--primary", settings.accentColor)
    root.style.setProperty("--accent", settings.accentColor)
    root.style.setProperty("--radius", `${settings.borderRadius}px`)
    root.style.fontSize = `${settings.fontSize}px`

    if (settings.backgroundImage) {
      document.body.style.backgroundImage = `url(${settings.backgroundImage})`
      document.body.style.backgroundSize = "cover"
      document.body.style.backgroundPosition = "center"
      document.body.style.backgroundAttachment = "fixed"
    } else {
      document.body.style.backgroundImage = "none"
    }

    // إيقاف/تشغيل الأنيميشن
    if (!settings.showAnimations) {
      root.style.setProperty("--animation-duration", "0s")
    } else {
      root.style.setProperty("--animation-duration", "0.6s")
    }
  }, [settings])

  const saveSettings = () => {
    localStorage.setItem("customization-settings", JSON.stringify(settings))
    onClose()
  }

  const resetSettings = () => {
    const defaultSettings: CustomSettings = {
      backgroundColor: "#0a0a0a",
      accentColor: "#8b5cf6",
      fontSize: 16,
      borderRadius: 12,
      showAnimations: true,
      backgroundImage: "",
      theme: "dark",
    }
    setSettings(defaultSettings)
    localStorage.setItem("customization-settings", JSON.stringify(defaultSettings))
  }

  const presetThemes = [
    { name: "داكن كلاسيكي", bg: "#0a0a0a", accent: "#8b5cf6", key: "dark" },
    { name: "أسود عميق", bg: "#000000", accent: "#6366f1", key: "darker" },
    { name: "بنفسجي احترافي", bg: "#1a0b2e", accent: "#9d4edd", key: "purple" },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* خلفية شفافة */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* لوحة التخصيص */}
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-effect animate-slide-in-up">
        <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border/50 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold arabic-text">لوحة التخصيص</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* الثيمات المحددة مسبقاً */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Layout className="w-5 h-5 text-primary" />
              <Label className="text-lg font-semibold arabic-text">الثيمات المحددة مسبقاً</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {presetThemes.map((theme) => (
                <Button
                  key={theme.key}
                  variant={settings.theme === theme.key ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center gap-2 hover-lift"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      backgroundColor: theme.bg,
                      accentColor: theme.accent,
                      theme: theme.key as any,
                    })
                  }
                >
                  <div className="w-8 h-8 rounded-full border-2 border-white/20" style={{ backgroundColor: theme.bg }}>
                    <div className="w-3 h-3 rounded-full m-auto mt-1" style={{ backgroundColor: theme.accent }} />
                  </div>
                  <span className="text-sm arabic-text">{theme.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* الألوان */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <Label className="text-lg font-semibold arabic-text">الألوان</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="arabic-text">لون الخلفية</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={settings.backgroundColor}
                    onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                    className="w-16 h-10 p-1 border-border"
                  />
                  <Input
                    value={settings.backgroundColor}
                    onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                    className="flex-1 arabic-text"
                    placeholder="#0a0a0a"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="arabic-text">اللون الأساسي</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                    className="w-16 h-10 p-1 border-border"
                  />
                  <Input
                    value={settings.accentColor}
                    onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                    className="flex-1 arabic-text"
                    placeholder="#8b5cf6"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* الخط والحجم */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5 text-primary" />
              <Label className="text-lg font-semibold arabic-text">الخط والحجم</Label>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="arabic-text">حجم الخط: {settings.fontSize}px</Label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([value]) => setSettings({ ...settings, fontSize: value })}
                  min={12}
                  max={24}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="arabic-text">استدارة الحواف: {settings.borderRadius}px</Label>
                <Slider
                  value={[settings.borderRadius]}
                  onValueChange={([value]) => setSettings({ ...settings, borderRadius: value })}
                  min={0}
                  max={24}
                  step={2}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* صورة الخلفية */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              <Label className="text-lg font-semibold arabic-text">صورة الخلفية</Label>
            </div>
            <div className="space-y-2">
              <Input
                value={settings.backgroundImage}
                onChange={(e) => setSettings({ ...settings, backgroundImage: e.target.value })}
                placeholder="رابط الصورة (اختياري)"
                className="arabic-text"
              />
              <p className="text-sm text-muted-foreground arabic-text">
                يمكنك إضافة رابط صورة من الإنترنت لتخصيص خلفية التطبيق
              </p>
            </div>
          </div>

          {/* الإعدادات المتقدمة */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold arabic-text">الإعدادات المتقدمة</Label>
            <div className="flex items-center justify-between">
              <Label className="arabic-text">تفعيل الأنيميشن</Label>
              <Switch
                checked={settings.showAnimations}
                onCheckedChange={(checked) => setSettings({ ...settings, showAnimations: checked })}
              />
            </div>
          </div>

          {/* أزرار الحفظ */}
          <div className="flex gap-3 pt-4 border-t border-border/50">
            <Button onClick={saveSettings} className="flex-1 hover-lift">
              <Save className="w-4 h-4 ml-2" />
              <span className="arabic-text">حفظ الإعدادات</span>
            </Button>
            <Button variant="outline" onClick={resetSettings} className="hover-lift bg-transparent">
              <span className="arabic-text">إعادة تعيين</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
