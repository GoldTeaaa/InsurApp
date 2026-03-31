import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

type Props = {
    value: readonly string[]
}

export default function Toggle({
  value,
}: Props) {
  return (
    <ToggleGroup variant="outline" type="single" defaultValue="all">
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
