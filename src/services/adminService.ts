import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import { User } from '@/auth/types';

const USERS_COLLECTION = 'users';

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
      return messagesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        };
      });
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
  }
};