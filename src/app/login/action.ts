"use server"
import * as argon2 from "argon2";
import { loginSchema } from "@/lib/validation/auth";
import prisma from "../../../lib/prisma";
import { createSession } from "@/lib/session";

export async function authenticateUser(formData: any) {

    const validated = loginSchema.safeParse(formData);

    if (!validated.success) return { error: "Format data tidak valid" };

    const { username, password } = validated.data;

    try {

        const user = await prisma.user.findUnique({

            where: { username },

        });

        if (!user) return { error: "Username atau Password salah" };

        const isMatch = await argon2.verify(user.password, password);

        if (!isMatch) return { error: "Username atau Password salah" };

        await createSession(

            user.id,

            user.role,
            
        );

        return { success: true };

    } catch (err) {

        console.error(err); 

        return { error: "Terjadi kesalahan sistem" };
    }

}