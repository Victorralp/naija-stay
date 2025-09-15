import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { 
  uploadToCloudinary, 
  uploadMultipleToCloudinary,
  getOptimizedImageUrl,
  getOptimizedVideoUrl
} from '@/lib/cloudinary';

/**
 * Upload an image file to Cloudinary
 * @param file The image file to upload
 * @param folder The folder in Cloudinary where the file should be stored
 * @returns The URL of the uploaded image
 */
export const uploadImage = async (file: File, folder: string = 'naija-stay'): Promise<string> => {
  try {
    // Upload to Cloudinary
    const url = await uploadToCloudinary(file, folder);
    return url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param files Array of image files to upload
 * @param folder The folder in Cloudinary where the files should be stored
 * @returns Array of URLs for the uploaded images
 */
export const uploadImages = async (files: File[], folder: string = 'naija-stay'): Promise<string[]> => {
  try {
    // Upload multiple files to Cloudinary
    const urls = await uploadMultipleToCloudinary(files, folder);
    return urls;
  } catch (error) {
    console.error('Error uploading images to Cloudinary:', error);
    throw new Error('Failed to upload images to Cloudinary');
  }
};

/**
 * Upload a video file to Cloudinary
 * @param file The video file to upload
 * @param folder The folder in Cloudinary where the file should be stored
 * @returns The URL of the uploaded video
 */
export const uploadVideo = async (file: File, folder: string = 'naija-stay'): Promise<string> => {
  try {
    // Upload to Cloudinary
    const url = await uploadToCloudinary(file, folder);
    return url;
  } catch (error) {
    console.error('Error uploading video to Cloudinary:', error);
    throw new Error('Failed to upload video to Cloudinary');
  }
};

/**
 * Upload multiple videos to Cloudinary
 * @param files Array of video files to upload
 * @param folder The folder in Cloudinary where the files should be stored
 * @returns Array of URLs for the uploaded videos
 */
export const uploadVideos = async (files: File[], folder: string = 'naija-stay'): Promise<string[]> => {
  try {
    // Upload multiple files to Cloudinary
    const urls = await uploadMultipleToCloudinary(files, folder);
    return urls;
  } catch (error) {
    console.error('Error uploading videos to Cloudinary:', error);
    throw new Error('Failed to upload videos to Cloudinary');
  }
};

/**
 * Delete a media file (placeholder - requires server-side implementation)
 * @param url The URL of the file to delete
 * @returns Promise that resolves when the file is deleted
 */
export const deleteMedia = async (url: string): Promise<void> => {
  // Note: Deletion requires server-side authentication
  console.warn('Delete from Cloudinary requires server-side authentication. Please implement this on your backend.');
  throw new Error('Delete operation not supported in client-side implementation. Use server-side implementation.');
};

/**
 * Get an optimized image URL from Cloudinary
 * @param url The original image URL
 * @param transformations Transformations to apply to the image
 * @returns The optimized image URL
 */
export const getOptimizedImage = (url: string, transformations: Record<string, any> = {}): string => {
  return getOptimizedImageUrl(url, transformations);
};

/**
 * Get an optimized video URL from Cloudinary
 * @param url The original video URL
 * @param transformations Transformations to apply to the video
 * @returns The optimized video URL
 */
export const getOptimizedVideo = (url: string, transformations: Record<string, any> = {}): string => {
  return getOptimizedVideoUrl(url, transformations);
};

// Keep Firebase Storage functions for backward compatibility
export const uploadImageToFirebase = async (file: File, path: string): Promise<string> => {
  try {
    // Create a reference to the file location
    const storageRef = ref(storage, path);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image to Firebase:', error);
    throw new Error('Failed to upload image to Firebase');
  }
};

export const uploadImagesToFirebase = async (files: File[], basePath: string): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file, index) => {
      // Create a unique path for each file
      const path = `${basePath}/${Date.now()}_${index}_${file.name}`;
      return uploadImageToFirebase(file, path);
    });
    
    // Wait for all uploads to complete
    const downloadURLs = await Promise.all(uploadPromises);
    
    return downloadURLs;
  } catch (error) {
    console.error('Error uploading images to Firebase:', error);
    throw new Error('Failed to upload images to Firebase');
  }
};

export const deleteImageFromFirebase = async (imageUrl: string): Promise<void> => {
  try {
    // Create a reference from the download URL
    const imageRef = ref(storage, imageUrl);
    
    // Delete the file
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image from Firebase:', error);
    throw new Error('Failed to delete image from Firebase');
  }
};