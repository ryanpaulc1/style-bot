# Chromatic Glow

Dreamy gradients with pink, purple, and mint accents. Playful and modern aesthetic perfect for creative portfolios, music apps, and Gen-Z focused products. Features soft, pill-shaped components with tri-color gradient buttons.

## Quick Start

### For AI Assistants (Claude Code, Cursor, etc.)

Read `manifest.json` for structured installation instructions. The manifest includes:
- Pre-flight checklist to verify project setup
- Version detection for Tailwind v3 vs v4
- Step-by-step installation with verification
- Common mistakes to avoid

### CLI Installation

```bash
npx token-atelier add chromatic-glow
```

### Detect Your Tailwind Version

Check your `package.json` for the `tailwindcss` version:
- Version `3.x` → Follow **Tailwind v3** instructions below
- Version `4.x` → Follow **Tailwind v4** instructions below

---

### Manual Installation (Tailwind v3)

1. **Copy utility function**
   ```bash
   cp lib/utils.ts src/lib/utils.ts
   ```

2. **Compose globals.css** from `shared/base.v3.css` + `tokens.v3.css`

3. **Extend Tailwind config** - Merge `tailwind.config.patch.js` into your config

4. **Copy components**
   ```bash
   cp -r components/* src/components/ui/
   ```

5. **Install dependencies**
   ```bash
   npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-accordion @radix-ui/react-avatar @radix-ui/react-tooltip @radix-ui/react-progress @radix-ui/react-label @radix-ui/react-separator class-variance-authority clsx tailwind-merge lucide-react
   ```

6. **Import globals.css** in your app entry point

---

### Manual Installation (Tailwind v4)

1. **Copy utility function**
   ```bash
   cp lib/utils.ts src/lib/utils.ts
   ```

2. **Compose globals.css** from `shared/base.v4.css` + `tokens.v4.css`

3. **Verify PostCSS config** uses `@tailwindcss/postcss`

4. **Copy components**
   ```bash
   cp -r components/* src/components/ui/
   ```

5. **Install dependencies**
   ```bash
   npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-accordion @radix-ui/react-avatar @radix-ui/react-tooltip @radix-ui/react-progress @radix-ui/react-label @radix-ui/react-separator class-variance-authority clsx tailwind-merge lucide-react @tailwindcss/postcss
   ```

6. **Import globals.css** in your app entry point

## Design Philosophy

Chromatic Glow embraces bold, expressive design with its vibrant gradient palette. The pink, purple, and mint colors convey:

- **Creativity** - Playful, artistic expression
- **Modernity** - Fresh, Gen-Z aesthetic
- **Energy** - Vibrant, dynamic feeling
- **Fun** - Approachable and engaging

The theme is optimized for:
- Creative portfolios and agencies
- Music and entertainment apps
- Social media and content platforms
- Gaming and interactive experiences
- Gen-Z focused products

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `hsl(320 10% 9%)` | Deep dark with warm undertone |
| `foreground` | `hsl(20 23% 97%)` | Soft warm white text |
| `primary` | `hsl(262 86% 76%)` | Vibrant purple |
| `secondary` | `hsl(336 70% 69%)` | Bold pink |
| `accent` | `hsl(165 52% 66%)` | Fresh mint |
| `muted` | `hsl(320 8% 15%)` | Subtle warm dark |
| `destructive` | `hsl(336 70% 69%)` | Error pink |

## Typography

- **Sans**: Nunito - Rounded, friendly sans-serif
- **Heading**: Nunito - Playful, approachable headings
- **Mono**: JetBrains Mono - Developer-friendly monospace

## Components Included

All 22 components from the Token Atelier library, styled with pill-shaped 1.5rem border radius for a soft, playful look. Features tri-color gradient effects on interactive elements.

## Preview

Add the Showcase component as a route to preview all components:

```tsx
import { Showcase } from '@/components/ui/showcase'

export default function ShowcasePage() {
  return <Showcase />
}
```

## License

MIT License - Use freely in personal and commercial projects.

---

**Token Atelier** - Premium style guides for React + Tailwind projects
