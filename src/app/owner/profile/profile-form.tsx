"use client"

import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"
import { updateProfile } from "./action"
import Image from "next/image"

export function ProfileForm({ user }: { user: any }) {
    const form = useForm({
        defaultValues: {
            fullName: user.fullName || "",
            phoneNumber: user.phoneNumber || "",
            image: user.image || "",
        },
    })

    const currentImage = form.watch("image")

    const onSubmit = async (values: any) => {
        toast.promise(updateProfile(values), {
            loading: "Menyimpan perubahan profil...",
            success: "Profil berhasil diperbarui!",
            error: (err) => err.message || "Gagal menyimpan",
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-6">
                    <div className="relative size-24 shrink-0 overflow-hidden rounded-full bg-muted border">
                        <Image 
                            src={currentImage || "/avatar-placeholder.png"} 
                            alt="Profile" 
                            fill 
                            className="object-cover"
                        />
                    </div>
                    <Controller
                        name="image"
                        control={form.control}
                        render={({ field }) => (
                            <Field className="flex-1">
                                <FieldLabel htmlFor="image">Foto Profil</FieldLabel>
                                <Input 
                                    id="image" 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                field.onChange(reader.result as string);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                <p className="text-xs text-muted-foreground mt-1">Format didukung: JPG, PNG, GIF.</p>
                            </Field>
                        )}
                    />
                </div>

                <Controller
                    name="fullName"
                    control={form.control}
                    render={({ field }) => (
                        <Field>
                            <FieldLabel htmlFor="fullName">Nama Lengkap</FieldLabel>
                            <Input {...field} id="fullName" placeholder="Masukkan nama lengkap Anda" />
                        </Field>
                    )}
                />

                <Controller
                    name="phoneNumber"
                    control={form.control}
                    render={({ field }) => (
                        <Field>
                            <FieldLabel htmlFor="phoneNumber">Nomor Telepon</FieldLabel>
                            <Input {...field} id="phoneNumber" placeholder="Contoh: 08123456789" />
                        </Field>
                    )}
                />
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit">Simpan Profil</Button>
            </div>
        </form>
    )
}
