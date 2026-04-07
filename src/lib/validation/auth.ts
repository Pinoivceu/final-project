import * as z from "zod"

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter.")
    .max(20, "Username maksimal 20 karakter.")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore."),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter.")
    .max(100, "Password terlalu panjang.")
});