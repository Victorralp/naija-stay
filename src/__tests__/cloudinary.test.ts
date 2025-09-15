import { 
  uploadToCloudinary, 
  uploadMultipleToCloudinary, 
  deleteFromCloudinary,
  getOptimizedImageUrl,
  getOptimizedVideoUrl
} from '@/lib/cloudinary';

// Mock the Cloudinary SDK
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn((options, callback) => {
        // Simulate successful upload
        const result = {
          secure_url: 'https://res.cloudinary.com/test/image/upload/v1234567890/test-image.jpg'
        };
        callback(null, result);
        return { end: jest.fn() };
      }),
      destroy: jest.fn((publicId, callback) => {
        // Simulate successful deletion
        callback(null, { result: 'ok' });
      })
    }
  }
}));

describe('Cloudinary Service', () => {
  // Create a mock file for testing
  const createMockFile = (name: string, type: string): File => {
    return new File([''], name, { type });
  };

  describe('uploadToCloudinary', () => {
    it('should upload a file and return a URL', async () => {
      const mockFile = createMockFile('test-image.jpg', 'image/jpeg');
      
      const result = await uploadToCloudinary(mockFile);
      
      expect(result).toContain('https://res.cloudinary.com');
      expect(result).toContain('test-image.jpg');
    });

    it('should reject with an error when upload fails', async () => {
      // Mock the upload_stream to simulate an error
      const cloudinary = require('cloudinary');
      cloudinary.v2.uploader.upload_stream.mockImplementationOnce((options, callback) => {
        callback(new Error('Upload failed'), null);
        return { end: jest.fn() };
      });
      
      const mockFile = createMockFile('test-image.jpg', 'image/jpeg');
      
      await expect(uploadToCloudinary(mockFile)).rejects.toThrow('Upload failed');
    });
  });

  describe('uploadMultipleToCloudinary', () => {
    it('should upload multiple files and return URLs', async () => {
      const mockFiles = [
        createMockFile('test-image-1.jpg', 'image/jpeg'),
        createMockFile('test-image-2.png', 'image/png')
      ];
      
      const result = await uploadMultipleToCloudinary(mockFiles);
      
      expect(result).toHaveLength(2);
      result.forEach(url => {
        expect(url).toContain('https://res.cloudinary.com');
      });
    });
  });

  describe('deleteFromCloudinary', () => {
    it('should delete a file by public ID', async () => {
      const cloudinary = require('cloudinary');
      cloudinary.v2.uploader.destroy.mockImplementationOnce((publicId, callback) => {
        callback(null, { result: 'ok' });
      });
      
      await expect(deleteFromCloudinary('test-public-id')).resolves.not.toThrow();
    });
  });

  describe('getOptimizedImageUrl', () => {
    it('should generate an optimized image URL with transformations', () => {
      const originalUrl = 'https://res.cloudinary.com/test/image/upload/v1234567890/test-image.jpg';
      const transformations = { width: 800, height: 600, crop: 'fill' };
      
      const result = getOptimizedImageUrl(originalUrl, transformations);
      
      expect(result).toContain('https://res.cloudinary.com');
      expect(result).toContain('w_800,h_600,crop_fill');
    });
  });

  describe('getOptimizedVideoUrl', () => {
    it('should generate an optimized video URL with transformations', () => {
      const originalUrl = 'https://res.cloudinary.com/test/video/upload/v1234567890/test-video.mp4';
      const transformations = { width: 1280, height: 720, quality: 'auto' };
      
      const result = getOptimizedVideoUrl(originalUrl, transformations);
      
      expect(result).toContain('https://res.cloudinary.com');
      expect(result).toContain('video');
      expect(result).toContain('w_1280,h_720,quality_auto');
    });
  });
});