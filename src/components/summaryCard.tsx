export interface SummaryCardProps {
    id?: any;
    value: any;
    unit?: string;
    label: string;
    iconEmoji: string;
    trend?: string;
    trendPositive?: boolean;
}

export default function SummaryCard({
    value,
    unit,
    label,
    iconEmoji,
    trend,
    trendPositive,
}: SummaryCardProps) {
    return (
        <div className="rounded-xl border bg-card p-5 flex flex-col gap-3 transition-all hover:shadow-md hover:border-border/80">
            {/* Header: Icon & Label */}
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <span className="text-2xl" role="img" aria-label={label}>{iconEmoji}</span>
            </div>

            {/* Value */}
            <div className="flex items-end justify-between gap-2">
                <p className="text-2xl font-bold tracking-tight text-foreground">
                    {value}
                    {unit && (
                        <span className="text-base font-semibold text-muted-foreground ml-1.5">{unit}</span>
                    )}
                </p>

                {/* Optional trend badge */}
                {trend && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        trendPositive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                    }`}>
                        {trend}
                    </span>
                )}
            </div>
        </div>
    )
}