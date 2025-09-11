export interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  city: string;
  state: string;
  country: string;
  rating: number;
  priceRange: string;
  amenities: string[];
  images: string[];
  featured: boolean;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentReference?: string;
  specialRequests?: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}