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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadCloud, Loader2, Image as ImageIcon, X } from "lucide-react"
import { toast } from "sonner"
import { submitTask } from "./action"

export function SubmitTaskDialog({
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
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = e.target.files?.[0]
        if (selected) {
            if (!selected.type.startsWith("image/")) {
                toast.error("Hanya file gambar yang diperbolehkan.")
                return
            }
            setFile(selected)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(selected)
        }
    }

    function handleRemoveImage() {
        setFile(null)
        setPreview(null)
    }

    async function handleSubmit() {
        if (!file) {
            toast.error("Silakan lampirkan foto hasil kerja terlebih dahulu.")
            return
        }

        setIsSubmitting(true)
        const toastId = toast.loading("Mengunggah foto hasil kerja...")

        try {
            // 1. Upload to /api/upload
            const formData = new FormData()
            formData.append("file", file)
            formData.append("category", "tasks")

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            const uploadData = await uploadRes.json()
            if (!uploadRes.ok) {
                throw new Error(uploadData.error || "Gagal mengunggah foto.")
            }

            const imageUrl = uploadData.url

            // 2. Submit Task with image url
            toast.loading("Mengajukan tugas ke owner...", { id: toastId })
            const result = await submitTask(taskId, imageUrl)

            if (result.success) {
                toast.success("Tugas berhasil diajukan untuk persetujuan!", { id: toastId })
                setFile(null)
                setPreview(null)
                onOpenChange(false)
                if (onSuccess) onSuccess()
            }
        } catch (error: any) {
            console.error("SUBMIT_TASK_WITH_IMAGE_ERROR:", error)
            toast.error(error.message || "Terjadi kesalahan saat mengajukan tugas.", { id: toastId })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!isSubmitting) {
                onOpenChange(val)
                if (!val) {
                    setFile(null)
                    setPreview(null)
                }
            }
        }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UploadCloud className="size-5 text-primary animate-bounce" />
                        Kirim Hasil Kerja
                    </DialogTitle>
                    <DialogDescription>
                        Unggah foto bukti hasil kerja Anda untuk ditinjau dan disetujui oleh Owner.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {!preview ? (
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer bg-muted/20 hover:bg-muted/40 border-muted-foreground/30 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                    <UploadCloud className="w-10 h-10 text-muted-foreground mb-3" />
                                    <p className="mb-1 text-sm font-semibold text-foreground">
                                        Klik untuk unggah foto
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        PNG, JPG atau JPEG (Maksimal 5MB)
                                    </p>
                                </div>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    ) : (
                        <div className="relative rounded-xl overflow-hidden border bg-muted aspect-video flex items-center justify-center">
                            <img
                                src={preview}
                                alt="Pratinjau Hasil Kerja"
                                className="w-full h-full object-cover"
                            />
                            {!isSubmitting && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 size-7 rounded-full shadow"
                                    onClick={handleRemoveImage}
                                >
                                    <X className="size-4" />
                                </Button>
                            )}
                        </div>
                    )}
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
                        onClick={handleSubmit}
                        disabled={isSubmitting || !file}
                        className="gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                <ImageIcon className="size-4" />
                                Kirim & Ajukan
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
