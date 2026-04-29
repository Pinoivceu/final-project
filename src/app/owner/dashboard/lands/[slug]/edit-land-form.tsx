"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { editLand } from "./action"
import { Loader2, UploadCloud, CheckCircle2 } from "lucide-react"
import Image from "next/image"

export default function EditLandForm({
  land,
  mandors,
  onSuccess
}: {
  land: any
  mandors: any[]
  onSuccess?: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(land?.image || null)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    landName: land?.landName ?? "",
    areaSize: land?.areaSize?.toString() ?? "",
    locationAddress: land?.locationAddress ?? "",
    mandorId: land?.mandorId ?? ""
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    setFile(selectedFile)
    // Show local preview immediately
    setPreviewUrl(URL.createObjectURL(selectedFile))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      let imageUrl = land?.image ?? undefined

      // If a new file was chosen, upload it first
      if (file) {
        const uploadForm = new FormData()
        uploadForm.append("file", file)
        uploadForm.append("category", "lands")

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm
        })
        const uploadData = await uploadRes.json()

        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "Gagal mengunggah gambar.")
        }
        imageUrl = uploadData.url
      }

      const result = await editLand({
        id: land.id,
        ...formData,
        image: imageUrl
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      setSaved(true)
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
      {/* Cover image preview */}
      <div className="w-full h-36 rounded-lg border overflow-hidden bg-muted relative group cursor-pointer">
        {previewUrl ? (
          <Image src={previewUrl} alt="Preview" fill className="object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
            <UploadCloud className="h-8 w-8" />
            <span className="text-sm">Belum ada foto</span>
          </div>
        )}
        <label htmlFor="image-input" className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <span className="text-white text-sm font-medium flex items-center gap-2"><UploadCloud className="h-4 w-4" /> Ganti Foto</span>
        </label>
        <input
          id="image-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="landName">Nama Lahan</Label>
          <Input
            id="landName"
            value={formData.landName}
            onChange={(e) => setFormData({ ...formData, landName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="areaSize">Luas Lahan (Ha)</Label>
          <Input
            id="areaSize"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.areaSize}
            onChange={(e) => setFormData({ ...formData, areaSize: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="mandorId">Mandor</Label>
          <Select
            value={formData.mandorId}
            onValueChange={(val) => setFormData({ ...formData, mandorId: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Mandor" />
            </SelectTrigger>
            <SelectContent>
              {mandors.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.fullName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="locationAddress">Alamat Lengkap</Label>
          <Textarea
            id="locationAddress"
            rows={2}
            value={formData.locationAddress}
            onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</p>
      )}

      <div className="flex justify-end pt-2">
        {saved ? (
          <p className="flex items-center gap-2 text-sm text-primary font-medium">
            <CheckCircle2 className="h-4 w-4" /> Perubahan tersimpan!
          </p>
        ) : (
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
            ) : "Simpan Perubahan"}
          </Button>
        )}
      </div>
    </form>
  )
}
