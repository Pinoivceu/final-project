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
import { columns } from "./column"
import { DataTable } from "./plants-table"
import prisma from "@/lib/prisma"
import TaskList from "./task-list-card"
import { getProduction, getTask } from "./action"
import { AddPlantForm, AddProductionForm, AddTaskForm } from "./form"
import { productionColumns } from "./column-production"
import { ProductionTable } from "./table-productions"

// TODO:Ganti column table dengan masing masing data yang sesuai dengan tabs nya

export default async function Lands({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const Plants = await prisma.plant.findMany({ where: { landId: slug } })
  const production = await getProduction(slug)
  const task = await getTask(slug)


  return (
    <Tabs defaultValue="task" className="size-full m-6">
      <TabsList className="bg-card">
        <TabsTrigger value="task">Task</TabsTrigger>
        <TabsTrigger value="plants">Plants</TabsTrigger>
        <TabsTrigger value="production">Production</TabsTrigger>
      </TabsList>


      <TabsContent value="task">
        <div className=" p-6 rounded-lg flex flex-col gap-3">
          <div className="flex flex-row justify-between size-full">
            <h2 className="text-2xl font-bold">Tasks</h2>
            <Dialog>
              <DialogTrigger
                render={<Button>+ New Task</Button>}
              />
              <DialogContent >
                <DialogHeader>
                  <DialogTitle>Tambah User Baru</DialogTitle>
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
        <div className=" p-6 rounded-lg flex flex-col gap-3">
          <div className="flex flex-row justify-between size-full">
            <h2 className="text-2xl font-bold">Plants Table</h2>
            <Dialog>
              <DialogTrigger render={<Button>+ New Plants</Button>}>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Plant</DialogTitle>
                </DialogHeader>
                <AddPlantForm landId={slug} />
              </DialogContent>
            </Dialog>
          </div>
          <DataTable columns={columns} data={Plants} />
        </div>
      </TabsContent>
      <TabsContent value="production">
        <div className=" p-6 rounded-lg flex flex-col gap-3">
          <div className="flex flex-row justify-between size-full">
            <h2 className="text-2xl font-bold">Production Table</h2>
            <Dialog>
              <DialogTrigger render={<Button>+ New Production</Button>}>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New production</DialogTitle>
                </DialogHeader>
                <AddProductionForm landId={slug} />
              </DialogContent>
            </Dialog>
          </div>
          <ProductionTable columns={productionColumns} data={production.harvest} />
        </div>
      </TabsContent>

    </Tabs >
  )

}



