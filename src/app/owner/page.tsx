"use client"
import { stats, fieldData } from "@/data/dummydata"
import { SummaryCardProps } from "@/components/summaryCard";
import SummaryCard from "@/components/summaryCard";
import FieldsCard from "@/components/fields-card";
import WeatherWidget from "@/components/weather-widget";
import { Button } from "@/components/ui/button";



export default function OwnerHome() {
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

        <div className="size-full   lg:w-80 flex flex-col gap-6">
          <h2 className="text-2xl font-bold ">Weather</h2>
          <div className=" rounded-2xl  ">
            <WeatherWidget />
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
            <FieldsCard key={field.id} {...field} />
          ))}
        </div>
      </div>

    </div>




  )
}



