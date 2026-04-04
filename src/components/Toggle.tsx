import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

type Props = {
  value: readonly string[]
  handleChange: (value: string) => void;
}

export default function Toggle({
  value,
  handleChange
}: Props) {
  return (
    <ToggleGroup
      variant="outline"
      type="single"
      // defaultValue="all"
      onValueChange={(value) => handleChange(value)}
    >
      {
        value.map((val) => (
          <ToggleGroupItem key={val} value={val} aria-label={`Toggle ${val}`}>
            {val}
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
