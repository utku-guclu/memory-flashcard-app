import { NextResponse } from "next/server"
import { generateImage } from "@/lib/ai-helpers"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const imageUrl = await generateImage(prompt)

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Error regenerating image:", error)
    return NextResponse.json({ error: "Failed to regenerate image" }, { status: 500 })
  }
}

