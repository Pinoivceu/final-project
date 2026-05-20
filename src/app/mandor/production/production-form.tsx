"use client"

import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DialogClose } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Scale, Save, NotebookPen } from "lucide-react"
import { createHarvest, updateHarvest } from "./action"

// ─── Add Form ─────────────────────────────────────────────────────────────────

export function AddProductionForm({ landId, onSuccess }: { landId: string; onSuccess?: () => void }) {
    const form = useForm({
        defaultValues: {
            totalWeight: "",
            harvestDate: new Date().toISOString().split("T")[0],
            variety: "",
            notes: "",
            landId,
        },
    })

    const onSubmit = async (values: any) => {
        toast.promise(createHarvest(values), {
            loading: "Mencatat hasil panen...",
            success: () => {
                form.reset({ totalWeight: "", harvestDate: new Date().toISOString().split("T")[0], notes: "", landId })
                onSuccess?.()
                return "Data produksi berhasil dicatat!"
            },
            error: (err) => err.message,
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FieldGroup className="flex flex-col gap-4">

                {/* Berat */}
                <Controller
                    name="totalWeight"
                    control={form.control}
                    rules={{ required: "Berat wajib diisi" }}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="totalWeight">Total Hasil Panen (Kg)</FieldLabel>
                            <div className="relative">
                                <Scale className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    {...field}
                                    id="totalWeight"
                                    type="number"
                                    step="0.01"
                                    placeholder="Contoh: 25.5"
                                    className="pl-9"
                                />
                                <span className="absolute right-3 top-2 text-sm font-medium text-muted-foreground">Kg</span>
                            </div>
                            {fieldState.error && (
                                <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                            )}
                        </Field>
                    )}
                />

                {/* Tanggal */}
                <Controller
                    name="harvestDate"
                    control={form.control}
                    rules={{ required: "Tanggal wajib diisi" }}
                    render={({ field }) => (
                        <Field>
                            <FieldLabel htmlFor="harvestDate">Tanggal Panen</FieldLabel>
                            <Input {...field} id="harvestDate" type="date" />
                        </Field>
                    )}
                />

                {/* Varietas */}
                <Controller
                    name="variety"
                    control={form.control}
                    render={({ field }) => (
                        <Field>
                            <FieldLabel htmlFor="variety">Varietas (Opsional)</FieldLabel>
                            <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                <SelectTrigger id="variety">
                                    <SelectValue placeholder="Pilih varietas " />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Arabica">Arabica</SelectItem>
                                    <SelectItem value="Robusta">Robusta</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    )}
                />

                {/* Catatan */}
                <Controller
                    name="notes"
                    control={form.control}
                    render={({ field }) => (
                        <Field>
                            <FieldLabel htmlFor="notes">Catatan (Opsional)</FieldLabel>
                            <Textarea
                                {...field}
                                id="notes"
                                placeholder="Contoh: Kualitas buah sangat baik, cuaca cerah saat panen..."
                                className="min-h-[80px]"
                            />
                        </Field>
                    )}
                />

            </FieldGroup>

            <div className="flex justify-end gap-2 pt-2 border-t">
                <DialogClose render={<Button variant="outline" type="button">Batal</Button>} />
                <Button type="submit" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <NotebookPen className="size-4" /> Simpan Produksi
                </Button>
            </div>
        </form>
    )
}

// ─── Edit Form ─────────────────────────────────────────────────────────────────

export function EditProductionForm({ harvest, onSuccess }: { harvest: any; onSuccess?: () => void }) {
    const form = useForm({
        defaultValues: {
            id: harvest.id,
            totalWeight: harvest.totalWeight?.toString() ?? "",
            harvestDate: harvest.harvestDate
                ? new Date(harvest.harvestDate).toISOString().split("T")[0]
                : "",
            variety: harvest.variety ?? "",
            notes: harvest.notes ?? "",
        },
    })

    const onSubmit = async (values: any) => {
        toast.promise(updateHarvest(values), {
            loading: "Menyimpan perubahan...",
            success: () => {
                onSuccess?.()
                return "Data produksi berhasil diperbarui!"
            },
            error: (err) => err.message,
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FieldGroup className="flex flex-col gap-4">

                {/* Berat */}
                <Controller
                    name="totalWeight"
                    control={form.control}
                    rules={{ required: "Berat wajib diisi" }}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Total Hasil Panen (Kg)</FieldLabel>
                            <div className="relative">
                                <Scale className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
                                <Input {...field} type="number" step="0.01" className="pl-9" />
                                <span className="absolute right-3 top-2 text-sm font-medium text-muted-foreground">Kg</span>
                            </div>
                            {fieldState.error && (
                                <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                            )}
                        </Field>
                    )}
                />

                {/* Tanggal */}
                <Controller
                    name="harvestDate"
                    control={form.control}
                    render={({ field }) => (
                        <Field>
                            <FieldLabel>Tanggal Panen</FieldLabel>
                            <Input {...field} type="date" />
                        </Field>
                    )}
                />

                {/* Varietas */}
                <Controller
                    name="variety"
                    control={form.control}
                    render={({ field }) => (
                        <Field>
                            <FieldLabel>Varietas (Opsional)</FieldLabel>
                            <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih varietas (opsional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Arabica">Arabica</SelectItem>
                                    <SelectItem value="Robusta">Robusta</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    )}
                />

                {/* Catatan */}
                <Controller
                    name="notes"
                    control={form.control}
                    render={({ field }) => (
                        <Field>
                            <FieldLabel>Catatan (Opsional)</FieldLabel>
                            <Textarea {...field} className="min-h-[80px]" />
                        </Field>
                    )}
                />

            </FieldGroup>

            <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="submit" className="gap-2 w-full">
                    <Save className="size-4" /> Simpan Perubahan
                </Button>
            </div>
        </form>
    )
}
