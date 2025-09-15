/**
 * Debug script to test Cloudinary upload issues
 */

// Test Cloudinary configuration
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'naija_stay_unsigned';

console.log('Cloudinary Configuration:');
console.log('- Cloud Name:', CLOUD_NAME);
console.log('- Upload Preset:', UPLOAD_PRESET);

// Function to test Cloudinary connectivity
export const testCloudinaryConnectivity = async () => {
  try {
    console.log('Testing Cloudinary connectivity...');
    
    // Test if we can access the Cloudinary API endpoint
    const testUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
    console.log('Testing URL:', testUrl);
    
    // Make a simple OPTIONS request to check CORS
    const response = await fetch(testUrl, {
      method: 'OPTIONS',
      mode: 'cors'
    });
    
    console.log('CORS preflight response:', response.status, response.headers);
    
    if (response.ok) {
      console.log('CORS preflight check passed');
    } else {
      console.log('CORS preflight check failed with status:', response.status);
    }
  } catch (error) {
    console.error('Error testing Cloudinary connectivity:', error);
  }
};

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testCloudinaryConnectivity().catch(console.error);
}