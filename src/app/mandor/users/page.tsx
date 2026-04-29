import prisma from "@/lib/prisma"
import { decrypt } from "@/lib/session"
import { cookies } from "next/headers"
import { UserCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "./profile-form"
import { PasswordForm } from "./password-form"

export default async function MandorUserPage() {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    const payload = await decrypt(sessionToken)
    const mandorId = payload?.userId as string

    // Fetch user profile
    const user = await prisma.user.findUnique({
        where: { id: mandorId },
        select: {
            id: true,
            fullName: true,
            username: true,
            phoneNumber: true,
            role: true,
            joinedAt: true,
            image: true,
        },
    })

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Profil tidak ditemukan.</p>
            </div>
        )
    }

    return (
        <div className="size-full bg-background flex flex-col gap-8 p-6 lg:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <UserCircle className="size-7 text-foreground" />
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Profil Pengguna</h1>
                </div>
                <p className="text-muted-foreground text-sm">
                    Kelola informasi pribadi dan pengaturan keamanan akun Anda.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Profile Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Profil</CardTitle>
                        <CardDescription>
                            Perbarui nama lengkap dan nomor telepon Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileForm user={user} />
                    </CardContent>
                </Card>

                {/* Password Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Keamanan Akun</CardTitle>
                        <CardDescription>
                            Ubah password Anda secara berkala untuk menjaga keamanan akun.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PasswordForm userId={user.id} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
