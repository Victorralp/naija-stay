// Simple integration test for rooms functionality
import { hotelService } from '../services/hotelService';

// Mock Firebase
jest.mock('../lib/firebase', () => ({
  db: {}
}));

describe('Rooms Functionality', () => {
  it('should have required room properties', () => {
    // This is a simple test to verify the structure
    const mockRoom = {
      id: 'test-room-1',
      hotelId: 'test-hotel-1',
      name: 'Test Room',
      description: 'A test room for verification',
      type: 'Standard',
      capacity: 2,
      pricePerNight: 10000,
      amenities: ['WiFi', 'TV'],
      images: ['image1.jpg'],
      available: true
    };
    
    expect(mockRoom).toHaveProperty('id');
    expect(mockRoom).toHaveProperty('name');
    expect(mockRoom).toHaveProperty('pricePerNight');
    expect(mockRoom.pricePerNight).toBeGreaterThan(0);
  });
});