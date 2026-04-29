import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '@/lib/auth';
import type { User, AuthState } from '@/types';

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const user = getCurrentUser();
    setState({ user, isAuthenticated: !!user, isLoading: false });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    setState(s => ({ ...s, isLoading: true }));
    await new Promise(r => setTimeout(r, 800));
    const { user, error } = loginUser(email, password);
    setState({ user, isAuthenticated: !!user, isLoading: false });
    return { error };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: User['role']): Promise<{ error: string | null }> => {
    setState(s => ({ ...s, isLoading: true }));
    await new Promise(r => setTimeout(r, 1000));
    const { user, error } = registerUser(name, email, password, role);
    setState({ user, isAuthenticated: !!user, isLoading: false });
    return { error };
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setState(s => {
      if (!s.user) return s;
      const updated = { ...s.user, ...updates };
      localStorage.setItem('force1_auth', JSON.stringify(updated));
      return { ...s, user: updated };
    });
  }, []);

  return { ...state, login, register, logout, updateUser };
}
