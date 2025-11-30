"use client"

import * as React from "react"
import {
  Moon, Sun, Plus, Settings, User, CreditCard, LogOut, Check, Info, AlertCircle,
  Palette, Type, MousePointer, Tag, Square, FormInput, ChevronDown, Circle,
  LayoutList, ChevronsUpDown, Maximize2, Menu, Loader, Minus, MessageSquare
} from "lucide-react"
import { cn } from "../lib/utils"

import { Button } from "./button"
import { Badge } from "./badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
import { Input } from "./input"
import { Label } from "./label"
import { Checkbox } from "./checkbox"
import { Switch } from "./switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Progress } from "./progress"
import { Skeleton } from "./skeleton"
import { Separator } from "./separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

// Navigation sections
const SECTIONS = [
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'buttons', label: 'Buttons', icon: MousePointer },
  { id: 'badges', label: 'Badges', icon: Tag },
  { id: 'cards', label: 'Cards', icon: Square },
  { id: 'forms', label: 'Form Elements', icon: FormInput },
  { id: 'select', label: 'Select', icon: ChevronDown },
  { id: 'radio', label: 'Radio Group', icon: Circle },
  { id: 'tabs', label: 'Tabs', icon: LayoutList },
  { id: 'accordion', label: 'Accordion', icon: ChevronsUpDown },
  { id: 'dialog', label: 'Dialog', icon: Maximize2 },
  { id: 'dropdown', label: 'Dropdown Menu', icon: Menu },
  { id: 'avatar', label: 'Avatar', icon: User },
  { id: 'progress', label: 'Progress', icon: Loader },
  { id: 'alerts', label: 'Alerts', icon: AlertCircle },
  { id: 'separator', label: 'Separator', icon: Minus },
  { id: 'tooltip', label: 'Tooltip', icon: MessageSquare },
  { id: 'skeleton', label: 'Skeleton', icon: Loader },
] as const

type SectionId = typeof SECTIONS[number]['id']

export interface FontConfig {
  name: string
  family: string
}

export type ThemeMode = 'light' | 'dark' | 'both'

export interface ShowcaseProps {
  styleName?: string
  styleDescription?: string
  headerExtra?: React.ReactNode
  fonts?: {
    sans?: FontConfig
    heading?: FontConfig
    mono?: FontConfig
  }
  themeMode?: ThemeMode
}

export function Showcase({
  styleName = "Midnight Aurora",
  styleDescription = "Token Atelier Component Showcase",
  headerExtra,
  fonts = {
    sans: { name: 'Work Sans', family: 'font-sans' },
    heading: { name: 'Aboreto', family: 'font-heading' },
    mono: { name: 'JetBrains Mono', family: 'font-mono' },
  },
  themeMode = 'both'
}: ShowcaseProps) {
  // For single-mode themes, force the appropriate mode
  const defaultDark = themeMode === 'light' ? false : true
  const [isDark, setIsDark] = React.useState(defaultDark)
  const [activeSection, setActiveSection] = React.useState<SectionId>('colors')
  const [progress] = React.useState(66)

  // Reset dark mode when themeMode changes
  React.useEffect(() => {
    if (themeMode === 'light') {
      setIsDark(false)
    } else if (themeMode === 'dark') {
      setIsDark(true)
    }
  }, [themeMode])

  React.useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [isDark])

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-semibold">{styleName}</h1>
              <p className="text-sm text-muted-foreground">{styleDescription}</p>
            </div>
            <div className="flex items-center gap-4">
              {headerExtra}
              {themeMode === 'both' && (
                <>
                  <span className="text-sm text-muted-foreground">Theme:</span>
                  <Button variant="outline" size="sm" onClick={() => setIsDark(!isDark)}>
                    {isDark ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                    {isDark ? "Light Mode" : "Dark Mode"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Left Sidebar Navigation */}
          <aside className="w-56 border-r bg-card/50 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="p-3 space-y-1">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <section.icon className="h-4 w-4" />
                  {section.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content - Shows one section at a time */}
          <main className="flex-1 p-8">
            {activeSection === 'colors' && <ColorPaletteSection />}
            {activeSection === 'typography' && <TypographySection fonts={fonts} />}
            {activeSection === 'buttons' && <ButtonsSection />}
            {activeSection === 'badges' && <BadgesSection />}
            {activeSection === 'cards' && <CardsSection />}
            {activeSection === 'forms' && <FormElementsSection />}
            {activeSection === 'select' && <SelectSection />}
            {activeSection === 'radio' && <RadioGroupSection />}
            {activeSection === 'tabs' && <TabsSection />}
            {activeSection === 'accordion' && <AccordionSection />}
            {activeSection === 'dialog' && <DialogSection />}
            {activeSection === 'dropdown' && <DropdownMenuSection />}
            {activeSection === 'avatar' && <AvatarSection />}
            {activeSection === 'progress' && <ProgressSection progress={progress} />}
            {activeSection === 'alerts' && <AlertsSection />}
            {activeSection === 'separator' && <SeparatorSection />}
            {activeSection === 'tooltip' && <TooltipSection />}
            {activeSection === 'skeleton' && <SkeletonSection />}
          </main>
        </div>

        {/* Footer */}
        <footer className="border-t">
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              {styleName} - Premium style guide by <strong>Token Atelier</strong>
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Badge variant="outline">20 Components</Badge>
              <Badge variant="outline">Radix UI</Badge>
              <Badge variant="outline">Tailwind CSS</Badge>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}

// Section Components

function SectionWrapper({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}

function ColorPaletteSection() {
  return (
    <SectionWrapper title="Color Palette" description="Theme color tokens">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {[
          { name: "Primary", color: "bg-primary", label: "Brand Color" },
          { name: "Secondary", color: "bg-secondary", label: "Supporting" },
          { name: "Accent", color: "bg-accent", label: "Highlight" },
          { name: "Muted", color: "bg-muted border", label: "Subtle BG" },
          { name: "Destructive", color: "bg-destructive", label: "Error" },
          { name: "Card", color: "bg-card border", label: "Surface" },
        ].map((item) => (
          <div key={item.name} className="space-y-2">
            <div className={`h-20 rounded-lg ${item.color}`} />
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="font-mono text-xs text-muted-foreground">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}

function TypographySection({ fonts }: { fonts: ShowcaseProps['fonts'] }) {
  return (
    <SectionWrapper title="Typography" description="Heading and body text styles with font families">
      <div className="space-y-10">
        {/* Headings */}
        <div>
          <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">Headings</h3>
          <p className="mb-6 font-mono text-xs text-muted-foreground/70">
            {fonts?.heading?.family}: "{fonts?.heading?.name}"
          </p>
          <div className="space-y-4">
            <div className="flex items-baseline gap-4">
              <span className="w-20 font-mono text-xs text-muted-foreground">text-4xl</span>
              <h1 className="text-4xl font-bold tracking-tight">The quick brown fox</h1>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="w-20 font-mono text-xs text-muted-foreground">text-3xl</span>
              <h2 className="text-3xl font-semibold tracking-tight">The quick brown fox</h2>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="w-20 font-mono text-xs text-muted-foreground">text-2xl</span>
              <h3 className="text-2xl font-semibold">The quick brown fox</h3>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="w-20 font-mono text-xs text-muted-foreground">text-xl</span>
              <h4 className="text-xl font-semibold">The quick brown fox</h4>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="w-20 font-mono text-xs text-muted-foreground">text-lg</span>
              <h5 className="text-lg font-semibold">The quick brown fox</h5>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="w-20 font-mono text-xs text-muted-foreground">text-base</span>
              <h6 className="text-base font-semibold">The quick brown fox</h6>
            </div>
          </div>
        </div>

        {/* Body Text */}
        <div>
          <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">Body Text</h3>
          <p className="mb-6 font-mono text-xs text-muted-foreground/70">
            {fonts?.sans?.family}: "{fonts?.sans?.name}"
          </p>
          <div className="max-w-2xl space-y-4">
            <div className="flex items-start gap-4">
              <span className="w-20 shrink-0 font-mono text-xs text-muted-foreground pt-1">text-lg</span>
              <p className="text-lg leading-relaxed">
                Large text for introductions and emphasis. The quick brown fox jumps over the lazy dog.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-20 shrink-0 font-mono text-xs text-muted-foreground pt-1">text-base</span>
              <p className="text-base">
                Default body text for general content. The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-20 shrink-0 font-mono text-xs text-muted-foreground pt-1">text-sm</span>
              <p className="text-sm text-muted-foreground">
                Small muted text for captions, descriptions, and secondary information. The quick brown fox jumps over the lazy dog.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-20 shrink-0 font-mono text-xs text-muted-foreground pt-1">text-xs</span>
              <p className="text-xs text-muted-foreground">
                Extra small text for labels and metadata.
              </p>
            </div>
          </div>
        </div>

        {/* Font Weights */}
        <div>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">Font Weights</h3>
          <div className="space-y-2">
            <div className="flex items-baseline gap-4">
              <span className="w-20 font-mono text-xs text-muted-foreground">light</span>
              <p className="font-light">The quick brown fox jumps over the lazy dog</p>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="w-20 font-mono text-xs text-muted-foreground">normal</span>
              <p className="font-normal">The quick brown fox jumps over the lazy dog</p>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="w-20 font-mono text-xs text-muted-foreground">medium</span>
              <p className="font-medium">The quick brown fox jumps over the lazy dog</p>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="w-20 font-mono text-xs text-muted-foreground">semibold</span>
              <p className="font-semibold">The quick brown fox jumps over the lazy dog</p>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="w-20 font-mono text-xs text-muted-foreground">bold</span>
              <p className="font-bold">The quick brown fox jumps over the lazy dog</p>
            </div>
          </div>
        </div>

        {/* Monospace */}
        <div>
          <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">Monospace</h3>
          <p className="mb-6 font-mono text-xs text-muted-foreground/70">
            {fonts?.mono?.family}: "{fonts?.mono?.name}"
          </p>
          <div className="space-y-3">
            <p className="font-mono text-sm">const greeting = "Hello, World!";</p>
            <p className="font-mono text-sm text-muted-foreground">// Code comments and technical text</p>
            <code className="rounded bg-muted px-2 py-1 font-mono text-sm">inline code snippet</code>
          </div>
        </div>

        {/* Text Colors */}
        <div>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">Text Colors</h3>
          <div className="space-y-2">
            <div className="flex items-baseline gap-4">
              <span className="w-32 font-mono text-xs text-muted-foreground">foreground</span>
              <p className="text-foreground">Primary text color</p>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="w-32 font-mono text-xs text-muted-foreground">muted-foreground</span>
              <p className="text-muted-foreground">Secondary text color</p>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="w-32 font-mono text-xs text-muted-foreground">primary</span>
              <p className="text-primary">Accent text color</p>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="w-32 font-mono text-xs text-muted-foreground">secondary</span>
              <p className="text-secondary">Alternative accent</p>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="w-32 font-mono text-xs text-muted-foreground">destructive</span>
              <p className="text-destructive">Error text color</p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

function ButtonsSection() {
  return (
    <SectionWrapper title="Buttons" description="Six variants across four sizes">
      <div className="space-y-8">
        <div>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">Variants</h3>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">Sizes</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><Plus className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

function BadgesSection() {
  return (
    <SectionWrapper title="Badges" description="Status indicators and labels">
      <div className="flex flex-wrap gap-3">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </SectionWrapper>
  )
}

function CardsSection() {
  return (
    <SectionWrapper title="Cards" description="Container components with header, content, and footer">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description goes here</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Card content with some example text to show the layout and spacing.</p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button size="sm">Action</Button>
            <Button size="sm" variant="outline">Cancel</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">Jane Doe</p>
                <p className="text-xs text-muted-foreground">Product Designer</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">A simple card with an avatar and user information.</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <CardTitle className="mb-2">Statistics</CardTitle>
            <div className="text-3xl font-bold text-primary">2,847</div>
            <p className="text-sm text-muted-foreground">Total users this month</p>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  )
}

function FormElementsSection() {
  return (
    <SectionWrapper title="Form Elements" description="Inputs, checkboxes, switches, and more">
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="hello@example.com" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Enter your password" />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="notifications" defaultChecked />
          <Label htmlFor="notifications">Enable notifications</Label>
        </div>

        <Button className="w-full">Submit</Button>
      </div>
    </SectionWrapper>
  )
}

function SelectSection() {
  return (
    <SectionWrapper title="Select" description="Dropdown selection with keyboard navigation">
      <div className="max-w-xs space-y-4">
        <div className="space-y-2">
          <Label>Framework</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="next">Next.js</SelectItem>
              <SelectItem value="remix">Remix</SelectItem>
              <SelectItem value="astro">Astro</SelectItem>
              <SelectItem value="vite">Vite</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </SectionWrapper>
  )
}

function RadioGroupSection() {
  return (
    <SectionWrapper title="Radio Group" description="Single selection from a list of options">
      <div className="max-w-md space-y-6">
        <div className="space-y-3">
          <Label>Notification Preferences</Label>
          <RadioGroup defaultValue="all">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="important" id="important" />
              <Label htmlFor="important">Important only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none">None</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </SectionWrapper>
  )
}

function TabsSection() {
  return (
    <SectionWrapper title="Tabs" description="Tabbed navigation for content sections">
      <div className="max-w-lg">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Make changes to your account here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="@janedoe" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notif">Email notifications</Label>
                  <Switch id="email-notif" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing">Marketing emails</Label>
                  <Switch id="marketing" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SectionWrapper>
  )
}

function AccordionSection() {
  return (
    <SectionWrapper title="Accordion" description="Collapsible content panels">
      <div className="max-w-lg">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that match the other components' aesthetic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              Yes. It's animated by default, but you can disable it if you prefer.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </SectionWrapper>
  )
}

function DialogSection() {
  return (
    <SectionWrapper title="Dialog" description="Modal dialogs for important interactions">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dialog-name">Name</Label>
              <Input id="dialog-name" defaultValue="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialog-username">Username</Label>
              <Input id="dialog-username" defaultValue="@janedoe" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SectionWrapper>
  )
}

function DropdownMenuSection() {
  return (
    <SectionWrapper title="Dropdown Menu" description="Contextual menus triggered by buttons">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SectionWrapper>
  )
}

function AvatarSection() {
  return (
    <SectionWrapper title="Avatar" description="User profile images with fallback support">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/vercel.png" />
          <AvatarFallback>VC</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback className="bg-secondary text-secondary-foreground">AS</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback className="bg-accent text-accent-foreground">MK</AvatarFallback>
        </Avatar>
      </div>
    </SectionWrapper>
  )
}

function ProgressSection({ progress }: { progress: number }) {
  return (
    <SectionWrapper title="Progress" description="Progress bars for loading and completion states">
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Complete</span>
            <span className="text-muted-foreground">100%</span>
          </div>
          <Progress value={100} />
        </div>
      </div>
    </SectionWrapper>
  )
}

function AlertsSection() {
  return (
    <SectionWrapper title="Alerts" description="Notification and feedback messages">
      <div className="max-w-2xl space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components to your app using the CLI.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </Alert>
      </div>
    </SectionWrapper>
  )
}

function SeparatorSection() {
  return (
    <SectionWrapper title="Separator" description="Visual dividers for content sections">
      <div className="max-w-md space-y-6">
        <div>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">Horizontal</h3>
          <div className="space-y-4">
            <p className="text-sm">Content above the separator</p>
            <Separator />
            <p className="text-sm">Content below the separator</p>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">Vertical</h3>
          <div className="flex h-8 items-center gap-4">
            <span className="text-sm">Item 1</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Item 2</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Item 3</span>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

function TooltipSection() {
  return (
    <SectionWrapper title="Tooltip" description="Contextual information on hover">
      <div className="flex flex-wrap gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>This is a tooltip</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add new item</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon">
              <User className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View profile</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </SectionWrapper>
  )
}

function SkeletonSection() {
  return (
    <SectionWrapper title="Skeleton" description="Loading placeholders">
      <div className="max-w-md space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Showcase
