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
    <div className="  p-3 size-full  rounded-xl border bg-card flex items-center justify-between transition-all">
        {/* Sisi Kiri: Nilai dan Label */}
        <div className="flex flex-col gap-1">
            <p className="text-xl font-bold tracking-tight">
                {value}
                {unit && (
                    <span className="text-xl font-bold ml-1.5 ">
                        {unit}
                    </span>
                )}
            </p>
            <p className=" text-sm ">
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