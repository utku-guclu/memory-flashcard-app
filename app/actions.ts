"use server"

import { generateImage } from "@/lib/ai-helpers"

export async function createCard(formData: FormData) {
  const term = formData.get("term") as string
  const definition = formData.get("definition") as string
  const imagePrompt = formData.get("imagePrompt") as string

  try {
    // Generate image based on the prompt using Hugging Face
    const imageUrl = await generateImage(imagePrompt)

    // In a real app, you would save this to a database
    return {
      id: Date.now(),
      term,
      definition,
      imagePrompt,
      imageUrl,
    }
  } catch (error) {
    console.error("Error creating card:", error)
    throw new Error("Failed to create card")
  }
}

