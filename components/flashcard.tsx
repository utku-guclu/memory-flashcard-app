"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { RefreshCw, Edit } from "lucide-react"
import { TextToSpeech } from "@/components/text-to-speech"

interface FlashcardProps {
  card: {
    id: number
    term: string
    definition: string
    imagePrompt: string
    imageUrl: string
  }
  onEdit?: (card: any) => void
  themeColors?: {
    primary: string
    gradient: string
    hover: string
  }
}

export function Flashcard({
  card,
  onEdit,
  themeColors = {
    primary: "#5E5CEC",
    gradient: "from-purple-600 via-indigo-500 to-purple-600",
    hover: "#4F46E5",
  },
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [imageUrl, setImageUrl] = useState(card.imageUrl)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const regenerateImage = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsGeneratingImage(true)

    try {
      // Call the server action to regenerate the image
      const response = await fetch("/api/regenerate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: card.imagePrompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to regenerate image")
      }

      const data = await response.json()
      setImageUrl(data.imageUrl)
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit(card)
    }
  }

  return (
    <div className={`perspective-1000 h-[400px] w-full ${isGeneratingImage ? "animate-pulse" : ""}`}>
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <Card
          className={`absolute w-full h-full backface-hidden p-6 flex flex-col justify-center items-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow ${
            isFlipped ? "invisible" : ""
          }`}
        >
          <h2 className="text-2xl font-bold mb-4 animate-fade-in">{card.term}</h2>
          <div className="flex items-center">
            <p className="text-center text-muted-foreground mr-2">Click to reveal</p>
            <div onClick={(e) => e.stopPropagation()}>
              <TextToSpeech text={card.term} />
            </div>
          </div>
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
              onClick={handleEdit}
            >
              <Edit size={14} />
              <span className="sr-only">Edit</span>
            </Button>
          )}
        </Card>

        {/* Back of card */}
        <Card
          className={`absolute w-full h-full backface-hidden p-6 rotate-y-180 overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
            !isFlipped ? "invisible" : ""
          }`}
        >
          <div className="flex flex-col h-full animate-fade-in">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Definition:</p>
                <p>{card.definition}</p>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <TextToSpeech text={card.definition} className="ml-2 flex-shrink-0" />
              </div>
            </div>

            <div className="flex-grow relative">
              <div className="relative h-[200px] w-full rounded-md overflow-hidden">
                <Image src={imageUrl || "/placeholder.svg"} alt={card.term} fill className="object-cover" />
                {isGeneratingImage && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${themeColors.gradient} animate-gradient-x flex items-center justify-center rounded-md`}
                  >
                    <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">Image prompt:</p>
              <p className="text-xs italic">{card.imagePrompt}</p>
              <div className="mt-2 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 hover:scale-105 transition-transform"
                  onClick={regenerateImage}
                  disabled={isGeneratingImage}
                >
                  <RefreshCw size={14} className={isGeneratingImage ? "animate-spin" : ""} />
                  Regenerate Image
                </Button>
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 hover:scale-105 transition-transform"
                    onClick={handleEdit}
                    style={{
                      borderColor: themeColors.primary,
                      color: themeColors.primary,
                    }}
                  >
                    <Edit size={14} />
                    Edit Card
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

