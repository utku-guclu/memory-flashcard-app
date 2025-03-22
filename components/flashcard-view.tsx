"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import { TextToSpeech } from "@/components/text-to-speech"

interface FlashcardViewProps {
  cards: {
    id: number
    term: string
    definition: string
    imagePrompt: string
    imageUrl: string
  }[]
  currentIndex: number
  onNext: () => void
  onExit: () => void
  themeColors?: {
    primary: string
    gradient: string
    hover: string
  }
  isLoading?: boolean
}

export function FlashcardView({
  cards,
  currentIndex,
  onNext,
  onExit,
  themeColors = {
    primary: "#5E5CEC",
    gradient: "from-purple-600 via-indigo-500 to-purple-600",
    hover: "#4F46E5",
  },
  isLoading = false,
}: FlashcardViewProps) {
  const [isFlipped, setIsFlipped] = useState(true)
  const totalCards = cards.length
  const card = cards[currentIndex]

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFlipped(true)
    onNext()
  }

  const progress = ((currentIndex + 1) / totalCards) * 100

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isLoading ? `bg-gradient-to-r ${themeColors.gradient} animate-gradient-x` : ""
      }`}
      style={{ backgroundColor: isLoading ? "" : themeColors.primary }}
    >
      <div className="flashcard-container flex flex-col h-full">
        <div className="mb-4">
          <Button variant="ghost" size="sm" onClick={onExit} className="text-white hover:bg-white/10">
            <ArrowLeft size={18} className="mr-2" />
            Back to Deck
          </Button>
        </div>

        <div className={`flashcard flex-grow flex flex-col ${isLoading ? "animate-pulse" : ""}`}>
          <div className="flashcard-header" style={{ backgroundColor: themeColors.primary }}>
            <h2 className="text-2xl font-bold">Learning the Term</h2>
            <p className="text-sm opacity-80">
              Card {currentIndex + 1} of {totalCards}
            </p>
          </div>

          <div
            className="flashcard-content flex-grow flex flex-col justify-center items-center relative cursor-pointer"
            onClick={handleFlip}
          >
            <div
              className={`w-full h-full absolute transition-all duration-500 flex items-center justify-center ${
                isFlipped ? "opacity-0 -rotate-y-180 pointer-events-none" : "opacity-100 rotate-y-0"
              }`}
            >
              <div className="text-center">
                <div className="text-4xl font-bold mb-6 animate-fade-in">{card.term}</div>
                <div className="flex items-center justify-center">
                  <p className="text-gray-500 text-sm mr-2">Tap to reveal</p>
                  <div onClick={(e) => e.stopPropagation()}>
                    <TextToSpeech text={card.term} />
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`w-full h-full absolute transition-all duration-500 flex items-center justify-center ${
                isFlipped ? "opacity-100 rotate-y-0" : "opacity-0 rotate-y-180 pointer-events-none"
              }`}
            >
              <div className="w-full animate-fade-in p-4 max-w-2xl mx-auto">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-gray-700 flex-1">{card.definition}</p>
                  <div onClick={(e) => e.stopPropagation()}>
                    <TextToSpeech text={card.definition} className="ml-2 flex-shrink-0" />
                  </div>
                </div>
                <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                  <Image src={card.imageUrl || "/placeholder.svg"} alt={card.term} fill className="object-cover" />
                </div>
                <p className="text-xs text-gray-500 italic">{card.imagePrompt}</p>
              </div>
            </div>
          </div>

          <div className="flashcard-footer">
            <div className="progress-bar mb-4">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${progress}%`,
                  backgroundColor: themeColors.primary,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 text-center mb-4">
              {currentIndex + 1}/{totalCards}
            </p>
            <button
              className="next-button hover:scale-105 transition-transform hover:bg-[--hover-color]"
              onClick={handleNext}
              style={
                {
                  backgroundColor: themeColors.primary,
                  "--hover-color": themeColors.hover,
                } as any
              }
            >
              NEXT CARD
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
