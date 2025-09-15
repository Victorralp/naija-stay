# Migration from Firebase Storage to Cloudinary

This document provides guidance on migrating from Firebase Storage to Cloudinary for media management in the NaijaStay application.

## Overview

The NaijaStay application has been updated to use Cloudinary for media management instead of Firebase Storage. This migration provides better performance, optimization, and delivery features for images and videos.

## Migration Steps

### 1. Environment Configuration

Update your `.env` file with Cloudinary credentials:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name
```

Note: You need to create an unsigned upload preset in your Cloudinary account.

### 2. Cloudinary Account Setup

1. Sign up for a Cloudinary account at [https://cloudinary.com](https://cloudinary.com)
2. Obtain your Cloud Name from the Cloudinary dashboard
3. Create an unsigned upload preset with correct settings:
   - Go to Settings > Upload
   - Scroll to "Upload presets" section
   - Click "Add upload preset"
   - Set "Signing Mode" to "Unsigned"
   - Give it a name (e.g., "naija_stay_unsigned")
   - Configure file type restrictions:
     - Allowed file types: "image" and "video"
   - Configure other settings as needed:
     - Folder: "naija-stay" (or your preferred folder)
     - Format: "auto"
     - Quality: "auto"
   - Click "Save"

### 3. CORS Configuration

To avoid CORS issues during development and production:

**For Development**: The application uses a Vite proxy that automatically handles CORS issues.

**For Production**: Configure CORS in your Cloudinary account:
   - Go to Settings > Security
   - In the "CORS" section, add your domain to the allowed origins
   - For production: `https://yourdomain.com`

### 4. Code Changes

The migration has already been implemented in the codebase. The key changes include:

#### Storage Service Updates
- `uploadImage` now uses Cloudinary instead of Firebase Storage
- `uploadImages` now uses Cloudinary instead of Firebase Storage
- Added `uploadVideo` and `uploadVideos` functions
- Added optimization functions: `getOptimizedImage` and `getOptimizedVideo`
- Maintained backward compatibility with Firebase Storage functions (prefixed with `ToFirebase`)

#### Component Updates
- AdminDashboard now uses Cloudinary for media uploads
- Added video upload capability to the admin interface

### 5. Data Migration (Optional)

If you have existing media stored in Firebase Storage that you want to migrate to Cloudinary:

1. Download all media files from Firebase Storage
2. Upload them to Cloudinary using the Cloudinary dashboard or API
3. Update database references to point to the new Cloudinary URLs

## Benefits of Migration

### Performance Improvements
- Automatic image and video optimization
- Responsive delivery based on device requirements
- Format conversion to modern formats (WebP, AVIF)
- CDN delivery for fast global access

### Enhanced Features
- On-the-fly transformations
- Better analytics and reporting
- Advanced optimization settings
- Media library management

### Scalability
- Handles any volume of media files
- No impact on application performance
- Automatic scaling based on demand

### Development Experience
- Vite proxy eliminates CORS issues during development
- Same API for both development and production
- Easy testing and debugging
- Better error handling with specific guidance

## Code Examples

### Before (Firebase Storage)
```typescript
import { uploadImages } from '@/services/storageService';

// This used Firebase Storage
const imageUrls = await uploadImages(files, 'hotel-images');
```

### After (Cloudinary)
```typescript
import { uploadImages } from '@/services/storageService';

// This now uses Cloudinary
const imageUrls = await uploadImages(files, 'hotel-images');
```

The API remains the same, but the underlying implementation now uses Cloudinary.

## Backward Compatibility

For backward compatibility, the storage service still includes Firebase Storage functions:

```typescript
import { uploadImagesToFirebase } from '@/services/storageService';

// Use this if you need to upload to Firebase Storage
const imageUrls = await uploadImagesToFirebase(files, 'hotel-images');
```

## Testing the Migration

1. Verify environment variables are correctly set
2. Test image uploads through the admin dashboard
3. Test video uploads through the admin dashboard
4. Verify optimized URLs are generated correctly

## Security Considerations

The current implementation uses unsigned uploads which are convenient but less secure. For production applications, consider:

1. Implementing signed uploads with a backend service
2. Using server-side authentication for delete operations
3. Setting appropriate restrictions in your upload preset
4. Configuring CORS properly in your Cloudinary account

## Troubleshooting

### Common Issues

1. **"Upload preset must be whitelisted for unsigned uploads"**:
   - Verify the upload preset is set to "Unsigned" in Cloudinary
   - Check that the preset name matches exactly in your `.env` file
   - Ensure the preset allows the file types you're uploading (image/video)

2. **Environment Variables Not Set**
   - Ensure all Cloudinary environment variables are set in `.env`
   - Restart the development server after updating environment variables

3. **Upload Failures**
   - Check Cloudinary account quota
   - Verify upload preset is configured correctly
   - Ensure stable internet connection

4. **CORS Errors**
   - For development: Ensure Vite proxy is working correctly
   - For production: Configure CORS in Cloudinary account

5. **Optimization Not Working**
   - Check transformation parameters
   - Verify Cloudinary account settings

### Getting Help

For issues with the migration, refer to:
- [Cloudinary Integration Guide](CLOUDINARY_INTEGRATION.md)
- Cloudinary documentation: https://cloudinary.com/documentation
- Firebase Storage documentation (for backward compatibility): https://firebase.google.com/docs/storage

## Rollback Plan

If you need to rollback to Firebase Storage:

1. Update the storage service functions to use Firebase Storage instead of Cloudinary
2. Remove Cloudinary dependencies
3. Update environment variables
4. Revert component changes in AdminDashboard

Note: This would require reverting code changes made during the migration.