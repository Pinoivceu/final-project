import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// This API route handles multipart/form-data uploads
export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    // Category determines which folder it goes into (users, lands, tasks)
    const category = data.get('category') as string || 'tasks'; 

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan dalam form.' }, { status: 400 });
    }

    // Security check: Only allow images
    if (!file.type.startsWith('image/')) {
       return NextResponse.json({ error: 'Hanya file gambar yang diperbolehkan.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename to avoid overwriting (e.g. 1678123456_myphoto.jpg)
    // Remove spaces and special characters from original name for safety
    const safeOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}_${safeOriginalName}`;
    
    // Construct the absolute path where the file will be saved
    // process.cwd() points to the root of the frontend project
    const uploadDir = join(process.cwd(), 'public', 'uploads', category);
    const filePath = join(uploadDir, filename);

    // Save the file
    await writeFile(filePath, buffer);

    // The URL that will be saved in the database
    const fileUrl = `/uploads/${category}/${filename}`;

    return NextResponse.json({ 
        success: true, 
        message: 'File berhasil diunggah',
        url: fileUrl 
    }, { status: 201 });

  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat menyimpan gambar.' }, { status: 500 });
  }
}
