import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

interface ContactMessage {
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp;
}

const CONTACT_COLLECTION = 'contactMessages';

export const contactService = {
  /**
   * Save a contact message to Firestore
   */
  async saveContactMessage(messageData: Omit<ContactMessage, 'createdAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, CONTACT_COLLECTION), {
      ...messageData,
      createdAt: now
    });
    return docRef.id;
  }
};