import { useState, useEffect } from 'react'
import { availableStyles, defaultStyleId } from './styles.config'

const STORAGE_KEY = 'token-atelier-selected-style'

export function useStyleLoader() {
  const [currentStyleId, setCurrentStyleId] = useState<string>(() => {
    // Check localStorage for saved preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && availableStyles.find(s => s.id === saved)) {
        return saved
      }
    }
    return defaultStyleId
  })

  const currentStyle = availableStyles.find(s => s.id === currentStyleId) || availableStyles[0]

  useEffect(() => {
    // Load the style's CSS dynamically
    // Remove any existing dynamic style link
    const existingLink = document.getElementById('dynamic-style-tokens')
    if (existingLink) {
      existingLink.remove()
    }

    // Create new link element for the style's tokens
    const link = document.createElement('link')
    link.id = 'dynamic-style-tokens'
    link.rel = 'stylesheet'
    link.href = currentStyle.tokensPath

    document.head.appendChild(link)
  }, [currentStyle])

  const selectStyle = (styleId: string) => {
    localStorage.setItem(STORAGE_KEY, styleId)
    setCurrentStyleId(styleId)
  }

  return {
    currentStyle,
    availableStyles,
    selectStyle,
  }
}
