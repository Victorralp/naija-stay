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

// Helper function to convert Firestore data to Hotel object with proper Date objects
function convertFirestoreHotel(data: any): Hotel {
  return {
    ...data,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
  } as Hotel;
}

// Helper function to convert Firestore data to Room object with proper Date objects
function convertFirestoreRoom(data: any): Room {
  return {
    ...data,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
  } as Room;
}

export const hotelService = {
  /**
   * Get all hotels
   */
  async getHotels(): Promise<Hotel[]> {
    const hotelsSnapshot = await getDocs(collection(db, HOTELS_COLLECTION));
    return hotelsSnapshot.docs.map(doc => 
      convertFirestoreHotel({
        id: doc.id,
        ...doc.data()
      })
    );
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
    return hotelsSnapshot.docs.map(doc => 
      convertFirestoreHotel({
        id: doc.id,
        ...doc.data()
      })
    );
  },

  /**
   * Get hotel by ID
   */
  async getHotelById(hotelId: string): Promise<Hotel | null> {
    const hotelDoc = await getDoc(doc(db, HOTELS_COLLECTION, hotelId));
    if (!hotelDoc.exists()) return null;
    
    return convertFirestoreHotel({
      id: hotelDoc.id,
      ...hotelDoc.data()
    });
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
    return roomsSnapshot.docs.map(doc => 
      convertFirestoreRoom({
        id: doc.id,
        ...doc.data()
      })
    );
  },

  /**
   * Get room by ID
   */
  async getRoomById(roomId: string): Promise<Room | null> {
    const roomDoc = await getDoc(doc(db, ROOMS_COLLECTION, roomId));
    if (!roomDoc.exists()) return null;
    
    return convertFirestoreRoom({
      id: roomDoc.id,
      ...roomDoc.data()
    });
  },

  /**
   * Get all available rooms from Firestore
   */
  async getAvailableRooms(): Promise<Room[]> {
    const q = query(
      collection(db, ROOMS_COLLECTION),
      where('available', '==', true)
    );
    const roomsSnapshot = await getDocs(q);
    return roomsSnapshot.docs.map(doc => 
      convertFirestoreRoom({
        id: doc.id,
        ...doc.data()
      })
    );
  },

  /**
   * Add new room
   */
  async addRoom(roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, ROOMS_COLLECTION), {
      ...roomData,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  /**
   * Update room
   */
  async updateRoom(roomId: string, roomData: Partial<Room>): Promise<void> {
    const now = Timestamp.now();
    await updateDoc(doc(db, ROOMS_COLLECTION, roomId), {
      ...roomData,
      updatedAt: now
    });
  },

  /**
   * Delete room
   */
  async deleteRoom(roomId: string): Promise<void> {
    await deleteDoc(doc(db, ROOMS_COLLECTION, roomId));
  }
};