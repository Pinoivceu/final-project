import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trees, Scale, ClipboardList, MapPin, Pencil, ImageOff } from "lucide-react"
import { columns } from "./column"
import { DataTable } from "./plants-table"
import prisma from "@/lib/prisma"
import TaskList from "./task-list-card"
import { getProduction, getTask } from "./action"
import { AddPlantForm, AddProductionForm, AddTaskForm } from "./form"
import { productionColumns } from "./column-production"
import { ProductionTable } from "./table-productions"
import { treatmentLogsColumns } from "./column-treatment-logs"
import { TreatmentLogsTable } from "./table-treatment-logs"
import DensityMap from "@/components/map-wrapper"
import { ProductionChart } from "./production-chart"
import EditLandForm from "./edit-land-form"
import Image from "next/image"

export default async function Lands({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const land = await prisma.land.findUnique({
    where: { id: slug },
    include: {
      mandor: true,
      treatmentLogs: {
        orderBy: { executionDate: 'desc' },
        include: { mandor: true }
      }
    }
  })

  // Fetch all mandors for the edit form dropdown
  const mandors = await prisma.user.findMany({
    where: { role: 'mandor', status: 'active' },
    select: { id: true, fullName: true }
  });

  const Plants = await prisma.plant.findMany({ where: { landId: slug } })
  const production = await getProduction(slug)
  const task = await getTask(slug)

  // Calculations for Summary Cards
  const activePlantsCount = Plants.filter(p => p.status === 'active').length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const totalProductionThisMonth = production.harvest?.filter((h: any) => {
    const d = new Date(h.harvestDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).reduce((sum: number, h: any) => sum + h.totalWeight, 0) || 0;

  const AprrovalTasksCount = task.tasks?.filter((t: any) => t.status === 'on_approval').length || 0;

  // New Calculations
  const plantDensity = land?.areaSize ? (activePlantsCount / land.areaSize).toFixed(0) : 0;

  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const yearOfLastMonth = currentMonth === 0 ? currentYear - 1 : currentYear;

  const totalProductionLastMonth = production.harvest?.filter((h: any) => {
    const d = new Date(h.harvestDate);
    return d.getMonth() === lastMonth && d.getFullYear() === yearOfLastMonth;
  }).reduce((sum: number, h: any) => sum + h.totalWeight, 0) || 0;

  let productionGrowth = 0;
  if (totalProductionLastMonth > 0) {
    productionGrowth = ((totalProductionThisMonth - totalProductionLastMonth) / totalProductionLastMonth) * 100;
  } else if (totalProductionThisMonth > 0) {
    productionGrowth = 100;
  }

  const productionGrowthText = productionGrowth > 0 ? `+${productionGrowth.toFixed(1)}%` : `${productionGrowth.toFixed(1)}%`;
  const isGrowthPositive = productionGrowth >= 0;

  const avgProductivity = activePlantsCount > 0
    ? (totalProductionThisMonth / activePlantsCount).toFixed(2)
    : "0";

  const completedTasks = task.tasks?.filter((t: any) => t.status === "completed") || [];

  return (
    <div className="size-full p-6 flex flex-col gap-6">

      {/* Page Header */}
      <div className="flex flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">{land?.landName ?? "Detail Lahan"}</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {land?.locationAddress || "Alamat belum diisi"} &mdash; Mandor: <span className="font-medium">{land?.mandor?.fullName}</span>
          </p>
        </div>
        <Dialog>
          <DialogTrigger render={<Button variant="outline" size="sm" className="flex items-center gap-2 shrink-0">
            <Pencil className="h-4 w-4" /> Edit Lahan
          </Button>}>

          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Lahan</DialogTitle>
              <DialogDescription>Perbarui informasi dan foto sampul lahan ini.</DialogDescription>
            </DialogHeader>
            <EditLandForm land={land} mandors={mandors} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Cover Image Banner */}


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Luas Lahan</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>TasksCount
            <div className="text-2xl font-bold">{land?.areaSize} Ha</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tanaman Aktif</CardTitle>
            <Trees className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePlantsCount} Pohon</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Panen Bulan Ini</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProductionThisMonth} Kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Butuh Persetujuan</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{AprrovalTasksCount} Tugas</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="bg-card w-full flex justify-start ">

          <TabsTrigger value="task">Tasks</TabsTrigger>
          <TabsTrigger value="plants">Plants</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="logs">Treatment Logs</TabsTrigger>
        </TabsList>


        <TabsContent value="task">
          <div className="p-6 rounded-lg flex flex-col gap-3 bg-card mt-4 border shadow-sm">
            <div className="flex flex-row justify-between size-full items-center">
              <h2 className="text-2xl font-bold">Tasks</h2>
              <Dialog>
                <DialogTrigger render={<Button>+ New Task</Button>} />

                <DialogContent >
                  <DialogHeader>
                    <DialogTitle>Tambah Lahan Baru</DialogTitle>
                    <DialogDescription>
                      Lengkapi data di bawah untuk membuat akun baru.
                    </DialogDescription>
                  </DialogHeader>
                  <AddTaskForm landId={slug}></AddTaskForm>
                </DialogContent>
              </Dialog>
            </div>
            <TaskList task={task} ></TaskList>
          </div>
        </TabsContent>

        <TabsContent value="plants">
          <div className="p-6 rounded-lg flex flex-col gap-6 bg-card mt-4 border shadow-sm">
            <div className="flex flex-row justify-between size-full items-center">
              <h2 className="text-2xl font-bold">Plants</h2>
              <Dialog>
                <DialogTrigger render={<Button>+ New Plants</Button>} />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Plant</DialogTitle>
                  </DialogHeader>
                  <AddPlantForm landId={slug} />
                </DialogContent>
              </Dialog>
            </div>
            <DensityMap plants={Plants} land={land} />
            <DataTable columns={columns} data={Plants} />
          </div>
        </TabsContent>

        <TabsContent value="production">
          <div className="p-6 rounded-lg flex flex-col gap-6 bg-card mt-4 border shadow-sm">
            <div className="flex flex-row justify-between size-full items-center">
              <h2 className="text-2xl font-bold">Production</h2>
              <Dialog>
                <DialogTrigger render={<Button>+ New Production</Button>} />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New production</DialogTitle>
                  </DialogHeader>
                  <AddProductionForm landId={slug} />
                </DialogContent>
              </Dialog>
            </div>
            {production.harvest && <ProductionChart data={production.harvest} />}
            <ProductionTable columns={productionColumns} data={production.harvest} />
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <div className="p-6 rounded-lg flex flex-col gap-6 bg-card mt-4 border shadow-sm">
            <div className="flex flex-row justify-between size-full items-center">
              <h2 className="text-2xl font-bold">Treatment Logs</h2>
            </div>
            <TreatmentLogsTable columns={treatmentLogsColumns} data={completedTasks} />
          </div>
        </TabsContent>

      </Tabs >
    </div>
  )
}
