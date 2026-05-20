"use client"

import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogClose } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { MapPin, Sprout, Save } from "lucide-react"
import { createPlant, updatePlant } from "./action"

// ─── Add Plant Form ───────────────────────────────────────────────────────────

export function AddPlantForm({ landId, onSuccess }: { landId: string; onSuccess?: () => void }) {
    const form = useForm({
        defaultValues: {
            variety: "",
            lat: "",
            lng: "",
            plantedAt: "",
            landId,
        },
    })

    const onSubmit = async (values: any) => {
        toast.promise(createPlant(values), {
            loading: "Menanam tanaman baru...",
            success: () => {
                form.reset()
                onSuccess?.()
                return "Tanaman berhasil ditambahkan!"
            },
            error: (err) => err.message,
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FieldGroup className="flex flex-col gap-4">

                {/* Varietas */}
                <Controller
                    name="variety"
                    control={form.control}
                    rules={{ required: "Varietas wajib diisi" }}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="variety">Varietas / Jenis Tanaman</FieldLabel>
                            <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                <SelectTrigger id="variety">
                                    <SelectValue placeholder="Pilih varietas tanaman" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Arabica">Arabica</SelectItem>
                                    <SelectItem value="Robusta">Robusta</SelectItem>
                                </SelectContent>
                            </Select>
                            {fieldState.error && (
                                <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                            )}
                        </Field>
                    )}
                />

                {/* Tanggal Tanam */}
                <Controller
                    name="plantedAt"
                    control={form.control}
                    render={({ field }) => (
                        <Field>
                            <FieldLabel htmlFor="plantedAt">Tanggal Tanam </FieldLabel>
                            <Input {...field} id="plantedAt" type="date" />
                        </Field>
                    )}
                />

                {/* Koordinat */}
                <div className="grid grid-cols-2 gap-4">
                    <Controller
                        name="lat"
                        control={form.control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel htmlFor="lat">Latitude</FieldLabel>
                                <div className="relative">
                                    <Input {...field} id="lat" type="number" step="any" placeholder="-3.1234" />
                                    <MapPin className="absolute right-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </Field>
                        )}
                    />
                    <Controller
                        name="lng"
                        control={form.control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel htmlFor="lng">Longitude</FieldLabel>
                                <div className="relative">
                                    <Input {...field} id="lng" type="number" step="any" placeholder="102.5678" />
                                    <MapPin className="absolute right-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </Field>
                        )}
                    />
                </div>
                <p className="text-[10px] text-muted-foreground italic -mt-2">
                    * Koordinat opsional, digunakan untuk pemetaan distribusi tanaman.
                </p>

            </FieldGroup>

            <div className="flex justify-end gap-2 pt-2 border-t">
                <DialogClose render={<Button variant="outline" type="button">Batal</Button>} />
                <Button type="submit" className="gap-2">
                    <Sprout className="size-4" /> Tambah Tanaman
                </Button>
            </div>
        </form>
    )
}

// ─── Edit Plant Form ──────────────────────────────────────────────────────────

export function EditPlantForm({ plant, onSuccess }: { plant: any; onSuccess?: () => void }) {
    const loc = plant.locationCoordinate as { lat?: number; lng?: number } | null

    const form = useForm({
        defaultValues: {
            id: plant.id,
            variety: plant.variety ?? "",
            lat: loc?.lat?.toString() ?? "",
            lng: loc?.lng?.toString() ?? "",
            plantedAt: plant.plantedAt
                ? new Date(plant.plantedAt).toISOString().split("T")[0]
                : "",
            status: plant.status ?? "active",
        },
    })

    const onSubmit = async (values: any) => {
        toast.promise(updatePlant(values), {
            loading: "Menyimpan perubahan...",
            success: () => {
                onSuccess?.()
                return "Tanaman berhasil diperbarui!"
            },
            error: (err) => err.message,
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FieldGroup className="flex flex-col gap-4">

                {/* Varietas */}
                <Controller
                    name="variety"
                    control={form.control}
                    rules={{ required: "Varietas wajib diisi" }}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Varietas / Jenis Tanaman</FieldLabel>
                            <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih varietas tanaman" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Arabica">Arabica</SelectItem>
                                    <SelectItem value="Robusta">Robusta</SelectItem>
                                </SelectContent>
                            </Select>
                            {fieldState.error && (
                                <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                            )}
                        </Field>
                    )}
                />

                {/* Status */}
                <Controller
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                        <Field>
                            <FieldLabel>Status</FieldLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">🟢 Aktif</SelectItem>
                                    <SelectItem value="inactive">🔴 Tidak Aktif</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    )}
                />

                {/* Tanggal Tanam */}
                <Controller
                    name="plantedAt"
                    control={form.control}
                    render={({ field }) => (
                        <Field>
                            <FieldLabel>Tanggal Tanam</FieldLabel>
                            <Input {...field} type="date" />
                        </Field>
                    )}
                />

                {/* Koordinat */}
                <div className="grid grid-cols-2 gap-4">
                    <Controller
                        name="lat"
                        control={form.control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel>Latitude</FieldLabel>
                                <Input {...field} type="number" step="any" />
                            </Field>
                        )}
                    />
                    <Controller
                        name="lng"
                        control={form.control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel>Longitude</FieldLabel>
                                <Input {...field} type="number" step="any" />
                            </Field>
                        )}
                    />
                </div>

            </FieldGroup>

            <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="submit" className="gap-2 w-full">
                    <Save className="size-4" /> Simpan Perubahan
                </Button>
            </div>
        </form>
    )
}
