"use client"

import { useForm, Controller } from "react-hook-form"
import { createHarvest, createPlant, createTask, updateTask } from "./action" // Pastikan action ini sudah dibuat
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogClose } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { CalendarIcon, ClipboardList, NotebookPen, Save, Scale } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Sprout, MapPin } from "lucide-react"




export function AddTaskForm({ landId }: { landId: any }) {

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      activityType: "",
      landId: landId,
      dueDate: "", // Bisa menggunakan input date standar atau Popover Calendar
    },
  })

  const onSubmit = async (values: any) => {
    toast.promise(createTask(values), {
      loading: "Membuat tugas baru...",
      success: (data) => {
        form.reset()
        return "Tugas berhasil ditambahkan!"
      },
      error: (err) => {
        return err.message || "Terjadi kesalahan saat menyimpan tugas";
      },
      position: "top-right"
    })
  }

  return (
    <form id="add-task-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="flex flex-col gap-4">

        {/* Judul Tugas */}
        <Controller
          name="title"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="title">Judul Tugas</FieldLabel>
              <Input {...field} id="title" placeholder="Contoh: Pemupukan NPK" />
            </Field>
          )}
        />

        {/* Tipe Aktivitas */}
        <Controller
          name="activityType"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="activityType">Tipe Aktivitas</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger id="activityType">
                  <SelectValue placeholder="Pilih jenis pekerjaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pemupukan">Pemupukan</SelectItem>
                  <SelectItem value="Pemangkasan">Pemangkasan</SelectItem>
                  <SelectItem value="Penyemprotan">Penyemprotan</SelectItem>
                  <SelectItem value="Panen">Panen</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        {/* Batas Waktu (Due Date) */}
        <Controller
          name="dueDate"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="dueDate">Batas Waktu</FieldLabel>
              <div className="relative">
                <Input {...field} id="dueDate" type="date" className="block w-full" />
              </div>
            </Field>
          )}
        />

        {/* Deskripsi */}
        <Controller
          name="description"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="description">Instruksi / Deskripsi</FieldLabel>
              <Textarea
                {...field}
                id="description"
                placeholder="Detail instruksi untuk mandor..."
                className="min-h-25"
              />
            </Field>
          )}
        />

      </FieldGroup>

      <div className="flex justify-end pt-4 gap-2">
        <DialogClose render={<Button variant="outline" type="button">Batal</Button>} />

        <Button type="submit" className="gap-2">
          <ClipboardList className="size-4" />
          Tugaskan Sekarang
        </Button>
      </div>
    </form>
  )
}

export function AddPlantForm({ landId }: { landId: string }) {

  const form = useForm({
    defaultValues: {
      variety: "",
      lat: "", // Input sementara untuk koordinat
      lng: "", // Input sementara untuk koordinat
      landId: landId,
      activeBranches: 0, // Default value sesuai schema jika diperlukan
    },
  })

  const onSubmit = async (values: any) => {
    // Transformasi lat & lng menjadi objek locationCoordinate
    const payload = {
      variety: values.variety,
      landId: values.landId,
      activeBranches: values.activeBranches,
      locationCoordinate: {
        lat: parseFloat(values.lat),
        lng: parseFloat(values.lng)
      }
    }

    toast.promise(createPlant(payload), {
      loading: "Menanam tanaman baru...",
      success: () => {
        form.reset()
        return "Tanaman berhasil ditambahkan ke lahan!"
      },
      error: (err) => {
        return err.message || "Terjadi kesalahan saat menyimpan data tanaman";
      },
      position: "top-right"
    })
  }

  return (
    <form id="add-plant-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="flex flex-col gap-4">

        {/* Varietas Tanaman */}
        <Controller
          name="variety"
          control={form.control}
          render={({ field }) => (
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
            </Field>
          )}
        />

        {/* Koordinat Lokasi */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="lat"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="lat">Latitude</FieldLabel>
                <div className="relative">
                  <Input {...field} id="lat" type="number" step="any" placeholder="-3.1234" />
                  <MapPin className="absolute right-3 top-2.5 size-4 text-muted-foreground" />
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
                  <MapPin className="absolute right-3 top-2.5 size-4 text-muted-foreground" />
                </div>
              </Field>
            )}
          />
        </div>

        <p className="text-[10px] text-muted-foreground italic">
          * Masukkan koordinat spesifik tanaman untuk pemetaan yang akurat.
        </p>

      </FieldGroup>

      <div className="flex justify-end pt-4 gap-2">
        <DialogClose render={<Button variant="outline" type="button">Batal</Button>
        }>
        </DialogClose>

        <Button type="submit" className="gap-2">
          <Sprout className="size-4" />
          Tambah Tanaman
        </Button>
      </div>
    </form>
  )
}

export function AddProductionForm({ landId }: { landId: string }) {

  const form = useForm({
    defaultValues: {
      totalWeight: "",
      harvestDate: new Date().toISOString().split("T")[0],
      variety: "",
      notes: "", // Field baru untuk catatan
      landId: landId,
    },
  })

  const onSubmit = async (values: any) => {
    const payload = {
      ...values,
      totalWeight: parseFloat(values.totalWeight),
      harvestDate: values.harvestDate ? new Date(values.harvestDate) : new Date(),
    }

    toast.promise(createHarvest(payload), {
      loading: "Mencatat hasil panen...",
      success: () => {
        form.reset()
        return "Data produksi berhasil dicatat!"
      },
      error: (err) => {
        return err.message || "Gagal mencatat hasil produksi";
      },
      position: "top-right"
    })


  }

  return (
    <form id="add-production-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="flex flex-col gap-5">

        {/* Input Berat */}
        <Controller
          name="totalWeight"
          control={form.control}
          rules={{ required: "Berat wajib diisi" }}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="totalWeight">Total Hasil Panen (Kilogram)</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id="totalWeight"
                  type="number"
                  step="0.01"
                  placeholder="Contoh: 25.5"
                  className="pl-10"
                />
                <Scale className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <div className="absolute right-3 top-2 text-sm font-medium text-muted-foreground">
                  Kg
                </div>
              </div>
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

        {/* Input Catatan (Notes) */}
        <Controller
          name="notes"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="notes">Catatan Produksi (Opsional)</FieldLabel>
              <div className="relative">
                <Textarea
                  {...field}
                  id="notes"
                  placeholder="Contoh: Kualitas buah sangat baik, cuaca cerah saat panen..."
                  className="min-h-25 pt-3"
                />
              </div>
            </Field>
          )}
        />

      </FieldGroup>

      <div className="flex justify-end pt-4 gap-2">
        <DialogClose render={<Button variant="outline" type="button">Batal</Button>
        }>
        </DialogClose>

        <Button type="submit" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          <NotebookPen className="size-4" />
          Simpan Produksi
        </Button>
      </div>
    </form>
  )
}


export function EditTaskForm({ task, onSuccess }: { task: any; onSuccess: () => void }) {
  const form = useForm({
    defaultValues: {
      id: task.id,
      title: task.title,
      description: task.description || "",
      activityType: task.activityType,
      status: task.status,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
    },
  })

  const onSubmit = async (values: any) => {
    toast.promise(updateTask(values), {
      loading: "Memperbarui tugas...",
      success: () => {
        onSuccess();
        return "Tugas berhasil diperbarui!";
      },
      error: (err) => err.message || "Gagal memperbarui tugas",
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <FieldGroup className="flex flex-col gap-4">

        {/* Judul */}
        <Controller
          name="title"
          control={form.control}
          rules={{ required: "Judul wajib diisi" }}
          render={({ field }) => (
            <Field>
              <FieldLabel>Judul Tugas</FieldLabel>
              <Input {...field} />
            </Field>
          )}
        />

        {/* Tipe & Status dalam satu baris */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="activityType"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Tipe Aktivitas</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pemupukan">Pemupukan</SelectItem>
                    <SelectItem value="Pemangkasan">Pemangkasan</SelectItem>
                    <SelectItem value="Penyemprotan">Penyemprotan</SelectItem>
                    <SelectItem value="Panen">Panen</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="on_approval">On Approval</SelectItem>
                    <SelectItem value="rejected_by_mandor">Ditolak Mandor</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>

        {/* Tanggal */}
        <Controller
          name="dueDate"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Batas Waktu</FieldLabel>
              <Input {...field} type="date" />
            </Field>
          )}
        />

        {/* Deskripsi */}
        <Controller
          name="description"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Deskripsi</FieldLabel>
              <Textarea {...field} rows={3} placeholder="Instruksi tugas..." />
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="submit" className="w-full gap-2 bg-primary">
          <Save className="size-4" />
          Simpan Perubahan
        </Button>
      </div>
    </form>
  )
}