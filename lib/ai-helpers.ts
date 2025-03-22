"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function generateImagePrompt(term: string, definition: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Create a detailed image prompt that would help visualize the concept: "${term}".
               Definition: "${definition}"
               The image prompt should be descriptive, vivid, and help with memory retention.
               Keep the prompt under 100 words and focus on visual elements.`,
    })

    return text.trim()
  } catch (error) {
    console.error("Error generating image prompt:", error)
    return `Visualization of ${term}: ${definition}`
  }
}

export async function generateImage(prompt: string): Promise<string> {
  try {
    // Use Hugging Face's Stable Diffusion API for image generation
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: "blurry, bad quality, distorted, deformed",
            num_inference_steps: 30,
            guidance_scale: 7.5,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`)
    }

    // The response is a binary blob (the image)
    const imageBlob = await response.blob()

    // Convert the blob to a base64 string
    const arrayBuffer = await imageBlob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Image = buffer.toString("base64")

    // Return as a data URL that can be used in an <img> tag
    return `data:image/jpeg;base64,${base64Image}`
  } catch (error) {
    console.error("Error generating image:", error)
    return `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(prompt.substring(0, 20))}...`
  }
}

