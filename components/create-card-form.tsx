"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { generateImagePrompt } from "@/lib/ai-helpers"

interface CreateCardFormProps {
  onSubmit: (card: any) => void
  onCancel: () => void
}

export function CreateCardForm({ onSubmit, onCancel }: CreateCardFormProps) {
  const [term, setTerm] = useState("")
  const [definition, setDefinition] = useState("")
  const [imagePrompt, setImagePrompt] = useState("")
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit({
        term,
        definition,
        imagePrompt,
      })
    } catch (error) {
      console.error("Error submitting form:", error)
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

  return (
    <div className={isSubmitting ? "animate-pulse" : ""}>
      <h3 className="text-xl font-semibold mb-4">Create New Flashcard</h3>
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
                <span className="mr-2">Creating...</span>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              </>
            ) : (
              "Create Card"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

