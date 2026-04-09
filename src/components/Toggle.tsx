import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

type Props = {
  value: string;
  options: readonly string[]
  handleChange: (value: string) => void;
}

export default function Toggle({
  value,
  options,
  handleChange
}: Props) {
  return (
    <ToggleGroup
      variant="outline"
      type="single"
      value={value}
      onValueChange={(value) => handleChange(value)}
    >
      {
        options.map((opt) => (
          <ToggleGroupItem key={opt} value={opt} aria-label={`Toggle ${opt}`}>
            {opt}
          </ToggleGroupItem>
        ))
      }
      {/* <ToggleGroupItem value="all" aria-label="Toggle all">
        All
      </ToggleGroupItem>
      <ToggleGroupItem value="missed" aria-label="Toggle missed">
        Missed
      </ToggleGroupItem> */}
    </ToggleGroup>
  )
}
