import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import RoomsPage from '../pages/RoomsPage';

// Mock the hotelService
jest.mock('../services/hotelService', () => ({
  hotelService: {
    getAvailableRooms: jest.fn().mockResolvedValue([
      {
        id: '1',
        hotelId: 'hotel1',
        name: 'Deluxe Room',
        description: 'A beautiful deluxe room with ocean view',
        type: 'Deluxe',
        capacity: 2,
        pricePerNight: 15000,
        amenities: ['Free WiFi', 'TV', 'Air Conditioning'],
        images: ['https://example.com/image1.jpg'],
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        hotelId: 'hotel1',
        name: 'Standard Room',
        description: 'A comfortable standard room',
        type: 'Standard',
        capacity: 2,
        pricePerNight: 10000,
        amenities: ['Free WiFi', 'TV'],
        images: ['https://example.com/image2.jpg'],
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  }
}));

const queryClient = new QueryClient();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('RoomsPage', () => {
  it('renders without crashing', () => {
    renderWithProviders(<RoomsPage />);
    expect(screen.getByText('Browse Available Rooms')).toBeInTheDocument();
  });

  it('displays room cards when data is loaded', async () => {
    renderWithProviders(<RoomsPage />);
    
    // Wait for async data to load
    expect(await screen.findByText('Deluxe Room')).toBeInTheDocument();
    expect(await screen.findByText('Standard Room')).toBeInTheDocument();
  });

  it('shows correct room information', async () => {
    renderWithProviders(<RoomsPage />);
    
    // Check if room details are displayed correctly
    expect(await screen.findByText('₦15,000')).toBeInTheDocument();
    expect(await screen.findByText('₦10,000')).toBeInTheDocument();
  });
});