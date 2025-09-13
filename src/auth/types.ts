export interface User {
  id: string;
  email?: string;
  name?: string;
  phoneNumber?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  // Firebase-specific properties that might be available
  displayName?: string;
  photoURL?: string;
  metadata?: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}