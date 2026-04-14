import { stats } from "@/data/dummydata"
import SummaryCard from "@/components/summaryCard";
import FieldsCard from "@/app/owner/dashboard/fields-card";
import { LahanAddForm } from "./add-land-fom";
import { Button } from "@/components/ui/button";
import { formatAreaDisplay } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
  


const mandors = await prisma.user.findMany({
    where: {
      role: "mandor"
    },
    select: {
      id: true,
      fullName: true,
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
          <Dialog>
            <DialogTrigger
              render={<Button>+ Tambah User</Button>}
            />
            <DialogContent >
              <DialogHeader>
                <DialogTitle>Tambah User Baru</DialogTitle>
                <DialogDescription>
                  Lengkapi data di bawah untuk membuat akun baru.
                </DialogDescription>
              </DialogHeader>

              <LahanAddForm mandors={mandors} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Grid Lahan - Melebar penuh di bawah */}
        <div className="grid grid-cols-1 sm:grid-cols-2 rounded-2xl  md:grid-cols-3 lg:grid-cols-4 gap-3">
          {fieldData.map((field) => (
            <FieldsCard
              id={field.id}
              key={field.id}
              image={field.image || "/default-kebun.jpg"} // Handle null image
              name={field.landName}                        // landName -> name
              area={formatAreaDisplay(field.areaSize)}               // areaSize -> area
              foreman={field.mandor?.fullName || "No Mandor"} // Ambil nama dari relasi mandor
            />
          ))}
        </div>
      </div>

    </div>




  )
}



