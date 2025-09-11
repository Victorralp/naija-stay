import { useAuth } from '../contexts/AuthContext';

export const useUser = () => {
  const { user } = useAuth();
  return user;
};

export const useIsAuthenticated = () => {
  const { user } = useAuth();
  return !!user;
};

export const useAuthActions = () => {
  const { login, register, logout } = useAuth();
  return { login, register, logout };
};

export const useAuthLoading = () => {
  const { loading } = useAuth();
  return loading;
};

export const useAuthError = () => {
  const { error } = useAuth();
  return error;
};