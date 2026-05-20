import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

// This API route handles multipart/form-data uploads using Vercel Blob Storage
export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    // Category determines the folder prefix (users, lands, tasks, profiles)
    const category = data.get('category') as string || 'tasks'; 

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan dalam form.' }, { status: 400 });
    }

    // Security check: Only allow images
    if (!file.type.startsWith('image/')) {
       return NextResponse.json({ error: 'Hanya file gambar yang diperbolehkan.' }, { status: 400 });
    }

    // Generate unique filename to avoid overwriting
    const safeOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${category}/${Date.now()}_${safeOriginalName}`;
    
    // Upload to Vercel Blob Storage
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({ 
        success: true, 
        message: 'File berhasil diunggah',
        url: blob.url 
    }, { status: 201 });

  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    const errorName = error?.name || 'UnknownError';
    
    console.error('[upload] Upload failed:', {
      name: errorName,
      message: errorMessage,
      stack: error?.stack,
    });

    return NextResponse.json({ 
      error: `Upload gagal: ${errorMessage}`,
      debug: {
        name: errorName,
        message: errorMessage,
        hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      }
    }, { status: 500 });
  }
}
