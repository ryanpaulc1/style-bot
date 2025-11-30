// Available styles for the preview app
// Add new styles here as they're created

export interface FontConfig {
  name: string
  family: string
}

export type ThemeMode = 'light' | 'dark' | 'both'

export interface StyleConfig {
  id: string
  name: string
  description: string
  tokensPath: string
  mode: ThemeMode
  fonts: {
    sans: FontConfig
    heading: FontConfig
    mono: FontConfig
  }
}

export const availableStyles: StyleConfig[] = [
  {
    id: 'midnight-aurora',
    name: 'Midnight Aurora',
    description: 'Dark theme with aurora-inspired teal, purple, and pink accents',
    tokensPath: '/styles/midnight-aurora/tokens.v4.css',
    mode: 'both',
    fonts: {
      sans: { name: 'Work Sans', family: 'font-sans' },
      heading: { name: 'Aboreto', family: 'font-heading' },
      mono: { name: 'JetBrains Mono', family: 'font-mono' },
    },
  },
  {
    id: 'flagship',
    name: 'Flagship',
    description: 'Premium dark theme with violet accents and polished gradients',
    tokensPath: '/styles/flagship/tokens.v4.css',
    mode: 'dark',
    fonts: {
      sans: { name: 'Inter', family: 'font-sans' },
      heading: { name: 'Inter', family: 'font-heading' },
      mono: { name: 'JetBrains Mono', family: 'font-mono' },
    },
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Hacker CLI aesthetic with phosphor green and CRT glow',
    tokensPath: '/styles/terminal/tokens.v4.css',
    mode: 'dark',
    fonts: {
      sans: { name: 'JetBrains Mono', family: 'font-sans' },
      heading: { name: 'JetBrains Mono', family: 'font-heading' },
      mono: { name: 'JetBrains Mono', family: 'font-mono' },
    },
  },
  {
    id: 'warmth',
    name: 'Warmth',
    description: 'Soft, approachable light theme with terracotta tones',
    tokensPath: '/styles/warmth/tokens.v4.css',
    mode: 'light',
    fonts: {
      sans: { name: 'Outfit', family: 'font-sans' },
      heading: { name: 'Outfit', family: 'font-heading' },
      mono: { name: 'JetBrains Mono', family: 'font-mono' },
    },
  },
  {
    id: 'chromatic-glow',
    name: 'Chromatic Glow',
    description: 'Dreamy gradients with pink, purple, and mint accents',
    tokensPath: '/styles/chromatic-glow/tokens.v4.css',
    mode: 'dark',
    fonts: {
      sans: { name: 'Nunito', family: 'font-sans' },
      heading: { name: 'Nunito', family: 'font-heading' },
      mono: { name: 'JetBrains Mono', family: 'font-mono' },
    },
  },
]

export const defaultStyleId = 'midnight-aurora'
