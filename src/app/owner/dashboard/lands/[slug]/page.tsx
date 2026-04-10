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

export default async function Lands({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const land = parseInt(slug)
  const data = await prisma.plant.findMany({ where: { landId: land } })

  return (
    <Tabs defaultValue="overview" className="size-full m-6">
      <TabsList className="bg-card">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="task">Task</TabsTrigger>
        <TabsTrigger value="plants">Plants</TabsTrigger>
        <TabsTrigger value="production">Production</TabsTrigger>
      </TabsList>

      <TabsContent value="overview"> hi overview </TabsContent>
      <TabsContent value="task"> hi task </TabsContent>

      <TabsContent value="plants">
        <div className="bg-card rounded-lg p-3 flex flex-col gap-3">
          <Dialog>
            <DialogTrigger>
              <Button>+ Add New Plants</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Plant</DialogTitle>
              </DialogHeader>
              
            </DialogContent>
          </Dialog>

          <DataTable columns={columns} data={data} />
        </div>
      </TabsContent>
      <TabsContent value="production"> hi production </TabsContent>

    </Tabs >
  )

}



