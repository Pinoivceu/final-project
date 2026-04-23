"use client"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import React from "react"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, AlignLeft, Info, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { approveTask, rejectTask } from "@/app/owner/dashboard/lands/[slug]/action"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Textarea } from "./ui/textarea"

export function TaskDetailSheet({
    task,
    open,
    onOpenChange
}: {
    task: any,
    open: boolean,
    onOpenChange: (open: boolean) => void
}) {
    if (!task) return null;

    const [isRejectDialogOpen, setIsRejectDialogOpen] = React.useState(false)
    const [reason, setReason] = React.useState("")
    // Fungsi untuk memproses Approval atau Rejection
    const handleConfirmReject = async () => {
        if (!reason.trim()) {
            toast.error("Alasan penolakan tidak boleh kosong")
            return
        }

        toast.promise(rejectTask(task.id, reason), {
            loading: "Mengembalikan tugas ke pending...",
            success: () => {
                setIsRejectDialogOpen(false) // Tutup dialog reject
                onOpenChange(false)         // Tutup sheet detail
                setReason("")               // Reset form
                return "Tugas berhasil dikembalikan ke pending"
            },
            error: (err) => err.message,
        })
    }
    const handleApprove = async () => {
        const payload = {
            id: task.id,
            status: "completed",
            // Jika approved, kita bisa set verifiedAt di server action
        };

        toast.promise(approveTask(payload), {
            loading: `Sedang memproses }...`,
            success: () => {
                onOpenChange(false); // Tutup sheet setelah berhasil
                return `Tugas berhasil Selesaikan`;
            },
            error: (err) => err.message || "Gagal memperbarui status tugas",
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md overflow-y-auto p-6 flex flex-col">
                <div className="flex-1">
                    <SheetHeader className="border-b pb-4">
                        <Badge variant="outline" className="w-fit mb-2 capitalize">
                            {task.activityType}
                        </Badge>
                        <SheetTitle className="text-xl">{task.title}</SheetTitle>
                        <SheetDescription>
                            Detail instruksi dan status pengerjaan tugas.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="py-6 space-y-6">
                        {/* Status Section */}
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                            <span className="text-sm font-medium">Status Saat Ini</span>
                            <Badge className={
                                task.status === "completed" ? "bg-green-600" :
                                    task.status === "on_approval" ? "bg-yellow-500 text-white" :
                                        task.status === "in_progress" ? "bg-blue-600" : "bg-gray-500"
                            }>
                                {task.status.replace("_", " ")}
                            </Badge>
                        </div>

                        {/* Info Utama */}
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <AlignLeft className="size-5 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">Deskripsi</p>
                                    <p className="text-sm leading-relaxed">{task.description || "Tidak ada deskripsi tambahan."}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Calendar className="size-5 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">Tenggat Waktu</p>
                                    <p className="text-sm">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        }) : "-"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <User className="size-5 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">Mandor Penanggung Jawab</p>
                                    <p className="text-sm font-medium">{task.mandor?.fullName}</p>
                                </div>
                            </div>
                        </div>

                        {/* Log Sistem */}
                        <div className="pt-6 border-t">
                            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                                <Info className="size-4" />
                                <h4 className="text-xs font-bold uppercase tracking-wider">Log Sistem</h4>
                            </div>
                            <div className="text-[11px] text-muted-foreground space-y-1 bg-muted/20 p-2 rounded">
                                <p>Dibuat pada: {new Date(task.createdAt).toLocaleString('id-ID')}</p>
                                <p>ID Tugas: {task.id}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DYNAMIC FOOTER ACTIONS */}
                {task.status === "on_approval" && (
                    <div className="border-t pt-4 mt-auto">
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2"
                                onClick={() => setIsRejectDialogOpen(true)} // Buka Dialog Reject
                            >
                                <XCircle className="size-4" /> Tolak
                            </Button>
                            <Button
                                className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                                onClick={() => handleApprove()}
                            >
                                <CheckCircle2 className="size-4" />
                                Approve
                            </Button>
                        </div>
                        <p className="text-[10px] text-center text-muted-foreground mt-3 italic">
                            Aksi ini akan memperbarui status tugas secara permanen.
                        </p>
                    </div>
                )}
            </SheetContent>
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent className="sm:max-w-106.25">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <XCircle className="size-5" /> Tolak Pengerjaan
                        </DialogTitle>
                        <DialogDescription>
                            Berikan alasan mengapa tugas ini dikembalikan ke status pending untuk dikerjakan ulang.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Textarea
                            placeholder="Contoh: Hasil pemupukan belum merata di barisan pohon blok A..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="min-h-25"
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmReject}
                            disabled={!reason.trim()}
                        >
                            Kirim & Reset ke Pending
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Sheet>
    )
}