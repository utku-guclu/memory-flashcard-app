"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { generateImagePrompt } from "@/lib/ai-helpers"
import Image from "next/image"
import { RefreshCw } from "lucide-react"

interface EditCardFormProps {
  card: {
    id: number
    term: string
    definition: string
    imagePrompt: string
    imageUrl: string
  }
  onSubmit: (card: any) => void
  onCancel: () => void
}

export function EditCardForm({ card, onSubmit, onCancel }: EditCardFormProps) {
  const [term, setTerm] = useState(card.term)
  const [definition, setDefinition] = useState(card.definition)
  const [imagePrompt, setImagePrompt] = useState(card.imagePrompt)
  const [imageUrl, setImageUrl] = useState(card.imageUrl)
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit({
        id: card.id,
        term,
        definition,
        imagePrompt,
        imageUrl,
      })
    } catch (error) {
      console.error("Error updating card:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGeneratePrompt = async () => {
    if (!term || !definition) return

    setIsGeneratingPrompt(true)

    try {
      const prompt = await generateImagePrompt(term, definition)
      setImagePrompt(prompt)
    } catch (error) {
      console.error("Error generating prompt:", error)
    } finally {
      setIsGeneratingPrompt(false)
    }
  }

  const regenerateImage = async () => {
    if (!imagePrompt) return

    setIsGeneratingImage(true)

    try {
      const response = await fetch("/api/regenerate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: imagePrompt }),
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

  return (
    <div className={isSubmitting ? "animate-pulse" : ""}>
      <h3 className="text-xl font-semibold mb-4">Edit Flashcard</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="term" className="text-sm font-medium">
            Term
          </Label>
          <Input
            id="term"
            placeholder="Enter the term or concept"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            required
            className="rounded-md focus:ring-2 focus:ring-[#5E5CEC] transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="definition" className="text-sm font-medium">
            Definition
          </Label>
          <Textarea
            id="definition"
            placeholder="Enter the definition or explanation"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            rows={3}
            required
            className="rounded-md focus:ring-2 focus:ring-[#5E5CEC] transition-all"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="imagePrompt" className="text-sm font-medium">
              Image Prompt
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGeneratePrompt}
              disabled={isGeneratingPrompt || !term || !definition}
              className={`text-xs hover:scale-105 transition-transform ${
                isGeneratingPrompt
                  ? "bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 animate-gradient-x text-white"
                  : ""
              }`}
            >
              {isGeneratingPrompt ? (
                <>
                  <span className="mr-2">Generating...</span>
                  <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                "Generate Prompt"
              )}
            </Button>
          </div>
          <Textarea
            id="imagePrompt"
            placeholder="Enter a prompt to generate an image that helps visualize this concept"
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            rows={3}
            required
            className="rounded-md focus:ring-2 focus:ring-[#5E5CEC] transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Current Image</Label>
          <div className="relative h-[200px] w-full rounded-md overflow-hidden border border-gray-200">
            <Image src={imageUrl || "/placeholder.svg"} alt={term} fill className="object-cover" />
            {isGeneratingImage && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 animate-gradient-x flex items-center justify-center">
                <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={regenerateImage}
            disabled={isGeneratingImage || !imagePrompt}
            className="mt-2 w-full flex items-center justify-center gap-2 hover:scale-105 transition-transform"
          >
            <RefreshCw size={14} className={isGeneratingImage ? "animate-spin" : ""} />
            Regenerate Image
          </Button>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="rounded-md hover:scale-105 transition-transform"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!term || !definition || !imagePrompt || isSubmitting}
            className={`rounded-md hover:scale-105 transition-transform ${
              isSubmitting
                ? "bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 animate-gradient-x"
                : "bg-[#5E5CEC] hover:bg-[#4F46E5]"
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Saving...</span>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

