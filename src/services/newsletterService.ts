import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

interface NewsletterSubscription {
  id?: string;
  email: string;
  name?: string;
  subscribedAt: Date;
}

const NEWSLETTER_COLLECTION = 'newsletter';

export const newsletterService = {
  /**
   * Subscribe a user to the newsletter
   */
  async subscribe(email: string, name?: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check if email is already subscribed
      const q = query(
        collection(db, NEWSLETTER_COLLECTION), 
        where('email', '==', email)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return {
          success: false,
          message: 'This email is already subscribed to our newsletter.'
        };
      }
      
      // Add new subscription
      const subscriptionData: NewsletterSubscription = {
        email,
        name,
        subscribedAt: new Date()
      };
      
      await addDoc(collection(db, NEWSLETTER_COLLECTION), subscriptionData);
      
      return {
        success: true,
        message: 'Successfully subscribed to our newsletter!'
      };
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      return {
        success: false,
        message: 'Failed to subscribe. Please try again later.'
      };
    }
  },

  /**
   * Check if an email is already subscribed
   */
  async isSubscribed(email: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, NEWSLETTER_COLLECTION), 
        where('email', '==', email)
      );
      
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }
};