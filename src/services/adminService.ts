import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import { User } from '@/auth/types';

const USERS_COLLECTION = 'users';

// Mock email sending function - in a real implementation, you would integrate with an email service
const sendEmail = async (to: string, subject: string, message: string) => {
  // This is a mock implementation - in a real app, you would use an email service like SendGrid, Mailgun, etc.
  console.log(`Sending email to ${to} with subject "${subject}" and message "${message}"`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demonstration purposes, we'll always return success
  return { success: true, messageId: 'mock-message-id' };
};

export const adminService = {
  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const usersSnapshot = await getDocs(collection(db, USERS_COLLECTION));
      return usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        } as User;
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  /**
   * Update user role
   */
  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, { role });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw new Error('Failed to update user role');
    }
  },

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, USERS_COLLECTION, userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  },

  /**
   * Get users with specific role
   */
  async getUsersByRole(role: 'user' | 'admin'): Promise<User[]> {
    try {
      const q = query(collection(db, USERS_COLLECTION), where('role', '==', role));
      const usersSnapshot = await getDocs(q);
      return usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        } as User;
      });
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw new Error('Failed to fetch users by role');
    }
  },

  /**
   * Get contact messages
   */
  async getContactMessages(): Promise<any[]> {
    try {
      const messagesSnapshot = await getDocs(collection(db, 'contactMessages'));
      const messages = messagesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        };
      });
      return messages;
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      throw new Error('Failed to fetch contact messages');
    }
  },

  /**
   * Update contact message status
   */
  async updateContactMessageStatus(messageId: string, status: 'unread' | 'read' | 'replied'): Promise<void> {
    try {
      const messageRef = doc(db, 'contactMessages', messageId);
      await updateDoc(messageRef, { status });
    } catch (error) {
      console.error('Error updating message status:', error);
      throw new Error('Failed to update message status');
    }
  },

  /**
   * Send reply to contact message
   */
  async sendContactMessageReply(messageId: string, replyMessage: string): Promise<void> {
    try {
      // Get the original message
      const messageDoc = await getDocs(query(collection(db, 'contactMessages'), where('id', '==', messageId)));
      if (messageDoc.empty) {
        throw new Error('Message not found');
      }
      
      const messageData = messageDoc.docs[0].data();
      
      // Send the reply email
      await sendEmail(
        messageData.email,
        `Re: ${messageData.subject || 'Your Message'}`,
        replyMessage
      );
      
      // Update message status to replied
      await this.updateContactMessageStatus(messageId, 'replied');
      
      // In a real implementation, you might also save the reply to a replies collection
    } catch (error) {
      console.error('Error sending message reply:', error);
      throw new Error('Failed to send message reply');
    }
  },

  /**
   * Get newsletter subscribers
   */
  async getNewsletterSubscribers(): Promise<any[]> {
    try {
      const subscribersSnapshot = await getDocs(collection(db, 'newsletter'));
      return subscribersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          subscribedAt: data.subscribedAt ? data.subscribedAt.toDate() : new Date(),
        };
      });
    } catch (error) {
      console.error('Error fetching newsletter subscribers:', error);
      throw new Error('Failed to fetch newsletter subscribers');
    }
  },

  /**
   * Send newsletter to all subscribers
   */
  async sendNewsletter(subject: string, message: string): Promise<{ successCount: number; failureCount: number }> {
    try {
      // Get all subscribers
      const subscribers = await this.getNewsletterSubscribers();
      
      let successCount = 0;
      let failureCount = 0;
      
      // Send email to each subscriber
      for (const subscriber of subscribers) {
        try {
          await sendEmail(
            subscriber.email,
            subject,
            message
          );
          successCount++;
        } catch (error) {
          console.error(`Failed to send newsletter to ${subscriber.email}:`, error);
          failureCount++;
        }
      }
      
      return { successCount, failureCount };
    } catch (error) {
      console.error('Error sending newsletter:', error);
      throw new Error('Failed to send newsletter');
    }
  },

  /**
   * Get special offers
   */
  async getSpecialOffers(): Promise<any[]> {
    try {
      const offersSnapshot = await getDocs(collection(db, 'specialOffers'));
      return offersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          validUntil: data.validUntil ? data.validUntil.toDate() : new Date(),
        };
      });
    } catch (error) {
      console.error('Error fetching special offers:', error);
      throw new Error('Failed to fetch special offers');
    }
  },

  /**
   * Add or update special offer
   */
  async saveSpecialOffer(offerData: any, offerId?: string): Promise<void> {
    try {
      if (offerId) {
        // Update existing offer
        const offerRef = doc(db, 'specialOffers', offerId);
        await updateDoc(offerRef, offerData);
      } else {
        // Add new offer
        // In a real implementation, you would use addDoc here
        console.log('Adding new offer:', offerData);
      }
    } catch (error) {
      console.error('Error saving special offer:', error);
      throw new Error('Failed to save special offer');
    }
  },

  /**
   * Delete special offer
   */
  async deleteSpecialOffer(offerId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'specialOffers', offerId));
    } catch (error) {
      console.error('Error deleting special offer:', error);
      throw new Error('Failed to delete special offer');
    }
  }
};