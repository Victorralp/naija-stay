import { User } from './types';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const convertFirebaseUserToUser = (firebaseUser: FirebaseUser | null): User | null => {
  if (!firebaseUser) return null;
  
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || undefined,
    name: firebaseUser.displayName || undefined,
    role: 'user',
    createdAt: new Date()
  };
};

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      let userData = convertFirebaseUserToUser(userCredential.user);
      
      if (userDoc.exists()) {
        const userInfo = userDoc.data();
        userData = {
          ...userData,
          ...userInfo
        };
      }
      
      return {
        success: true,
        message: 'Login successful',
        user: userData,
        token: await userCredential.user.getIdToken()
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Invalid credentials'
      };
    }
  },

  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const userData = {
        id: userCredential.user.uid,
        email,
        name,
        role: 'user' as const,
        createdAt: new Date()
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      
      return {
        success: true,
        message: 'Registration successful',
        user: userData,
        token: await userCredential.user.getIdToken()
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  },

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          let userData = convertFirebaseUserToUser(firebaseUser);
          
          if (userDoc.exists()) {
            const userInfo = userDoc.data();
            userData = {
              ...userData,
              ...userInfo
            };
          }
          
          resolve(userData);
        } else {
          resolve(null);
        }
        unsubscribe();
      });
    });
  },

  async logout(): Promise<void> {
    await signOut(auth);
  }
};