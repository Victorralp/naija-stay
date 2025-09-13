import { User } from './types';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User as FirebaseUser, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const convertFirebaseUserToUser = (firebaseUser: FirebaseUser | null): User | null => {
  if (!firebaseUser) return null;
  
  // Check if user is admin based on email
  const isAdmin = firebaseUser.email === 'victorralph407@gmail.com';
  
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || undefined,
    name: firebaseUser.displayName || undefined,
    displayName: firebaseUser.displayName || undefined,
    photoURL: firebaseUser.photoURL || undefined,
    role: isAdmin ? 'admin' : 'user', // Set role based on email
    createdAt: new Date(),
    metadata: {
      creationTime: firebaseUser.metadata.creationTime || undefined,
      lastSignInTime: firebaseUser.metadata.lastSignInTime || undefined
    }
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
      
      // Ensure admin role is set correctly based on email
      if (userData && userData.email === 'victorralph407@gmail.com') {
        userData.role = 'admin';
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
      
      // Check if user is admin based on email
      const isAdmin = email === 'victorralph407@gmail.com';
      
      const userData: User = {
        id: userCredential.user.uid,
        email,
        name,
        role: isAdmin ? 'admin' : 'user', // Set role based on email
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

  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user already exists in our database
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      let userData = convertFirebaseUserToUser(userCredential.user);
      
      // If user doesn't exist in our database, create a new record
      if (!userDoc.exists()) {
        const isAdmin = userCredential.user.email === 'victorralph407@gmail.com';
        const newUserData: User = {
          id: userCredential.user.uid,
          email: userCredential.user.email || undefined,
          name: userCredential.user.displayName || undefined,
          displayName: userCredential.user.displayName || undefined,
          photoURL: userCredential.user.photoURL || undefined,
          role: isAdmin ? 'admin' : 'user', // Set role based on email
          createdAt: new Date(),
          metadata: {
            creationTime: userCredential.user.metadata.creationTime || undefined,
            lastSignInTime: userCredential.user.metadata.lastSignInTime || undefined
          }
        };
        
        await setDoc(doc(db, 'users', userCredential.user.uid), newUserData);
        userData = newUserData;
      } else {
        // If user exists, merge with existing data
        const userInfo = userDoc.data();
        userData = {
          ...userData,
          ...userInfo
        } as User;
      }
      
      // Ensure admin role is set correctly based on email
      if (userData && userData.email === 'victorralph407@gmail.com') {
        userData.role = 'admin';
      }
      
      return {
        success: true,
        message: 'Google sign-in successful',
        user: userData,
        token: await userCredential.user.getIdToken()
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Google sign-in failed'
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
          
          // Ensure admin role is set correctly based on email
          if (userData && userData.email === 'victorralph407@gmail.com') {
            userData.role = 'admin';
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