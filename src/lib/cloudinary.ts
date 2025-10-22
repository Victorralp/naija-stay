// Cloudinary client-side configuration
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'naija_stay_unsigned';

// Helper function to upload a single file using unsigned upload with proper error handling
export const uploadToCloudinary = async (file: File, folder: string = 'naija-stay'): Promise<string> => {
  // Create a temporary URL for the file to test if it's valid
  const fileUrl = URL.createObjectURL(file);
  
  try {
    // Validate file size (Cloudinary has limits)
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      throw new Error('File size exceeds 100MB limit');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);
    
    // Add timestamp to prevent caching issues
    formData.append('timestamp', Date.now().toString());
    
    // Use the Vite proxy to avoid CORS issues
    const response = await fetch(
      `/api/cloudinary/v1_1/${CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary upload error response:', errorText);
      
      // Parse the error response to provide better error messages
      let errorMessage = `Upload failed with status ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message;
          // Provide specific guidance for common errors
          if (errorMessage.includes('Upload preset must be whitelisted')) {
            errorMessage += '. Please check that your upload preset is correctly configured for unsigned uploads in your Cloudinary account.';
          }
        }
      } catch (parseError) {
        // If we can't parse the error as JSON, use the raw text
        errorMessage += `: ${errorText}`;
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    // Re-throw with more context
    throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
  } finally {
    // Clean up the temporary URL
    URL.revokeObjectURL(fileUrl);
  }
};

// Helper function to upload multiple files
export const uploadMultipleToCloudinary = async (files: File[], folder: string = 'naija-stay'): Promise<string[]> => {
  try {
    // Process files sequentially to avoid overwhelming the API
    const urls: string[] = [];
    for (const file of files) {
      try {
        const url = await uploadToCloudinary(file, folder);
        urls.push(url);
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        throw new Error(`Failed to upload file ${file.name}: ${error.message}`);
      }
    }
    return urls;
  } catch (error) {
    console.error('Error uploading files to Cloudinary:', error);
    throw new Error(`Failed to upload files to Cloudinary: ${error.message}`);
  }
};

// Helper function to delete a file from Cloudinary (requires server-side signature)
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    // In a real implementation, this would call a backend service
    // that has the Cloudinary API secret for authenticated operations
    // For example:
    // const response = await fetch('/api/cloudinary/delete', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ publicId }),
    // });
    // 
    // if (!response.ok) {
    //   throw new Error(`Failed to delete file: ${response.statusText}`);
    // }
    
    // For now, we'll throw an error indicating that server-side implementation is needed
    throw new Error('Delete operation requires backend implementation. Please implement a server-side service with Cloudinary API secret.');
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw new Error(`Failed to delete file from Cloudinary: ${error.message}`);
  }
};

// Helper function to generate optimized image URLs
export const getOptimizedImageUrl = (url: string, transformations: Record<string, any> = {}): string => {
  try {
    // Parse the Cloudinary URL to extract public ID
    const urlParts = url.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0];
    
    // Default transformations
    const defaultTransformations = {
      quality: 'auto',
      fetch_format: 'auto',
      ...transformations
    };
    
    // Build transformation string
    const transformationString = Object.entries(defaultTransformations)
      .map(([key, value]) => `${key}_${value}`)
      .join(',');
    
    // Construct optimized URL
    const baseUrl = urlParts.slice(0, urlParts.length - 1).join('/');
    return `${baseUrl}/${transformationString}/${publicIdWithExtension}`;
  } catch (error) {
    console.error('Error generating optimized image URL:', error);
    return url; // Return original URL if optimization fails
  }
};

// Helper function to generate video URLs with transformations
export const getOptimizedVideoUrl = (url: string, transformations: Record<string, any> = {}): string => {
  try {
    // Parse the Cloudinary URL to extract public ID
    const urlParts = url.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0];
    
    // Default transformations for videos
    const defaultTransformations = {
      quality: 'auto',
      fetch_format: 'auto',
      ...transformations
    };
    
    // Build transformation string
    const transformationString = Object.entries(defaultTransformations)
      .map(([key, value]) => `${key}_${value}`)
      .join(',');
    
    // Construct optimized URL
    const baseUrl = urlParts.slice(0, urlParts.length - 1).join('/');
    return `${baseUrl}/video/${transformationString}/${publicIdWithExtension}`;
  } catch (error) {
    console.error('Error generating optimized video URL:', error);
    return url; // Return original URL if optimization fails
  }
};