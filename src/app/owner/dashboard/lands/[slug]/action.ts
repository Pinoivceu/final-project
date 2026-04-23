"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getTask(landId: any) {


    try {
        const tasks = await prisma.task.findMany({
            where: {
                landId: String(landId) // Pastikan mencari berdasarkan kolom landId
            },
            include: {
                mandor: {
                    select: {
                        fullName: true,
                        image: true, // Ambil foto profil jika ada
                    }
                }
            }
        })


        return { success: true, tasks }
    } catch (error) {
        return { success: false, error }
    }
}

export async function createTask(values: any) {
    try {
        const { title, description, activityType, landId, dueDate } = values

        // 1. Validasi Input Dasar
        if (!title || !landId || !activityType) {
            throw new Error("Data tidak lengkap. Judul, Lahan, dan Tipe Aktivitas wajib diisi.")
        }

        // 2. Ambil data Lahan untuk mendapatkan mandorId secara otomatis
        const land = await prisma.land.findUnique({
            where: { id: landId },
            select: { mandorId: true, }
        })

        if (!land) {
            throw new Error("Lahan tidak ditemukan.")
        }

        // 3. Simpan Task ke Database
        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                activityType,
                status: "pending", // Status default saat tugas baru dibuat
                dueDate: dueDate ? new Date(dueDate) : null,
                landId,
                mandorId: land.mandorId, // Diambil dari data lahan
            },
        })

        revalidatePath(`/owner/land/${landId}`)

        return { success: true, data: newTask }

    } catch (error: any) {
        console.error("CREATE_TASK_ERROR:", error)
        return {
            success: false,
            error: error.message || "Gagal membuat tugas. Silakan coba lagi."
        }
    }
}
export async function createHarvest(values: any) {
    try {
        const { totalWeight, landId, harvestDate, notes } = values

        if (!totalWeight || totalWeight <= 0) {
            throw new Error("Berat panen tidak valid.")
        }


        const newHarvest = await prisma.harvest.create({
            data: {
                totalWeight: parseFloat(totalWeight),
                harvestDate: harvestDate || new Date(),
                notes: notes || "",
                landId: landId,
            },
        })

        revalidatePath(`/owner/dashboard/lands/${landId}`)
        return { success: true, data: newHarvest }

    } catch (error: any) {
        console.error("CREATE_HARVEST_ERROR:", error)
        throw new Error(error.message || "Gagal menyimpan data panen.")
    }
}


export async function createPlant(values: any) {
    try {
        const { variety, landId, locationCoordinate, activeBranches } = values

        // 1. Validasi Input Dasar
        if (!variety || !landId) {
            throw new Error("Data tidak lengkap. Varietas dan Lahan wajib diisi.")
        }

        // 2. Pastikan Lahan tersebut ada
        const land = await prisma.land.findUnique({
            where: { id: landId },
        })

        if (!land) {
            throw new Error("Lahan tidak ditemukan.")
        }

        // 3. Simpan Tanaman ke Database
        const newPlant = await prisma.plant.create({
            data: {
                variety,
                activeBranches: activeBranches ? parseInt(activeBranches) : 0,
                locationCoordinate, // Ini akan tersimpan sebagai JSON di Postgres
                status: "active",    // Status default
                landId: landId,
            },
        })


        revalidatePath(`/owner/dashboard/lands/${landId}`)

        return { success: true, data: newPlant }

    } catch (error: any) {
        console.error("CREATE_PLANT_ERROR:", error)
        return {
            success: false,
            error: error.message || "Gagal menambahkan tanaman baru."
        }
    }
}

export async function getProduction(landId: any) {


    try {
        const harvest = await prisma.harvest.findMany({
            where: {
                landId: String(landId) // Pastikan mencari berdasarkan kolom landId
            },
        })


        return { success: true, harvest }
    } catch (error) {
        return { success: false, harvest: [] }
    }
}

export async function deletePlant(plantId: any) {


    try {
        await prisma.plant.delete({ where: { id: plantId }, })

        revalidatePath("/owner/dashboard/land")

        return { success: true }
    } catch (error: any) {
        throw new Error(error.message || "Gagal menghapus user");
    }
}

export async function updateplantStatus(plantId: any) {


    try {

        const user = await prisma.user.findUnique({ where: { id: plantId }, select: { status: true } })
        let newStatus = "";
        if (user?.status === "active") {
            newStatus = "inactive";
        } else {
            newStatus = "active";
        }

        await prisma.user.update({
            where: { id: plantId },
            data: { status: newStatus }
        })
        revalidatePath("/owner/dashboard/lands/")
        return { success: true, }
    } catch (error) {
        return { success: false, error: "Terjadi kesalahan" }
    }
}

export async function deleteProduction(productionId: any) {


    try {
        await prisma.harvest.delete({ where: { id: productionId }, })

        revalidatePath("/owner/dashboard/land")

        return { success: true }
    } catch (error: any) {
        throw new Error(error.message || "Gagal menghapus user");
    }
}

export async function deleteTask(taskId: any) {


    try {
        await prisma.task.delete({ where: { id: taskId }, })

        revalidatePath("/owner/dashboard/land")

        return { success: true }
    } catch (error: any) {
        throw new Error(error.message || "Gagal menghapus user");
    }
}

export async function updateTask(values: any) {
    try {
        const { id, title, description, activityType, dueDate, status } = values;

        await prisma.task.update({
            where: { id: Number(id) }, // Pastikan dikonversi ke Number
            data: {
                title,
                description,
                activityType,
                status,
                dueDate: dueDate ? new Date(dueDate) : null,
            },
        });

        revalidatePath("/owner/dashboard/lands/[slug]");
        return { success: true };
    } catch (error: any) {
        throw new Error("Gagal memperbarui tugas.");
    }
}

export async function approveTask(task: any) {
    try {
        await prisma.task.update({
            where: { id: task.id },
            data: {
                status: "completed",
                verifiedAt: new Date(), // Mencatat waktu verifikasi oleh owner
                completedAt: new Date(), // Memastikan waktu selesai tercatat jika belum
            },
        })

        revalidatePath("/owner/dashboard/lands/[slug]")
        return { success: true }
    } catch (error) {
        throw new Error("Gagal menyetujui tugas.")
    }
}

export async function rejectTask(taskId: number, reason: string) {
    try {
        if (!reason || reason.trim() === "") {
            throw new Error("Alasan penolakan wajib diisi.")
        }

        await prisma.task.update({
            where: { id: taskId },
            data: {
                status: "pending",       // Status balik ke awal agar dikerjakan lagi
                rejectionReason: reason, // Simpan alasan kenapa ditolak sebelumnya
                completedAt: null,       // Hapus tanggal selesai sebelumnya
                startedAt: null,         // Reset agar mandor harus menekan "Mulai" lagi
                verifiedAt: null,        // Pastikan verifikasi kosong
            },
        })

        revalidatePath("/owner/dashboard/lands/[slug]")
        return { success: true }
    } catch (error: any) {
        console.error("REJECT_TASK_ERROR:", error)
        throw new Error(error.message || "Gagal menolak tugas.")
    }
}

export async function editLand(values: any) {
    try {
        const { id, landName, areaSize, locationAddress, mandorId, image } = values;

        if (!id || !landName || !areaSize || !mandorId) {
            throw new Error("Data wajib tidak lengkap.");
        }

        const dataToUpdate: any = {
            landName,
            areaSize: parseFloat(areaSize),
            locationAddress,
            mandorId
        };

        // Only update image if a new one was uploaded
        if (image !== undefined) {
            dataToUpdate.image = image;
        }

        const updatedLand = await prisma.land.update({
            where: { id },
            data: dataToUpdate
        });

        revalidatePath(`/owner/dashboard/lands/${id}`);
        revalidatePath("/owner/maps");

        return { success: true, data: updatedLand };
    } catch (error: any) {
        console.error("EDIT_LAND_ERROR:", error);
        return { success: false, error: error.message || "Gagal memperbarui lahan." };
    }
}