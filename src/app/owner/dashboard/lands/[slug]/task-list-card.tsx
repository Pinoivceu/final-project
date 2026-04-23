"use client"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, Eye, CheckCircle2, Clock } from "lucide-react"
import React from "react"
import { toast } from "sonner"
import { deleteTask } from "./action"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TaskDetailSheet } from "@/components/sheet-task"
import { EditTaskForm } from "./form"

export default function TaskList({ task }: { task: any }) {
    const taskId = task.id

    if (!task || !task.success || !task.tasks || task.tasks.length === 0) {
        return (
            <div className="text-center py-20 border-2 border-dashed rounded-xl text-muted-foreground">
                Tidak ada tugas untuk lahan ini.
            </div>
        );
    }

    // Filter tasks
    const approvalTasks = task.tasks.filter((t: any) => t.status === "on_approval");

    // Filter untuk section Grid di bagian bawah
    const otherStatuses = ["pending", "in_progress", "completed"];

    return (
        <div className="flex flex-col gap-10">

            {/* SECTION 1: NEEDS APPROVAL (ROW) */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <CheckCircle2 className="size-5 text-yellow-600" />
                    <h2 className="text-lg font-bold tracking-tight">Butuh Persetujuan</h2>
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-bold">
                        {approvalTasks.length}
                    </span>
                </div>

                <div className="flex flex-row gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {approvalTasks.length > 0 ? (
                        approvalTasks.map((item: any) => (
                            <TaskCard key={item.id} item={item} className="min-w-75 border-l-4 border-l-yellow-500" />
                        ))
                    ) : (
                        <div className="w-full py-10 bg-muted/30 rounded-xl border border-dashed text-center text-sm text-muted-foreground italic">
                            Semua tugas sudah di-approve.
                        </div>
                    )}
                </div>
            </section>

            <hr />

            {/* SECTION 2: OTHER TASKS (GRID) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {otherStatuses.map((statusName) => {
                    const filteredTasks = task.tasks.filter((t: any) => t.status === statusName);

                    return (
                        <div key={statusName} className="flex flex-col gap-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                    <Clock className="size-4" />
                                    {statusName.replace("_", " ")}
                                </h3>
                                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">
                                    {filteredTasks.length}
                                </span>
                            </div>

                            <div className="grid gap-4">
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map((item: any) => (
                                        <TaskCard key={item.id} item={item} />
                                    ))
                                ) : (
                                    <p className="text-xs text-center text-muted-foreground italic border-2 border-dashed rounded-lg py-12">
                                        Kosong
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </section>
        </div>
    )
}

function TaskCard({ item, className }: { item: any; className?: string }) {

    const [selectedTask, setSelectedTask] = React.useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = React.useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const handleDelete = (id: any) => {
        toast.promise(deleteTask(id), {
            loading: 'Sedang Menghapus ...',
            success: (data) => {
                setShowDeleteDialog(false);
                return 'Berhasil Dihapus!';
            },
            error: (err) => {
                return ('Gagal menghapus ');
            },
            position: "top-right"
        });
    }

    const handleOpenDetail = (task: any) => {
        setSelectedTask(task);
        setIsDetailOpen(true);
    };

    return (
        <Card onClick={() => handleOpenDetail(item)} className={`shadow-sm group relative hover:shadow-md transition-shadow ${className}`}>
            {/* Dropdown Menu di pojok kanan atas */}
            <div onClick={(e) => e.stopPropagation()} className="absolute top-2 right-2">
                <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>}>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => {
                                setSelectedTask(item), setIsEditOpen(true)
                            }} className="cursor-pointer gap-2">
                                <Edit className="size-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                                <Trash2 className="size-4" />Hapus
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Hapus Tugas</DialogTitle>
                            <DialogDescription>
                                Apakah Anda yakin ingin menghapus
                                Tindakan ini tidak dapat dibatalkan.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteDialog(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    handleDelete(item.id)
                                    setShowDeleteDialog(false);
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="sm:max-w-125">
                        <DialogHeader>
                            <DialogTitle>Edit Informasi Tugas</DialogTitle>
                        </DialogHeader>
                        {selectedTask && (
                            <EditTaskForm
                                task={selectedTask}
                                onSuccess={() => setIsEditOpen(false)}
                            />
                        )}
                    </DialogContent>
                </Dialog>
                <TaskDetailSheet task={selectedTask} onOpenChange={setIsDetailOpen} open={isDetailOpen} />
            </div>

            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-md pr-6 leading-tight">
                    {item.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 pb-3">
                <p className="text-xs text-gray-600 line-clamp-2">
                    {item.description || "No description."}
                </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-white shadow-sm">
                        {item.mandor?.image ? (
                            <img src={item.mandor.image} alt="mandor" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-[8px] bg-green-100 text-green-700 font-bold uppercase">
                                {item.mandor?.fullName?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <span className="text-[10px] font-medium text-gray-500 truncate max-w-25">
                        {item.mandor?.fullName}
                    </span>
                </div>

                {item.dueDate && (
                    <span className="text-[9px] text-muted-foreground">
                        Due: {new Date(item.dueDate).toLocaleDateString()}
                    </span>
                )}
            </CardFooter>
        </Card>
    )
}