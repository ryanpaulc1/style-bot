# Token Atelier

Premium style guides for React + Tailwind projects. Stop building UI from scratch - install beautiful, pre-styled component libraries with a single command.

## What is Token Atelier?

Token Atelier provides complete style guides that include:

- **Design Tokens** - Colors, typography, spacing, shadows as CSS variables
- **Styled Components** - 20+ React components built on Radix UI primitives
- **Tailwind Integration** - Ready-to-use with your existing Tailwind setup
- **Showcase Component** - React component to preview all styled components

## Available Styles

| Style | Description | Access |
|-------|-------------|--------|
| **Midnight Aurora** | Dark theme with aurora-inspired accents (teal, purple, pink). Perfect for dashboards and dev tools. | Premium |
| **Flagship** | Premium dark theme with violet accents and polished gradients. Enterprise dashboards and SaaS. | Premium |
| **Terminal** | Hacker CLI aesthetic with phosphor green and CRT glow. Developer tools and cyberpunk apps. | Premium |
| **Warmth** | Soft light theme with terracotta tones. Wellness, lifestyle, and consumer applications. | Premium |
| **Chromatic Glow** | Dreamy gradients with pink, purple, and mint. Creative portfolios and Gen-Z products. | Premium |

## Installation

### CLI (Recommended)

The fastest way to install a style:

```bash
npx token-atelier add midnight-aurora
```

The CLI will:
1. Detect your project configuration (framework, Tailwind version)
2. Check for existing components and handle conflicts
3. Copy all components and CSS tokens
4. Merge Tailwind config (v3) or compose CSS (v4)
5. Install npm dependencies

#### CLI Commands

```bash
# Install a style
npx token-atelier add <style-name>

# List available styles
npx token-atelier list

# Check project compatibility
npx token-atelier doctor

# Authenticate for premium styles
npx token-atelier auth
```

#### CLI Options

```bash
npx token-atelier add midnight-aurora [options]

Options:
  -t, --tailwind <version>  Force Tailwind version (3 or 4)
  --target <dir>            Target directory (default: current)
  --skip-deps               Skip npm dependency installation
  --dry-run                 Preview changes without writing
  -y, --yes                 Skip confirmation prompts
  -f, --force               Overwrite existing files without prompting
```

### Using AI Tools

Tell your AI assistant:

> "Install the Token Atelier midnight-aurora style from https://github.com/token-atelier/token-atelier into my React project"

The AI will read the `manifest.json` and follow structured installation instructions.

### Manual Installation

1. Navigate to the style directory: `styles/midnight-aurora/`
2. Follow instructions in `STYLE.md`
3. Add a route for the Showcase component to preview all components

## File Structure

```
token-atelier/
├── README.md                    # This file
├── packages/
│   └── cli/                     # CLI tool (npx token-atelier)
│       ├── src/
│       │   ├── commands/        # add, list, doctor, auth
│       │   └── lib/             # detect, install, conflicts
│       └── package.json
├── shared/
│   ├── components/              # 22 React components (shared across styles)
│   ├── lib/utils.ts             # cn() utility function
│   ├── base.v3.css              # Base CSS for Tailwind v3
│   ├── base.v4.css              # Base CSS for Tailwind v4
│   └── manifest.template.json   # Shared manifest template
├── styles/
│   ├── midnight-aurora/
│   │   ├── manifest.json        # AI-readable installation spec
│   │   ├── STYLE.md             # Human-readable guide
│   │   ├── style.meta.json      # Style metadata
│   │   ├── tokens.v3.css        # CSS tokens for Tailwind v3
│   │   └── tokens.v4.css        # CSS tokens for Tailwind v4
│   ├── flagship/
│   ├── terminal/
│   ├── warmth/
│   └── chromatic-glow/
└── scripts/
    └── build-manifests.js       # Composes template + metadata → manifest
```

## How It Works

### For AI Assistants

Each style includes a `manifest.json` that provides:

- Installation instructions in structured format
- File mappings (source → target)
- npm dependencies list
- Component metadata and descriptions

This allows AI coding assistants to automatically install styles into your project.

### For Manual Installation

Each style includes a `STYLE.md` with:

- Step-by-step installation guide
- Design philosophy and color palette
- Customization instructions
- Component documentation

## Compatibility

| Requirement | Supported Versions |
|-------------|-------------------|
| **Tailwind CSS** | v3.x and v4.x |
| **React** | 18.0+ |
| **Frameworks** | Next.js, Vite, Remix, CRA |

### Tailwind v3 vs v4

Each style includes version-specific CSS files:
- `globals.v3.css` - Uses `@tailwind` directives + JS config
- `globals.v4.css` - Uses `@import "tailwindcss"` + `@theme inline`

The manifest.json includes version detection instructions so AI assistants can automatically choose the correct files.

## Tech Stack

- **[Radix UI Primitives](https://www.radix-ui.com/primitives)** - Accessible, unstyled components
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first styling (v3 and v4)
- **[Class Variance Authority](https://cva.style/)** - Type-safe variant management
- **TypeScript** - Full type safety

## Pricing

| Plan | Price | What You Get |
|------|-------|--------------|
| **Free** | $0 | Starter Light style + showcases |
| **Single Style** | $39 | One premium style, lifetime access |
| **Pro** | $12/mo | All styles + new releases + updates |
| **Team** | $39/mo | 5 seats + priority support |

## Roadmap

- [x] CLI tool (`npx token-atelier add`)
- [x] 5 premium styles (Midnight Aurora, Flagship, Terminal, Warmth, Chromatic Glow)
- [x] Tailwind v3 and v4 support
- [x] AI-readable manifests for automated installation
- [ ] Free "Starter Light" style
- [ ] MCP Server for native AI integration
- [ ] Web catalog at tokenatelier.dev
- [ ] Figma integration

## Support

- **Documentation**: See `STYLE.md` in each style package
- **Issues**: [GitHub Issues](https://github.com/token-atelier/token-atelier/issues)
- **Email**: hello@tokenatelier.dev

## License

Component code is MIT licensed. See individual style packages for details.

---

**Token Atelier** - Beautiful styles for vibe coders
