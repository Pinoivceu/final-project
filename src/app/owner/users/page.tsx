import { DataTable } from "./users-table";
import { columns } from "./column"
import prisma from "@/lib/prisma";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { UserAddForm } from "./user-add-form";

export default async function UserPage() {

    const users = await prisma.user.findMany()


    return (
        <div className="size-full p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Users Table</h1>

                <Dialog>
                    <DialogTrigger
                        render={<Button>+ Tambah User</Button>}
                    />
                    <DialogContent >
                        <DialogHeader>
                            <DialogTitle>Tambah User Baru</DialogTitle>
                            <DialogDescription>
                                Lengkapi data di bawah untuk membuat akun baru.
                            </DialogDescription>
                        </DialogHeader>

                        <UserAddForm />
                    </DialogContent>
                </Dialog>
            </div>
            <DataTable columns={columns} data={users} />

        </div>
    )
}
