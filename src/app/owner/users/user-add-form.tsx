"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { createUser } from "./action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogClose } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"


export function UserAddForm() {
  const form = useForm({
    defaultValues: {
      fullName: "",
      username: "",
      role: "mandor",
      phoneNumber: "",
    },
  })

  const onSubmit = async (values: any) => {
      toast.promise(createUser(values), {
        loading: "Menyimpan user...",
        success: (data) => {
          return "User berhasil disimpan!";
        },
        error: (err) => {
          return 'Gagal menyimpan user'
        },
        position: "top-right"
      })
  }

  return (
    <form id="add-user-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="flex flex-col gap-4">

        {/* Full Name */}
        <Controller
          name="fullName"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="fullName">Nama Lengkap</FieldLabel>
              <Input
                {...field}
                id="fullName"
                placeholder="Masukkan nama lengkap"
                autoComplete="off"
              />
            </Field>
          )}
        />

        {/* Username */}
        <Controller
          name="username"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                {...field}
                id="username"
                placeholder="Contoh: pino_01"
                autoComplete="off"
              />
            </Field>
          )}
        />

        {/* Role (Select) */}
        <Controller
          name="role"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="mandor">Mandor</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        {/* Phone Number */}
        <Controller
          name="phoneNumber"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="phoneNumber">Nomor Telepon</FieldLabel>
              <Input
                {...field}
                id="phoneNumber"
                placeholder="0812..."
                autoComplete="off"
              />
            </Field>
          )}
        />

      </FieldGroup>

      <div className="flex justify-end pt-4">
        <DialogClose
          render={<Button type="submit">Simpan</Button>}
        />
      </div>
    </form>
  )
}