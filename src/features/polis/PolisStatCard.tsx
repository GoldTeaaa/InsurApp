type Props = {
    title: string,
    value: number
}

export default function PolisStatCard({
    title,
    value
}: Props) {
    return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium">{title}</h3>
        {/* {icon} */}
      </div>
      <div className="p-6 pt-0">
        <div className="text-2xl font-bold">{value}</div>
        {/* {description && <p className="text-xs text-muted-foreground">{description}</p>} */}
      </div>
    </div>
  );
}