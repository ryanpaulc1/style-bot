import { Showcase } from '@shared/components/showcase'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/select'
import { useStyleLoader } from './useStyleLoader'
import { StyleConfig } from './styles.config'

interface StyleSelectorProps {
  currentStyle: StyleConfig
  availableStyles: StyleConfig[]
  onSelectStyle: (id: string) => void
}

function StyleSelector({ currentStyle, availableStyles, onSelectStyle }: StyleSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Style:</span>
      <Select value={currentStyle.id} onValueChange={onSelectStyle}>
        <SelectTrigger className="w-[180px] h-8">
          <SelectValue placeholder="Select style" />
        </SelectTrigger>
        <SelectContent>
          {availableStyles.map((style) => (
            <SelectItem key={style.id} value={style.id}>
              {style.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function App() {
  const { currentStyle, availableStyles, selectStyle } = useStyleLoader()

  return (
    <Showcase
      styleName={currentStyle.name}
      styleDescription={currentStyle.description}
      headerExtra={
        <StyleSelector
          currentStyle={currentStyle}
          availableStyles={availableStyles}
          onSelectStyle={selectStyle}
        />
      }
      fonts={currentStyle.fonts}
      themeMode={currentStyle.mode}
    />
  )
}

export default App
