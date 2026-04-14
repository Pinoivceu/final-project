import prisma from "@/lib/prisma"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function TaskList({ task }: { task: any }) {

    if (!task || !task.success || !task.tasks || task.tasks.length === 0) {
        return (
            <div className="text-center p-4 text-muted-foreground">
                Tidak ada tugas untuk lahan ini.
            </div>
        );
    }

    const statuses = ["pending", "in_progress", "completed", "rejected"];

    return (
       // Container Utama: Grid dengan 4 kolom (atau 1 kolom di mobile)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statuses.map((statusName) => {
                // Filter task berdasarkan status saat ini
                const filteredTasks = task.tasks.filter(
                    (t: any) => t.status === statusName
                );

                return (
                    <div key={statusName} className="flex flex-col gap-4">
                        {/* Judul Container Status */}
                        <div className="flex items-center justify-between border-b pb-2 mb-2">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
                                {statusName.replace("_", " ")}
                            </h3>
                            <span className="bg-muted px-2 py-0.5 rounded text-xs font-mono">
                                {filteredTasks.length}
                            </span>
                        </div>

                        {/* List Task di dalam container status ini */}
                        <div className="flex flex-col gap-4">
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map((item: any) => (
                                    <Card key={item.id} className="shadow-sm">
                                        <CardHeader className="p-4 pb-2">
                                            <CardTitle className="text-md leading-tight">
                                                {item.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0 pb-3">
                                            <p className="text-xs text-gray-600 line-clamp-2">
                                                {item.description || "No description."}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0 flex items-center flex-row-reverse  justify-between">
                                            <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                                {item.mandor?.image ? (
                                                    <img
                                                        src={item.mandor.image}
                                                        alt={item.mandor.fullName}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-[8px] bg-green-100 text-green-700">
                                                        {item.mandor?.fullName?.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-medium truncate">
                                                {item.mandor?.fullName}
                                            </span>
                                        </CardFooter>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-xs text-center text-muted-foreground italic border-2 border-dashed rounded-lg py-8">
                                    Empty
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    )
}