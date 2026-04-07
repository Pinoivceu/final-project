export interface SummaryCardProps {
    id: any;
    value: any;
    unit?: any;
    label: any;
    iconEmoji: any;
}

export default function SummaryCard({
    value,
    unit,
    label,
    iconEmoji
}: SummaryCardProps) { return (
    <div className="  p-3 rounded-xl flex items-center justify-between transition-all">
        {/* Sisi Kiri: Nilai dan Label */}
        <div className="flex flex-col gap-1">
            <p className="text-3xl font-bold text-white tracking-tight">
                {value}
                {unit && (
                    <span className="text-xl font-medium ml-1.5 text-white/80">
                        {unit}
                    </span>
                )}
            </p>
            <p className="text-neutral-500 text-lg font-medium">
                {label}
            </p>
        </div>

        {/* Sisi Kanan: Icon Emoji */}
        <div className="text-5xl" role="img" aria-label={label}>
            {iconEmoji}
        </div>
    </div>
)
}