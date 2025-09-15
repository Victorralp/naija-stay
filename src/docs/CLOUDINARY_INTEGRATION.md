# Cloudinary Integration Guide

This document explains how Cloudinary is integrated into the NaijaStay application for image and video management.

## Setup Instructions

1. Sign up for a Cloudinary account at [https://cloudinary.com](https://cloudinary.com)
2. Obtain your Cloud Name from the Cloudinary dashboard
3. Create an unsigned upload preset in your Cloudinary account:
   - Go to Settings > Upload
   - Scroll to "Upload presets" section
   - Click "Add upload preset"
   - Set "Signing Mode" to "Unsigned"
   - Give it a name (e.g., "naija_stay_unsigned")
   - Configure any other settings as needed:
     - Folder: "naija-stay" (or your preferred folder)
     - Format: "auto"
     - Quality: "auto"
     - Allowed file types: "image" and "video"
   - Click "Save"
4. Update the `.env` file with your Cloudinary credentials:

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name
```

## Common Upload Preset Configuration Issues

If you receive the error "Upload preset must be whitelisted for unsigned uploads", check the following:

1. **Signing Mode**: Ensure the upload preset is set to "Unsigned" (not "Signed")
2. **Preset Name**: Ensure the preset name in your `.env` file matches exactly with the one in Cloudinary
3. **Allowed File Types**: Ensure both "image" and "video" are allowed in the upload preset settings
4. **Folder Settings**: Ensure the folder setting is configured correctly

## CORS Configuration

If you encounter CORS errors when uploading files, you have two options:

### Option 1: Configure CORS in Cloudinary (Recommended for Production)

1. Go to your Cloudinary dashboard
2. Navigate to Settings > Security
3. In the "CORS" section, add your domain to the allowed origins:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
4. Save the changes

### Option 2: Use Vite Proxy (Recommended for Development)

The application is configured to use a Vite proxy to handle CORS issues during development:

1. The proxy is already configured in `vite.config.ts`
2. All Cloudinary requests are routed through `/api/cloudinary` which proxies to `https://api.cloudinary.com`
3. No additional configuration is needed

## How It Works

The Cloudinary integration is implemented through several components:

### 1. Cloudinary Configuration (`src/lib/cloudinary.ts`)

This file provides helper functions for client-side media management:

- `uploadToCloudinary()` - Uploads a single file using unsigned upload
- `uploadMultipleToCloudinary()` - Uploads multiple files
- `getOptimizedImageUrl()` - Generates optimized image URLs
- `getOptimizedVideoUrl()` - Generates optimized video URLs

Note: The delete function requires server-side authentication and is not implemented in the client-side code.

### 2. Storage Service (`src/services/storageService.ts`)

The storage service provides a unified interface for media management:

- `uploadImage()` - Uploads an image to Cloudinary
- `uploadImages()` - Uploads multiple images to Cloudinary
- `uploadVideo()` - Uploads a video to Cloudinary
- `uploadVideos()` - Uploads multiple videos to Cloudinary
- `getOptimizedImage()` - Gets an optimized image URL
- `getOptimizedVideo()` - Gets an optimized video URL

### 3. Admin Dashboard (`src/pages/AdminDashboard.tsx`)

The admin dashboard includes a media management section that allows administrators to upload images and videos directly to Cloudinary.

## Client-Side vs Server-Side Operations

### Client-Side (Browser)
- Upload images and videos using unsigned uploads
- Generate optimized URLs with transformations
- No server required for basic operations

### Server-Side (Backend)
- Delete media files (requires authentication)
- Signed uploads for better security
- Advanced transformations
- Media management operations

For server-side operations, you would need to implement a backend service using the Cloudinary Node.js SDK.

## Features

- **Image Upload**: Upload hotel and room images with automatic optimization
- **Video Upload**: Upload promotional videos and room tours
- **Automatic Optimization**: Images and videos are automatically optimized for web delivery
- **Responsive Delivery**: Media is automatically sized based on device requirements
- **Format Conversion**: Automatic conversion to modern formats like WebP and AVIF when supported

## Usage Examples

### Uploading an Image

```typescript
import { uploadImage } from '@/services/storageService';

const handleImageUpload = async (file: File) => {
  try {
    const imageUrl = await uploadImage(file, 'hotel-images');
    console.log('Image uploaded:', imageUrl);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Uploading a Video

```typescript
import { uploadVideo } from '@/services/storageService';

const handleVideoUpload = async (file: File) => {
  try {
    const videoUrl = await uploadVideo(file, 'hotel-videos');
    console.log('Video uploaded:', videoUrl);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Getting Optimized Media URLs

```typescript
import { getOptimizedImage, getOptimizedVideo } from '@/services/storageService';

// Get an optimized image with specific transformations
const optimizedImageUrl = getOptimizedImage(originalImageUrl, {
  width: 800,
  height: 600,
  crop: 'fill',
  quality: 'auto:good'
});

// Get an optimized video with specific transformations
const optimizedVideoUrl = getOptimizedVideo(originalVideoUrl, {
  width: 1280,
  height: 720,
  quality: 'auto:good'
});
```

## Benefits

1. **Improved Performance**: Automatic optimization reduces file sizes without compromising quality
2. **Responsive Images**: Automatic sizing for different devices and screen resolutions
3. **Format Conversion**: Automatic conversion to modern formats for better compression
4. **CDN Delivery**: Fast global delivery through Cloudinary's CDN
5. **Transformations**: On-the-fly image and video transformations
6. **Scalability**: Handles any volume of media files without impacting application performance

## Security Considerations

- Uses unsigned uploads for client-side operations (less secure but convenient)
- For production applications, consider implementing signed uploads with a backend
- API credentials are stored in environment variables
- Upload presets control upload behavior and security settings

## Troubleshooting

If you encounter issues with Cloudinary integration:

1. **"Upload preset must be whitelisted for unsigned uploads"**:
   - Verify the upload preset is set to "Unsigned" in Cloudinary
   - Check that the preset name matches exactly in your `.env` file
   - Ensure the preset allows the file types you're uploading

2. **CORS Errors**:
   - Configure CORS in your Cloudinary account settings (Option 1)
   - Or ensure the Vite proxy is working correctly (Option 2)
   - Add your domain to the allowed origins list
   - For development, add `http://localhost:3000`

3. **Verify your environment variables are correctly set**
4. **Check that your upload preset is configured correctly**
5. **Ensure your Cloudinary account has sufficient quota**
6. **Check the browser console for any error messages**
7. **Verify network connectivity to Cloudinary's servers**

## Server-Side Implementation (Optional)

For advanced features like media deletion, you'll need to implement a server-side service. Here's an example using Node.js:

```javascript
// server/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Delete a file
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
};

module.exports = { deleteFromCloudinary };
```