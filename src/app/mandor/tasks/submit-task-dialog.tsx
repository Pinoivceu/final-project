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
    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFiles = Array.from(e.target.files || [])
        const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"))

        if (imageFiles.length === 0) {
            toast.error("Hanya file gambar yang diperbolehkan.")
            return
        }

        setFiles((prev) => [...prev, ...imageFiles])

        const newPreviews: string[] = []
        let loaded = 0
        imageFiles.forEach((file) => {
            const reader = new FileReader()
            reader.onloadend = () => {
                newPreviews.push(reader.result as string)
                loaded++
                if (loaded === imageFiles.length) {
                    setPreviews((prev) => [...prev, ...newPreviews])
                }
            }
            reader.readAsDataURL(file)
        })
    }

    function handleRemoveImage(index: number) {
        setFiles((prev) => prev.filter((_, i) => i !== index))
        setPreviews((prev) => prev.filter((_, i) => i !== index))
    }

    async function handleSubmit() {
        if (files.length === 0) {
            toast.error("Silakan lampirkan foto hasil kerja terlebih dahulu.")
            return
        }

        setIsSubmitting(true)
        const toastId = toast.loading("Mengunggah foto-foto hasil kerja...")

        try {
            // 1. Upload all to /api/upload in parallel
            const uploadPromises = files.map(async (file) => {
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
                return uploadData.url
            })

            const imageUrls = await Promise.all(uploadPromises)

            // 2. Submit Task with JSON stringified imageUrls
            toast.loading("Mengajukan tugas ke owner...", { id: toastId })
            const result = await submitTask(taskId, JSON.stringify(imageUrls))

            if (result.success) {
                toast.success("Tugas berhasil diajukan untuk persetujuan!", { id: toastId })
                setFiles([])
                setPreviews([])
                onOpenChange(false)
                if (onSuccess) onSuccess()
            }
        } catch (error: any) {
            console.error("SUBMIT_TASK_WITH_IMAGES_ERROR:", error)
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
                    setFiles([])
                    setPreviews([])
                }
            }
        }}>
            <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col p-6 overflow-hidden">
                <DialogHeader className="pb-2 border-b">
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                        <UploadCloud className="size-5 text-primary animate-bounce shrink-0" />
                        Kirim Hasil Kerja (Banyak Foto)
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Unggah satu atau beberapa foto bukti hasil kerja Anda untuk ditinjau oleh Owner.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4 flex-1 overflow-y-auto pr-1">
                    {/* Upload button (Always visible at the top to allow adding more files) */}
                    <div>
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer bg-muted/20 hover:bg-muted/40 border-muted-foreground/30 transition-colors">
                            <div className="flex flex-col items-center justify-center text-center px-4">
                                <UploadCloud className="w-6 h-6 text-muted-foreground mb-1" />
                                <p className="text-xs font-semibold text-foreground">
                                    Klik untuk tambah foto-foto hasil pengerjaan
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                    PNG, JPG atau JPEG (Maksimal 5MB/file)
                                </p>
                            </div>
                            <Input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={isSubmitting}
                            />
                        </label>
                    </div>

                    {/* Previews grid */}
                    {previews.length > 0 && (
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-muted-foreground">
                                Foto terpilih ({previews.length})
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                                {previews.map((previewUrl, index) => (
                                    <div key={index} className="relative rounded-xl overflow-hidden border bg-muted aspect-video flex items-center justify-center group shadow-sm">
                                        <img
                                            src={previewUrl}
                                            alt={`Pratinjau Hasil Kerja ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {!isSubmitting && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 size-6 rounded-full shadow-md opacity-90 hover:opacity-100 transition-opacity"
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                <X className="size-3.5" />
                                            </Button>
                                        )}
                                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                                            #{index + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t mt-auto shrink-0">
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
                        disabled={isSubmitting || files.length === 0}
                        className="gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Memproses ({files.length} foto)...
                            </>
                        ) : (
                            <>
                                <ImageIcon className="size-4" />
                                Kirim {files.length > 0 ? `(${files.length} Foto)` : ""} & Ajukan
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
