# Terminal

Hacker CLI aesthetic with phosphor green and CRT glow. Perfect for developer tools, coding platforms, and cyberpunk-inspired applications. Monospace everything with sharp, minimal styling.

## Quick Start

### For AI Assistants (Claude Code, Cursor, etc.)

Read `manifest.json` for structured installation instructions. The manifest includes:
- Pre-flight checklist to verify project setup
- Version detection for Tailwind v3 vs v4
- Step-by-step installation with verification
- Common mistakes to avoid

### CLI Installation

```bash
npx token-atelier add terminal
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

Terminal captures the nostalgic aesthetic of CRT monitors and command-line interfaces. The phosphor green palette evokes:

- **Hacker culture** - Authentic CLI and terminal vibes
- **Technical credibility** - Appeals to developers and power users
- **Retro-futurism** - CRT glow effects with modern functionality
- **Focus** - Minimal distractions, maximum productivity

The theme is optimized for:
- Developer tools and IDEs
- Coding platforms and playgrounds
- DevOps dashboards and monitoring
- Cyberpunk-inspired applications

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `hsl(0 0% 5%)` | Near-black CRT background |
| `foreground` | `hsl(144 100% 50%)` | Phosphor green text |
| `primary` | `hsl(144 100% 50%)` | Primary actions, links |
| `secondary` | `hsl(144 100% 20%)` | Dimmer green elements |
| `accent` | `hsl(144 100% 40%)` | Bright highlights |
| `muted` | `hsl(0 0% 8%)` | Subtle backgrounds |
| `destructive` | `hsl(0 100% 50%)` | Error states |

## Typography

- **Sans**: JetBrains Mono - Monospace everywhere for authentic terminal feel
- **Heading**: JetBrains Mono - Consistent monospace aesthetic
- **Mono**: JetBrains Mono - Developer-friendly monospace

## Components Included

All 22 components from the Token Atelier library, styled with sharp 0.25rem border radius for a minimal, technical look.

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
