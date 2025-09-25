import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo', // Replace with your cloud name or use environment variable
  api_key: process.env.CLOUDINARY_API_KEY || '', // Replace with your API key or use environment variable
  api_secret: process.env.CLOUDINARY_API_SECRET || '', // Replace with your API secret or use environment variable
  secure: true
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ success: false, message: 'Invalid file type. Only JPEG, PNG and WEBP allowed' }, { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64Data}`;
    
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: 'cam-app-thumbnails', // Organize uploads in a folder
          resource_type: 'image',
          transformation: [
            { width: 1280, height: 720, crop: 'limit' }, // Standardize size for thumbnails
            { quality: 'auto:good' } // Optimize quality
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });
    
    // Return the Cloudinary URL
    const cloudinaryResult = result as any; // Type cast for TypeScript
    const fileUrl = cloudinaryResult.secure_url;

    return NextResponse.json({ 
      success: true, 
      message: 'File uploaded successfully to Cloudinary',
      fileUrl,
      public_id: cloudinaryResult.public_id
    });
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    return NextResponse.json({ success: false, message: 'File upload failed' }, { status: 500 });
  }
}