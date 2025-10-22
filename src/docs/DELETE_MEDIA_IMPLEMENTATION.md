# Media Deletion Implementation Guide

This document explains how to implement the backend service required for deleting media files from Cloudinary.

## Overview

The current implementation in the frontend throws an error when trying to delete media files because it requires server-side authentication with the Cloudinary API secret. This guide explains how to implement the backend service.

## Backend Implementation Options

### Option 1: Node.js Express Server

Create a simple Express server with the Cloudinary SDK:

```javascript
// server.js
const express = require('express');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cors());
app.use(express.json());

// Delete endpoint
app.post('/api/cloudinary/delete', async (req, res) => {
  try {
    const { publicId } = req.body;
    
    if (!publicId) {
      return res.status(400).json({ error: 'Public ID is required' });
    }
    
    // Delete the resource from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    res.json({ success: true, result });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Option 2: Firebase Cloud Functions

If you're using Firebase, you can implement this as a Cloud Function:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.deleteCloudinaryImage = functions.https.onCall(async (data, context) => {
  // Optional: Add authentication checks here
  // if (!context.auth) {
  //   throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  // }
  
  const { publicId } = data;
  
  if (!publicId) {
    throw new functions.https.HttpsError('invalid-argument', 'Public ID is required');
  }
  
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: true, result };
  } catch (error) {
    console.error('Delete error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to delete image');
  }
});
```

## Frontend Integration

Update the [src/lib/cloudinary.ts](file:///c%3A/Users/Raphael/naija-stay-book/src/lib/cloudinary.ts) file to call your backend service:

```typescript
// Updated deleteFromCloudinary function
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    // Option 1: REST API endpoint
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete file');
    }
    
    // Option 2: Firebase Cloud Function
    // const deleteFunction = httpsCallable(functions, 'deleteCloudinaryImage');
    // await deleteFunction({ publicId });
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw new Error(`Failed to delete file from Cloudinary: ${error.message}`);
  }
};
```

## Environment Variables

Make sure to set the following environment variables in your backend:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Security Considerations

1. **Authentication**: Ensure only authenticated users can delete files
2. **Authorization**: Verify users can only delete their own files
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Input Validation**: Validate all inputs, especially the publicId

## Testing

You can test the implementation by:

1. Uploading an image through the admin interface
2. Attempting to delete the image
3. Verifying the image is removed from Cloudinary

## Error Handling

The implementation should handle common errors:

- Invalid public ID
- Network errors
- Authentication failures
- Rate limiting

## Next Steps

1. Implement one of the backend solutions above
2. Update the frontend to call your backend service
3. Test the delete functionality
4. Add proper authentication and authorization checks