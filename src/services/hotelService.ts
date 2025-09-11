import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  Timestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { Hotel, Room, Booking } from '@/types/hotel';

const HOTELS_COLLECTION = 'hotels';
const ROOMS_COLLECTION = 'rooms';
const BOOKINGS_COLLECTION = 'bookings';

export const hotelService = {
  /**
   * Get all hotels
   */
  async getHotels(): Promise<Hotel[]> {
    const hotelsSnapshot = await getDocs(collection(db, HOTELS_COLLECTION));
    return hotelsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Hotel));
  },

  /**
   * Get featured hotels
   */
  async getFeaturedHotels(): Promise<Hotel[]> {
    const q = query(
      collection(db, HOTELS_COLLECTION), 
      where('featured', '==', true),
      where('available', '==', true),
      limit(6)
    );
    const hotelsSnapshot = await getDocs(q);
    return hotelsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Hotel));
  },

  /**
   * Get hotel by ID
   */
  async getHotelById(hotelId: string): Promise<Hotel | null> {
    const hotelDoc = await getDoc(doc(db, HOTELS_COLLECTION, hotelId));
    if (!hotelDoc.exists()) return null;
    
    return {
      id: hotelDoc.id,
      ...hotelDoc.data()
    } as Hotel;
  },

  /**
   * Add new hotel
   */
  async addHotel(hotelData: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, HOTELS_COLLECTION), {
      ...hotelData,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  /**
   * Update hotel
   */
  async updateHotel(hotelId: string, hotelData: Partial<Hotel>): Promise<void> {
    const now = Timestamp.now();
    await updateDoc(doc(db, HOTELS_COLLECTION, hotelId), {
      ...hotelData,
      updatedAt: now
    });
  },

  /**
   * Delete hotel
   */
  async deleteHotel(hotelId: string): Promise<void> {
    await deleteDoc(doc(db, HOTELS_COLLECTION, hotelId));
  },

  /**
   * Get rooms for a hotel
   */
  async getRoomsByHotel(hotelId: string): Promise<Room[]> {
    const q = query(
      collection(db, ROOMS_COLLECTION), 
      where('hotelId', '==', hotelId),
      where('available', '==', true)
    );
    const roomsSnapshot = await getDocs(q);
    return roomsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Room));
  },

  /**
   * Get room by ID
   */
  async getRoomById(roomId: string): Promise<Room | null> {
    const roomDoc = await getDoc(doc(db, ROOMS_COLLECTION, roomId));
    if (!roomDoc.exists()) return null;
    
    return {
      id: roomDoc.id,
      ...roomDoc.data()
    } as Room;
  },

  /**
   * Get all available rooms
   */
  async getAvailableRooms(): Promise<Room[]> {
    // Dummy data for rooms
    return [
      {
        id: 'room1',
        hotelId: 'hotel1',
        name: 'Standard Room',
        description: 'A comfortable standard room with a queen-size bed.',
        type: 'Standard',
        capacity: 2,
        pricePerNight: 25000,
        amenities: ['AC', 'TV', 'WiFi'],
        images: ['https://via.placeholder.com/400x300?text=Standard+Room'],
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'room2',
        hotelId: 'hotel1',
        name: 'Deluxe Room',
        description: 'A spacious deluxe room with a king-size bed and city view.',
        type: 'Deluxe',
        capacity: 3,
        pricePerNight: 40000,
        amenities: ['AC', 'TV', 'WiFi', 'Balcony'],
        images: ['https://via.placeholder.com/400x300?text=Deluxe+Room'],
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'room3',
        hotelId: 'hotel2',
        name: 'Executive Suite',
        description: 'Luxurious suite with a separate living area and premium amenities.',
        type: 'Suite',
        capacity: 4,
        pricePerNight: 75000,
        amenities: ['AC', 'TV', 'WiFi', 'Kitchenette', 'Bathtub'],
        images: ['https://via.placeholder.com/400x300?text=Executive+Suite'],
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
};