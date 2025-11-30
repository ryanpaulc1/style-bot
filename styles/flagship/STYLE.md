# Flagship

Premium dark theme with violet accents and polished gradients. Elegant and professional, perfect for product marketing sites, enterprise dashboards, and premium SaaS applications.

## Quick Start

### For AI Assistants (Claude Code, Cursor, etc.)

Read `manifest.json` for structured installation instructions. The manifest includes:
- Pre-flight checklist to verify project setup
- Version detection for Tailwind v3 vs v4
- Step-by-step installation with verification
- Common mistakes to avoid

### CLI Installation

```bash
npx token-atelier add flagship
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

Flagship embodies premium software design with a sophisticated dark aesthetic. The violet color palette conveys:

- **Authority and luxury** - Violet has historically represented premium brands
- **Modern professionalism** - Clean lines with subtle gradients
- **Focus and clarity** - Dark backgrounds reduce distraction

The theme is optimized for:
- Enterprise and B2B applications
- Product marketing and landing pages
- Admin dashboards and control panels
- Premium SaaS products

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `hsl(240 20% 4%)` | Deep dark background |
| `foreground` | `hsl(0 0% 98%)` | Primary text |
| `primary` | `hsl(262 83% 66%)` | Primary actions, links |
| `secondary` | `hsl(262 30% 25%)` | Secondary elements |
| `accent` | `hsl(262 83% 76%)` | Highlights, accents |
| `muted` | `hsl(240 10% 12%)` | Subtle backgrounds |
| `destructive` | `hsl(0 84% 60%)` | Error states |
| `border` | `hsl(240 4% 16%)` | Borders, dividers |
| `card` | `hsl(240 17% 8%)` | Card backgrounds |

## Typography

- **Sans**: Inter - Clean, modern, highly readable
- **Mono**: JetBrains Mono - Developer-friendly monospace

## Components Included

All 22 components from the Token Atelier library, styled with the Flagship violet palette and 0.75rem border radius for a polished look.

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
