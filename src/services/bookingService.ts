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

// Helper function to convert Firestore data to Booking object with proper Date objects
function convertFirestoreBooking(data: any): Booking {
  return {
    ...data,
    checkInDate: data.checkInDate instanceof Timestamp ? data.checkInDate.toDate() : data.checkInDate,
    checkOutDate: data.checkOutDate instanceof Timestamp ? data.checkOutDate.toDate() : data.checkOutDate,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
  } as Booking;
}

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
    
    return convertFirestoreBooking({
      id: bookingDoc.id,
      ...bookingDoc.data()
    });
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
    return bookingsSnapshot.docs.map(doc => 
      convertFirestoreBooking({
        id: doc.id,
        ...doc.data()
      })
    );
  },

  /**
   * Get all bookings (for admin)
   */
  async getAllBookings(): Promise<Booking[]> {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const bookingsSnapshot = await getDocs(q);
    return bookingsSnapshot.docs.map(doc => 
      convertFirestoreBooking({
        id: doc.id,
        ...doc.data()
      })
    );
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