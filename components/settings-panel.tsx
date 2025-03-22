"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check } from "lucide-react"

interface SettingsPanelProps {
  currentTheme: string
  onThemeChange: (theme: string) => void
  onClose: () => void
}

export function SettingsPanel({ currentTheme, onThemeChange, onClose }: SettingsPanelProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme)

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme)
  }

  const handleSave = () => {
    onThemeChange(selectedTheme)
    onClose()
  }

  const themes = [
    {
      id: "purple",
      name: "Purple (Default)",
      color: "#5E5CEC",
      gradient: "from-purple-600 via-indigo-500 to-purple-600",
    },
    { id: "blue", name: "Ocean Blue", color: "#3B82F6", gradient: "from-blue-600 via-cyan-500 to-blue-600" },
    { id: "green", name: "Forest Green", color: "#10B981", gradient: "from-green-600 via-emerald-500 to-green-600" },
    { id: "orange", name: "Sunset Orange", color: "#F97316", gradient: "from-orange-600 via-amber-500 to-orange-600" },
    { id: "pink", name: "Vibrant Pink", color: "#EC4899", gradient: "from-pink-600 via-rose-500 to-pink-600" },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-xl font-semibold mb-4">Appearance Settings</h3>
        <p className="text-sm text-gray-500 mb-4">Customize the look and feel of your flashcard app</p>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium">Theme Color</Label>
        <RadioGroup value={selectedTheme} onValueChange={handleThemeChange} className="grid grid-cols-1 gap-2">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`relative flex items-center rounded-md border p-3 cursor-pointer transition-all hover:border-gray-400 ${
                selectedTheme === theme.id ? "border-2 border-gray-900" : "border-gray-200"
              }`}
            >
              <RadioGroupItem value={theme.id} id={theme.id} className="sr-only" />
              <div className="flex items-center space-x-3 w-full">
                <div
                  className={`h-6 w-6 rounded-full bg-gradient-to-r ${theme.gradient}`}
                  style={{ backgroundColor: theme.color }}
                ></div>
                <Label htmlFor={theme.id} className="flex-1 cursor-pointer">
                  {theme.name}
                </Label>
                {selectedTheme === theme.id && <Check size={18} className="text-gray-900" />}
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="rounded-md hover:scale-105 transition-transform"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="rounded-md hover:scale-105 transition-transform bg-[#5E5CEC] hover:bg-[#4F46E5]"
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
}

