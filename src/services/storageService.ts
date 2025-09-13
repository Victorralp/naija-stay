import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Upload an image file to Firebase Storage
 * @param file The image file to upload
 * @param path The path in Firebase Storage where the file should be stored
 * @returns The download URL of the uploaded image
 */
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    // Create a reference to the file location
    const storageRef = ref(storage, path);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Upload multiple images to Firebase Storage
 * @param files Array of image files to upload
 * @param basePath The base path in Firebase Storage where the files should be stored
 * @returns Array of download URLs for the uploaded images
 */
export const uploadImages = async (files: File[], basePath: string): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file, index) => {
      // Create a unique path for each file
      const path = `${basePath}/${Date.now()}_${index}_${file.name}`;
      return uploadImage(file, path);
    });
    
    // Wait for all uploads to complete
    const downloadURLs = await Promise.all(uploadPromises);
    
    return downloadURLs;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw new Error('Failed to upload images');
  }
};

/**
 * Delete an image from Firebase Storage
 * @param imageUrl The URL of the image to delete
 * @returns Promise that resolves when the image is deleted
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Create a reference from the download URL
    const imageRef = ref(storage, imageUrl);
    
    // Delete the file
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
};