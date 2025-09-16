import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { User } from '@/auth/types';

const USERS_COLLECTION = 'users';

export const userService = {
  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, userData: Partial<User>): Promise<{ success: boolean; message: string }> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      
      // Update the user document
      await updateDoc(userRef, {
        ...userData,
        updatedAt: new Date()
      });
      
      return {
        success: true,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return {
        success: false,
        message: 'Failed to update profile. Please try again.'
      };
    }
  },

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          id: userSnap.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        } as User;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }
};