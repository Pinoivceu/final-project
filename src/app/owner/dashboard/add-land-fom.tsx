"use client"

import { useForm, Controller } from "react-hook-form"
import { createLahan } from "./action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogClose } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import MapEditor from "./map-editor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MapIcon, CheckCircle2 } from "lucide-react"


// Asumsi mandorData dioper dari parent atau di-fetch
interface Mandor {
  id: string
  fullName: string
}

export function LahanAddForm({ mandors }: { mandors: Mandor[] }) {

  const form = useForm({
    defaultValues: {
      nama: "",
      lokasi: "",
      mandorId: "",
      luas: 0,
      polygon: null,
      image: null,
    },
  })

  // Watch nilai polygon untuk validasi visual di UI
  const currentPolygon = form.watch("polygon")



  const onSubmit = async (values: any) => {


    toast.promise(createLahan(values), {
      loading: "Menyimpan data lahan...",
      success: () => {
        form.reset()
        return "Lahan berhasil ditambahkan!"
      },
      error: (err) => {
        // Ambil pesan error-nya saja, jangan dibungkus 'new Error' lagi
        return err.message || "Terjadi kesalahan saat menyimpan";
      },
      position: "top-right"
    })
  }

  return (
    <form id="add-lahan-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="flex flex-col gap-4">

        {/* Nama Lahan */}
        <Controller
          name="nama"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="nama">Nama Lahan</FieldLabel>
              <Input {...field} id="nama" placeholder="Contoh: Lahan A" />
            </Field>
          )}
        />

        {/* Alamat */}
        <Controller
          name="lokasi"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="lokasi">Alamat</FieldLabel>
              <Input {...field} id="lokasi" placeholder="Lokasi fisik lahan" />
            </Field>
          )}
        />

        {/* Gambar Lahan */}
        <Controller
          name="image"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="image">Gambar Lahan (Opsional)</FieldLabel>
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
                  } else {
                    field.onChange(null);
                  }
                }}
              />
            </Field>
          )}
        />

        {/* Dropdown Mandor */}
        <Controller
          name="mandorId"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="mandor">Pilih Mandor</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger id="mandor">
                  <SelectValue placeholder="Pilih Mandor Penanggung Jawab">
                    {field.value ? mandors.find((m) => m.id === field.value)?.fullName : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {mandors.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        {/* Button Trigger Map */}
        <Field>
          <FieldLabel>Area Lahan</FieldLabel>

          {/* 2. RENDER DIALOG UNTUK PETA */}
          <div className="p-3 border bo rounded-md mb-4">
            <p className="text-sm ">
              Estimasi Luas Area: <strong>{form.watch("luas").toFixed(2)} m²</strong>
            </p>
          </div>
          <Dialog>
            <DialogTrigger render={(props) => (
              <Button
                {...props}
                type="button"
                variant="secondary"
                className={`w-full flex justify-between `}
              >
                <div className="flex items-center gap-2">
                  <MapIcon className="size-4" />
                  {currentPolygon ? "Ubah Area Lahan" : "Gambar Area di Peta"}
                </div>
                {currentPolygon && <CheckCircle2 className="size-4 text-green-600" />}
              </Button>
            )} />

            <DialogContent className="sm:max-w-200">
              <DialogHeader>
                <DialogTitle>Pemetaan Area Lahan</DialogTitle>
              </DialogHeader>

              <div className="py-4">
                {/* 3. RENDER MAP EDITOR */}
                <MapEditor
                  onSave={(geojson, area) => {
                    // Update nilai polygon ke dalam React Hook Form
                    form.setValue("polygon", geojson);
                      form.setValue("luas", area);
                  }}
                />
                <p className="text-[10px] text-muted-foreground mt-2 italic">
                  * Gunakan alat di kiri atas peta. Klik titik demi titik dan tutup di titik awal untuk membentuk polygon.
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => {
                  // Tombol ini hanya untuk menutup dialog karena data sudah masuk via onSave
                  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
                }}>
                  Simpan Koordinat
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </Field>

      </FieldGroup>

      <div className="flex justify-end pt-4 gap-2">
        <DialogClose render={(props) => (
          <Button {...props} variant="outline" type="button">Batal</Button>
        )} />
        <Button type="submit">Simpan Lahan</Button>
      </div>
    </form>
  )
}