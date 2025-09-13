import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterCredentials, AuthState } from '../auth/types';
import { authService } from '../auth/auth-service';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{success: boolean; message: string}>;
  register: (credentials: RegisterCredentials) => Promise<{success: boolean; message: string}>;
  signInWithGoogle: () => Promise<{success: boolean; message: string}>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const mockDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = async ({ email, password }: LoginCredentials): Promise<{success: boolean; message: string}> => {
    try {
      setError(null);
      const result = await authService.login(email, password);
      
      if (result.success && result.user && result.token) {
        setUser(result.user);
        localStorage.setItem('authToken', result.token);
        return { success: true, message: result.message };
      } else {
        const errorMessage = result.message || 'Login failed';
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  const register = async ({ email, password, name }: RegisterCredentials): Promise<{success: boolean; message: string}> => {
    try {
      setError(null);
      const result = await authService.register(email, password, name);
      
      if (result.success && result.user && result.token) {
        setUser(result.user);
        localStorage.setItem('authToken', result.token);
        return { success: true, message: result.message };
      } else {
        const errorMessage = result.message || 'Registration failed';
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  };

  const signInWithGoogle = async (): Promise<{success: boolean; message: string}> => {
    try {
      setError(null);
      const result = await authService.signInWithGoogle();
      
      if (result.success && result.user && result.token) {
        setUser(result.user);
        localStorage.setItem('authToken', result.token);
        return { success: true, message: result.message };
      } else {
        const errorMessage = result.message || 'Google sign-in failed';
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google sign-in failed';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
      setError(null);
      localStorage.removeItem('authToken');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Logout failed');
    }
  };

  // Check for existing auth on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    signInWithGoogle,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};