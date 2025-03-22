"use client"

import type React from "react"

import { useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TextToSpeechProps {
  text: string
  className?: string
}

export function TextToSpeech({ text, className = "" }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = (e: React.MouseEvent) => {
    // Prevent the click from propagating to parent elements
    e.stopPropagation()

    if (!text) return

    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    // Create a new speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text)

    // Set properties
    utterance.lang = "en-US"
    utterance.rate = 1.0
    utterance.pitch = 1.0

    // Add event listeners
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    // Speak
    window.speechSynthesis.speak(utterance)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`rounded-full p-2 ${className}`}
      onClick={speak}
      aria-label={isSpeaking ? "Stop speaking" : "Speak text"}
    >
      {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </Button>
  )
}

