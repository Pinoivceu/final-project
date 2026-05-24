"use client"

import React, { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Loader2, Send } from "lucide-react"
import { toast } from "sonner"
import { rejectTaskByMandor } from "./action"

export function RejectTaskDialog({
    taskId,
    open,
    onOpenChange,
    onSuccess,
}: {
    taskId: number
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}) {
    const [reason, setReason] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit() {
        if (!reason.trim()) {
            toast.error("Alasan penolakan wajib diisi.")
            return
        }

        setIsSubmitting(true)
        const toastId = toast.loading("Mengirim penolakan tugas...")

        try {
            const result = await rejectTaskByMandor(taskId, reason)

            if (result.success) {
                toast.success("Tugas berhasil ditolak dan dikembalikan ke owner.", { id: toastId })
                setReason("")
                onOpenChange(false)
                if (onSuccess) onSuccess()
            }
        } catch (error: any) {
            console.error("REJECT_TASK_BY_MANDOR_ERROR:", error)
            toast.error(error.message || "Gagal menolak tugas.", { id: toastId })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!isSubmitting) {
                onOpenChange(val)
                if (!val) setReason("")
            }
        }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="size-5 shrink-0 animate-pulse" />
                        Tolak Tugas Penugasan
                    </DialogTitle>
                    <DialogDescription>
                        Jelaskan alasan mengapa Anda menolak tugas ini agar dapat dievaluasi oleh Owner.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <Textarea
                        placeholder="Masukkan alasan penolakan secara rinci... (contoh: Lahan sedang direnovasi atau alat/bahan tidak memadai)"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="min-h-24 resize-none"
                        disabled={isSubmitting}
                    />
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !reason.trim()}
                        className="gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Mengirim...
                            </>
                        ) : (
                            <>
                                <Send className="size-4" />
                                Kirim Penolakan
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
