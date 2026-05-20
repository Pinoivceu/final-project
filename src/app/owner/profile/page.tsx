import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import { ProfileForm } from "./profile-form"

export default async function ProfilePage() {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    const payload = await decrypt(sessionToken)
    
    if (!payload?.userId) {
        return <div>Sesi tidak valid. Silakan login kembali.</div>
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.userId as string },
    })

    if (!user) {
        return <div>Pengguna tidak ditemukan.</div>
    }

    return (
        <div className="size-full bg-background flex flex-col gap-6 p-6 lg:p-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Profil Pengguna</h1>
                <p className="text-muted-foreground text-sm">
                    Kelola informasi profil dan kredensial Anda di sini.
                </p>
            </div>
            
            <div className="max-w-2xl bg-card border border-border rounded-xl p-6 shadow-sm">
                <ProfileForm user={user} />
            </div>
        </div>
    )
}
