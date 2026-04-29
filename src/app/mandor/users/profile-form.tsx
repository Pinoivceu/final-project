"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"
import { Save, Upload, User, UserCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateProfile } from "./action"

export function ProfileForm({ user }: { user: any }) {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(user.image || null)
    const [isUploading, setIsUploading] = useState(false)

    const form = useForm({
        defaultValues: {
            id: user.id,
            fullName: user.fullName || "",
            username: user.username || "",
            phoneNumber: user.phoneNumber || "",
        },
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            if (selectedFile.size > 2 * 1024 * 1024) {
                toast.error("Ukuran file maksimal 2MB")
                return
            }
            setFile(selectedFile)
            setPreview(URL.createObjectURL(selectedFile))
        }
    }

    const onSubmit = async (values: any) => {
        setIsUploading(true)
        
        const updatePromise = async () => {
            let imageUrl = user.image
            
            // Upload file first if a new one is selected
            if (file) {
                const uploadData = new FormData()
                uploadData.append("file", file)
                uploadData.append("category", "profiles")
                
                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadData
                })
                
                const uploadResult = await uploadRes.json()
                if (!uploadRes.ok) throw new Error(uploadResult.error || "Gagal mengunggah foto profil")
                
                imageUrl = uploadResult.url
            }

            return updateProfile({ ...values, image: imageUrl })
        }

        toast.promise(updatePromise(), {
            loading: "Menyimpan perubahan profil...",
            success: "Profil berhasil diperbarui!",
            error: (err) => err.message,
            finally: () => setIsUploading(false)
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center gap-3">
                    <Avatar className="size-24 border bg-muted">
                        <AvatarImage src={preview || ""} alt={user.fullName} className="object-cover" />
                        <AvatarFallback>
                            <UserCircle className="size-12 text-muted-foreground" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <input
                            type="file"
                            id="profile-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            className="gap-2 text-xs"
                            onClick={() => document.getElementById("profile-upload")?.click()}
                        >
                            <Upload className="size-3" /> Ubah Foto
                        </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Maks 2MB. JPG/PNG.</p>
                </div>

                {/* Form Fields */}
                <FieldGroup className="flex-1 flex flex-col gap-4 w-full">
                    <Controller
                        name="username"
                        control={form.control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel>Username (Tidak dapat diubah)</FieldLabel>
                                <Input {...field} disabled className="bg-muted" />
                            </Field>
                        )}
                    />

                    <Controller
                        name="fullName"
                        control={form.control}
                        rules={{ required: "Nama lengkap wajib diisi" }}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Nama Lengkap</FieldLabel>
                                <Input {...field} placeholder="Masukkan nama lengkap Anda" />
                                {fieldState.error && (
                                    <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="phoneNumber"
                        control={form.control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel>Nomor Telepon</FieldLabel>
                                <Input {...field} placeholder="Contoh: 081234567890" />
                            </Field>
                        )}
                    />
                </FieldGroup>
            </div>

            <div className="flex justify-end pt-2 border-t">
                <Button type="submit" className="gap-2" disabled={isUploading}>
                    <Save className="size-4" /> {isUploading ? "Menyimpan..." : "Simpan Profil"}
                </Button>
            </div>
        </form>
    )
}
