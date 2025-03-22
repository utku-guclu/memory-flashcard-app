"use client"

import { useState, useEffect } from "react"
import { FlashcardView } from "@/components/flashcard-view"
import { CreateCardForm } from "@/components/create-card-form"
import { EditCardForm } from "@/components/edit-card-form"
import { SettingsPanel } from "@/components/settings-panel"
import { Button } from "@/components/ui/button"
import { PlusCircle, BookOpen, Settings, Edit, Trash2 } from "lucide-react"
import { createCard } from "./actions"

export default function Home() {
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingCard, setEditingCard] = useState<{
    id: number;
    term: string;
    definition: string;
    imagePrompt: string;
    imageUrl: string;
  } | null>(null)
  const [isStudying, setIsStudying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [theme, setTheme] = useState("purple")
  
  // Load cards from localStorage on initial render
  const [cards, setCards] = useState<Array<{
    id: number;
    term: string;
    definition: string;
    imagePrompt: string;
    imageUrl: string;
  }>>(() => {
    if (typeof window !== 'undefined') {
      const savedCards = localStorage.getItem('flashcards-data')
      return savedCards ? JSON.parse(savedCards) : [
        {
          id: 1,
          term: "Photosynthesis",
          definition: "The process by which plants convert light energy into chemical energy",
          imagePrompt: "A plant absorbing sunlight and converting it to energy, with glowing green leaves",
          imageUrl: "./placeholder.svg?height=300&width=400",
        },
        {
          id: 2,
          term: "Mitosis",
          definition: "The process of cell division resulting in two identical daughter cells",
          imagePrompt: "A cell dividing into two identical cells, with DNA strands visible",
          imageUrl: "./placeholder.svg?height=300&width=400",
        },
      ]
    }
    return []
  })

  // Save cards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('flashcards-data', JSON.stringify(cards))
  }, [cards])

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("flashcards-theme")
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  // Get theme colors based on selected theme
  const getThemeColors = () => {
    switch (theme) {
      case "blue":
        return {
          primary: "#3B82F6",
          gradient: "from-blue-600 via-cyan-500 to-blue-600",
          hover: "#2563EB",
        }
      case "green":
        return {
          primary: "#10B981",
          gradient: "from-green-600 via-emerald-500 to-green-600",
          hover: "#059669",
        }
      case "orange":
        return {
          primary: "#F97316",
          gradient: "from-orange-600 via-amber-500 to-orange-600",
          hover: "#EA580C",
        }
      case "pink":
        return {
          primary: "#EC4899",
          gradient: "from-pink-600 via-rose-500 to-pink-600",
          hover: "#DB2777",
        }
      default: // purple
        return {
          primary: "#5E5CEC",
          gradient: "from-purple-600 via-indigo-500 to-purple-600",
          hover: "#4F46E5",
        }
    }
  }

  const themeColors = getThemeColors()

  const addCard = async (cardData: { term: string; definition: string; imagePrompt: string }) => {
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("term", cardData.term)
      formData.append("definition", cardData.definition)
      formData.append("imagePrompt", cardData.imagePrompt)

      const newCard = await createCard(formData)
      setCards([...cards, newCard])
      setIsCreating(false)
    } catch (error) {
      console.error("Error adding card:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateCard = async (updatedCard: { 
    id: number;
    term: string;
    definition: string;
    imagePrompt: string;
    imageUrl: string;
  }) => {
    setIsLoading(true)

    try {
      // In a real app, you would call a server action to update the card
      // For now, we'll just update it in the state
      const updatedCards = cards.map((card) =>
        card.id === updatedCard.id
          ? { ...updatedCard } 
          : card
      )

      setCards(updatedCards)
      setIsEditing(false)
      setEditingCard(null)
    } catch (error) {
      console.error("Error updating card:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCard = (id: number) => {
    setCards(cards.filter((card) => card.id !== id))
  }

  const startEditing = (card: { id: number; term: string; definition: string; imagePrompt: string; imageUrl: string }) => {
    setEditingCard(card)
    setIsEditing(true)
  }

  const startStudying = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsStudying(true)
      setCurrentCardIndex(0)
      setIsLoading(false)
    }, 500)
  }

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    } else {
      // End of deck
      setIsStudying(false)
    }
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    localStorage.setItem("flashcards-theme", newTheme)
  }

  if (isStudying) {
    return (
      <div className="animate-fade-in">
        <FlashcardView
          cards={cards}
          currentIndex={currentCardIndex}
          onNext={nextCard}
          onExit={() => setIsStudying(false)}
          themeColors={themeColors}
          isLoading={isLoading}
        />
      </div>
    )
  }

  return (
    <main
      className={`min-h-screen py-8 px-4 transition-all duration-500 ${
        isLoading ? `bg-gradient-to-r ${themeColors.gradient} animate-gradient-x` : ""
      }`}
      style={{ backgroundColor: isLoading ? "" : themeColors.primary }}
    >
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 text-white">Memory Flashcards</h1>
          <p className="text-white/80">Create flashcards with AI-generated images</p>
        </div>

        {isCreating ? (
          <div className="bg-white rounded-2xl p-6 shadow-lg animate-fade-in">
            <CreateCardForm onSubmit={addCard} onCancel={() => setIsCreating(false)} />
          </div>
        ) : isEditing && editingCard ? (
          <div className="bg-white rounded-2xl p-6 shadow-lg animate-fade-in">
            <EditCardForm
              card={editingCard}
              onSubmit={updateCard}
              onCancel={() => {
                setIsEditing(false)
                setEditingCard(null)
              }}
            />
          </div>
        ) : showSettings ? (
          <div className="bg-white rounded-2xl p-6 shadow-lg animate-fade-in">
            <SettingsPanel
              currentTheme={theme}
              onThemeChange={handleThemeChange}
              onClose={() => setShowSettings(false)}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Flashcards</h2>
                <span className="text-sm text-gray-500">{cards.length} cards</span>
              </div>

              <div className="space-y-3">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{card.term}</p>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full"
                          onClick={() => startEditing(card)}
                        >
                          <Edit size={14} />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteCard(card.id)}
                        >
                          <Trash2 size={14} />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {cards.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No flashcards yet. Create your first card!</p>
                )}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  onClick={startStudying}
                  disabled={isLoading || cards.length === 0}
                  style={
                    {
                      backgroundColor: isLoading ? "" : themeColors.primary,
                      "--hover-color": themeColors.hover,
                    } as any
                  }
                  className={`flex items-center justify-center gap-2 hover:scale-105 transition-all hover:bg-[--hover-color] ${
                    isLoading ? `bg-gradient-to-r ${themeColors.gradient} animate-gradient-x` : ""
                  }`}
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <BookOpen size={16} />
                      Study Now
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setIsCreating(true)}
                  variant="outline"
                  className="flex items-center justify-center gap-2 hover:scale-105 transition-all"
                >
                  <PlusCircle size={16} />
                  Add Card
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Settings</h3>
                  <p className="text-sm text-gray-500">Customize your experience</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:rotate-45 transition-transform duration-300"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings size={20} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
