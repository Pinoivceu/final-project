import Link from "next/link";
export interface FieldsCardProps {
    id: any
    name: any;
    foreman: any;
    area: any;
    image: any;
}

export default function FieldsCard({
    id,
    name,
    foreman,
    area,
    image,
}: FieldsCardProps) {
    return (
        <Link href={`/owner/dashboard/lands/${id}`} className="block">
        <div  className="border bg-card rounded-2xl p-3 flex flex-col gap-3 hover:border-neutral-700 transition-all cursor-pointer group">
            <h2 className=" text-base font-bold ">
                {name}
            </h2>

            <div className="w-full aspect-4/3 overflow-hidden rounded-xl ">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* 3. Footer Data (Mandor & Luas) */}
            <div className="flex items-center justify-between px-1 mt-1">
                {/* Mandor Section */}
                <div className="flex items-center gap-1.5">
                    <span className="text-sm" role="img" aria-label="foreman">👨‍🌾</span>
                    <span className="  text-sm">
                        {foreman}
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    <span className="text-sm" role="img" aria-label="area">📐</span>
                    <span className=" text-sm">
                        {area}
                    </span>
                </div>
            </div>
        </div>
        </Link>
    )
}