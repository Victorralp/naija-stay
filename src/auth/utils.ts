import { User } from './types';

/**
 * Check if a user has admin privileges
 * @param user The user object to check
 * @returns boolean indicating if the user is an admin
 */
export const isAdmin = (user: User | null): boolean => {
  // Check if user is explicitly set as admin or has the specific admin email
  return user !== null && (user.role === 'admin' || user.email === 'victorralph407@gmail.com');
};

/**
 * Check if a user is authenticated
 * @param user The user object to check
 * @returns boolean indicating if the user is authenticated
 */
export const isAuthenticated = (user: User | null): boolean => {
  return user !== null;
};