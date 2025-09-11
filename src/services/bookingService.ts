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
  orderBy
} from 'firebase/firestore';
import { Booking } from '@/types/hotel';

const BOOKINGS_COLLECTION = 'bookings';

export const bookingService = {
  /**
   * Create a new booking
   */
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
      ...bookingData,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId: string): Promise<Booking | null> {
    const bookingDoc = await getDoc(doc(db, BOOKINGS_COLLECTION, bookingId));
    if (!bookingDoc.exists()) return null;
    
    return {
      id: bookingDoc.id,
      ...bookingDoc.data()
    } as Booking;
  },

  /**
   * Get bookings for a user
   */
  async getBookingsByUser(userId: string): Promise<Booking[]> {
    const q = query(
      collection(db, BOOKINGS_COLLECTION), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const bookingsSnapshot = await getDocs(q);
    return bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Booking));
  },

  /**
   * Update booking
   */
  async updateBooking(bookingId: string, bookingData: Partial<Booking>): Promise<void> {
    const now = Timestamp.now();
    await updateDoc(doc(db, BOOKINGS_COLLECTION, bookingId), {
      ...bookingData,
      updatedAt: now
    });
  },

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId: string): Promise<void> {
    await updateDoc(doc(db, BOOKINGS_COLLECTION, bookingId), {
      status: 'cancelled',
      updatedAt: Timestamp.now()
    });
  },

  /**
   * Delete booking
   */
  async deleteBooking(bookingId: string): Promise<void> {
    await deleteDoc(doc(db, BOOKINGS_COLLECTION, bookingId));
  }
};