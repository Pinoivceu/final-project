"use client"

import { useState } from "react"
import { TaskCard, type TaskItem } from "./task-card"
import { TaskDetailSheet } from "./task-detail-sheet"
import { Clock, Loader2, AlertTriangle } from "lucide-react"

const COLUMNS = [
    {
        key: "pending",
        label: "Menunggu",
        icon: <AlertTriangle className="size-4" />,
        headerClass: "bg-gray-100 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700",
        pillClass: "bg-muted-foreground text-secondary",
        emptyText: "Tidak ada tugas baru.",
    },
    {
        key: "in_progress",
        label: "Dikerjakan",
        icon: <Loader2 className="size-4 animate-spin" />,
        headerClass: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
        pillClass: "bg-[var(--blue)] text-[var(--blue-foreground)]",
        emptyText: "Tidak ada tugas yang dikerjakan.",
    },
    {
        key: "on_approval",
        label: "Review Owner",
        icon: <Clock className="size-4" />,
        headerClass: "bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-800",
        pillClass: "bg-[var(--yellow)] text-[var(--yellow-foreground)]",
        emptyText: "Tidak ada tugas dalam review.",
    },
]

export function TaskBoard({ tasks }: { tasks: TaskItem[] }) {
    const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null)
    const [sheetOpen, setSheetOpen] = useState(false)

    function handleOpenDetail(task: TaskItem) {
        setSelectedTask(task)
        setSheetOpen(true)
    }

    return (
        <>
            {/* Kanban Board — horizontal scroll on mobile */}
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
                {COLUMNS.map((col) => {
                    const colTasks = tasks.filter((t) => t.status === col.key)
                    return (
                        <div
                            key={col.key}
                            className="flex flex-col gap-3 min-w-[280px] w-[280px] flex-shrink-0 lg:flex-1 lg:w-auto lg:min-w-0"
                        >
                            {/* Column Header */}
                            <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border font-semibold text-sm ${col.headerClass}`}>
                                <div className="flex items-center gap-2">
                                    {col.icon}
                                    <span>{col.label}</span>
                                </div>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center ${col.pillClass}`}>
                                    {colTasks.length}
                                </span>
                            </div>

                            {/* Cards */}
                            <div className="flex flex-col gap-3">
                                {colTasks.length === 0 ? (
                                    <div className="flex items-center justify-center py-10 text-xs text-muted-foreground border border-dashed rounded-xl bg-muted/20">
                                        {col.emptyText}
                                    </div>
                                ) : (
                                    colTasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onOpenDetail={handleOpenDetail}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            <TaskDetailSheet
                task={selectedTask}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
            />
        </>
    )
}
