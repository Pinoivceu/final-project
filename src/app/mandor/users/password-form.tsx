"use client"

import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"
import { KeyRound } from "lucide-react"
import { changePassword } from "./action"

export function PasswordForm({ userId }: { userId: string }) {
    const form = useForm({
        defaultValues: {
            id: userId,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (values: any) => {
        if (values.newPassword !== values.confirmPassword) {
            form.setError("confirmPassword", { type: "manual", message: "Password baru tidak cocok." })
            return
        }

        toast.promise(changePassword(values), {
            loading: "Mengubah password...",
            success: () => {
                form.reset()
                return "Password berhasil diubah!"
            },
            error: (err) => err.message,
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FieldGroup className="flex flex-col gap-4">

                <Controller
                    name="currentPassword"
                    control={form.control}
                    rules={{ required: "Password saat ini wajib diisi" }}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Password Saat Ini</FieldLabel>
                            <Input {...field} type="password" placeholder="Masukkan password saat ini" />
                            {fieldState.error && (
                                <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                            )}
                        </Field>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                        name="newPassword"
                        control={form.control}
                        rules={{ 
                            required: "Password baru wajib diisi",
                            minLength: { value: 6, message: "Password minimal 6 karakter" }
                        }}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Password Baru</FieldLabel>
                                <Input {...field} type="password" placeholder="Minimal 6 karakter" />
                                {fieldState.error && (
                                    <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="confirmPassword"
                        control={form.control}
                        rules={{ required: "Konfirmasi password wajib diisi" }}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Konfirmasi Password Baru</FieldLabel>
                                <Input {...field} type="password" placeholder="Ketik ulang password baru" />
                                {fieldState.error && (
                                    <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                                )}
                            </Field>
                        )}
                    />
                </div>

            </FieldGroup>

            <div className="flex justify-end pt-2">
                <Button type="submit" variant="destructive" className="gap-2">
                    <KeyRound className="size-4" /> Ubah Password
                </Button>
            </div>
        </form>
    )
}
