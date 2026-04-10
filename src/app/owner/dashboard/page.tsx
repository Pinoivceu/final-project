import { stats } from "@/data/dummydata"
import SummaryCard from "@/components/summaryCard";
import FieldsCard from "@/components/fields-card";
import WeatherWidget from "@/components/weather-widget";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

export default async function OwnerHome() {

  const fieldData = await prisma.land.findMany({
    include: {
      mandor: {
        select: {
          fullName: true

        }
      }
    }
  })
  return (
    <div className=" size-full bg-background flex flex-col gap-10 p-6">

      <div className="flex flex-col lg:flex-row gap-6 w-full items-start">

        <div className="flex flex-col gap-6 size-full ">
          <h1 className="font-bold text-2xl ">Summary Card</h1>
          <div className="grid grid-cols-2 gap-6 w-full">
            {stats.map((item) => (
              <SummaryCard key={item.id} {...item} />
            ))}
          </div>
        </div>

      </div>
      <div className="flex flex-col gap-6 w-full ">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Fields</h2>
          <Button>
            + Add New Fields
          </Button>
        </div>

        {/* Grid Lahan - Melebar penuh di bawah */}
        <div className="grid grid-cols-1 sm:grid-cols-2 rounded-2xl  md:grid-cols-3 lg:grid-cols-4 gap-3">
          {fieldData.map((field) => (
            <FieldsCard
              id={field.id}
              key={field.id}
              image={field.image || "/default-kebun.jpg"} // Handle null image
              name={field.landName}                        // landName -> name
              area={`${field.areaSize} Ha`}               // areaSize -> area
              foreman={field.mandor?.fullName || "No Mandor"} // Ambil nama dari relasi mandor
            />
          ))}
        </div>
      </div>

    </div>




  )
}



