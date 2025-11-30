# Warmth

Soft, approachable light theme with terracotta tones. Perfect for wellness, lifestyle, and consumer applications. Features warm cream backgrounds with terracotta and olive green accents.

## Quick Start

### For AI Assistants (Claude Code, Cursor, etc.)

Read `manifest.json` for structured installation instructions. The manifest includes:
- Pre-flight checklist to verify project setup
- Version detection for Tailwind v3 vs v4
- Step-by-step installation with verification
- Common mistakes to avoid

### CLI Installation

```bash
npx token-atelier add warmth
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

Warmth creates an inviting, comfortable atmosphere with its earth-toned palette. The terracotta and cream colors convey:

- **Approachability** - Soft, welcoming aesthetic
- **Authenticity** - Natural, organic color choices
- **Comfort** - Warm tones reduce visual harshness
- **Trustworthiness** - Earth tones feel genuine and reliable

The theme is optimized for:
- Wellness and health applications
- Lifestyle and consumer products
- E-commerce and retail
- Food and recipe applications
- Personal blogs and portfolios

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `hsl(36 100% 98%)` | Warm cream background |
| `foreground` | `hsl(34 8% 16%)` | Soft dark text |
| `primary` | `hsl(12 68% 63%)` | Terracotta actions |
| `secondary` | `hsl(34 30% 90%)` | Warm sand elements |
| `accent` | `hsl(93 53% 36%)` | Olive green highlights |
| `muted` | `hsl(34 20% 94%)` | Subtle warm backgrounds |
| `destructive` | `hsl(0 61% 48%)` | Error states |

## Typography

- **Sans**: Outfit - Friendly, modern geometric sans-serif
- **Heading**: Outfit - Consistent warm aesthetic
- **Mono**: JetBrains Mono - Developer-friendly monospace

## Components Included

All 22 components from the Token Atelier library, styled with generous 1.25rem border radius for a soft, friendly appearance.

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
