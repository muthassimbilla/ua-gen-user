"use client"

import { useState, useEffect } from "react"

interface TextAnimationProps {
  words: string[]
  className?: string
  letterDelay?: number
  wordDelay?: number
}

export default function TextAnimation({ 
  words, 
  className = "", 
  letterDelay = 100,
  wordDelay = 3000
}: TextAnimationProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Animation effect
  useEffect(() => {
    if (words.length <= 1) return

    const interval = setInterval(() => {
      // Hide current text
      setIsVisible(false)
      
      // After hide animation, show next word
      setTimeout(() => {
        setCurrentWordIndex(prev => (prev + 1) % words.length)
        setIsVisible(true)
      }, 300)
    }, wordDelay)

    return () => clearInterval(interval)
  }, [words, wordDelay])

  return (
    <div 
      className={`${className} transition-all duration-300 ease-in-out ${
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform -translate-y-5'
      }`}
    >
      {words[currentWordIndex]}
    </div>
  )
}
