import { 
  uploadImage, 
  uploadImages, 
  uploadVideo, 
  uploadVideos,
  deleteMedia,
  getOptimizedImage,
  getOptimizedVideo
} from '@/services/storageService';

// Mock the Cloudinary functions
jest.mock('@/lib/cloudinary', () => ({
  uploadToCloudinary: jest.fn().mockResolvedValue('https://res.cloudinary.com/test/image/upload/v1234567890/test-image.jpg'),
  uploadMultipleToCloudinary: jest.fn().mockResolvedValue([
    'https://res.cloudinary.com/test/image/upload/v1234567890/test-image1.jpg',
    'https://res.cloudinary.com/test/image/upload/v1234567890/test-image2.jpg'
  ]),
  deleteFromCloudinary: jest.fn().mockResolvedValue(undefined),
  getOptimizedImageUrl: jest.fn().mockImplementation((url) => url.replace('/upload/', '/upload/w_800,h_600,c_fill/')),
  getOptimizedVideoUrl: jest.fn().mockImplementation((url) => url.replace('/upload/', '/upload/w_1280,h_720,c_fill/video/'))
}));

// Create a mock file for testing
const createMockFile = (name: string, type: string): File => {
  return new File([''], name, { type });
};

describe('Storage Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('should upload an image to Cloudinary and return a URL', async () => {
      const mockFile = createMockFile('test-image.jpg', 'image/jpeg');
      
      const result = await uploadImage(mockFile);
      
      expect(result).toBe('https://res.cloudinary.com/test/image/upload/v1234567890/test-image.jpg');
    });
  });

  describe('uploadImages', () => {
    it('should upload multiple images to Cloudinary and return URLs', async () => {
      const mockFiles = [
        createMockFile('test-image-1.jpg', 'image/jpeg'),
        createMockFile('test-image-2.png', 'image/png')
      ];
      
      const result = await uploadImages(mockFiles);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toBe('https://res.cloudinary.com/test/image/upload/v1234567890/test-image1.jpg');
      expect(result[1]).toBe('https://res.cloudinary.com/test/image/upload/v1234567890/test-image2.jpg');
    });
  });

  describe('uploadVideo', () => {
    it('should upload a video to Cloudinary and return a URL', async () => {
      const mockFile = createMockFile('test-video.mp4', 'video/mp4');
      
      const result = await uploadVideo(mockFile);
      
      expect(result).toBe('https://res.cloudinary.com/test/image/upload/v1234567890/test-image.jpg');
    });
  });

  describe('uploadVideos', () => {
    it('should upload multiple videos to Cloudinary and return URLs', async () => {
      const mockFiles = [
        createMockFile('test-video-1.mp4', 'video/mp4'),
        createMockFile('test-video-2.mov', 'video/quicktime')
      ];
      
      const result = await uploadVideos(mockFiles);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toBe('https://res.cloudinary.com/test/image/upload/v1234567890/test-image1.jpg');
      expect(result[1]).toBe('https://res.cloudinary.com/test/image/upload/v1234567890/test-image2.jpg');
    });
  });

  describe('deleteMedia', () => {
    it('should delete a media file from Cloudinary', async () => {
      const testUrl = 'https://res.cloudinary.com/test/image/upload/v1234567890/test-image.jpg';
      
      await expect(deleteMedia(testUrl)).resolves.not.toThrow();
    });
  });

  describe('getOptimizedImage', () => {
    it('should return an optimized image URL', () => {
      const originalUrl = 'https://res.cloudinary.com/test/image/upload/v1234567890/test-image.jpg';
      
      const result = getOptimizedImage(originalUrl);
      
      expect(result).toBe('https://res.cloudinary.com/test/image/upload/w_800,h_600,c_fill/v1234567890/test-image.jpg');
    });
  });

  describe('getOptimizedVideo', () => {
    it('should return an optimized video URL', () => {
      const originalUrl = 'https://res.cloudinary.com/test/video/upload/v1234567890/test-video.mp4';
      
      const result = getOptimizedVideo(originalUrl);
      
      expect(result).toBe('https://res.cloudinary.com/test/video/upload/w_1280,h_720,c_fill/video/v1234567890/test-video.mp4');
    });
  });
});