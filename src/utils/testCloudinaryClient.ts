/**
 * Simple test script to verify Cloudinary client-side integration
 * This script can be run to test the Cloudinary functions
 */

import { 
  uploadToCloudinary,
  getOptimizedImageUrl,
  getOptimizedVideoUrl
} from '@/lib/cloudinary';

// This is a simple test function that demonstrates how to use the Cloudinary functions
// In a real application, you would replace this with actual tests
export const testCloudinaryClientIntegration = async () => {
  console.log('Testing Cloudinary client-side integration...');
  
  // Test URL optimization (doesn't require actual upload)
  const testImageUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
  const optimizedImageUrl = getOptimizedImageUrl(testImageUrl, {
    width: 800,
    height: 600,
    crop: 'fill'
  });
  
  console.log('Optimized image URL:', optimizedImageUrl);
  
  const testVideoUrl = 'https://res.cloudinary.com/demo/video/upload/sample.mp4';
  const optimizedVideoUrl = getOptimizedVideoUrl(testVideoUrl, {
    width: 1280,
    height: 720,
    quality: 'auto'
  });
  
  console.log('Optimized video URL:', optimizedVideoUrl);
  
  console.log('Cloudinary client-side integration test completed successfully!');
  console.log('Note: Actual upload functions require valid Cloudinary credentials and are not tested here.');
};

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testCloudinaryClientIntegration().catch(console.error);
}