import { DEMO_USERS } from './mockData';
import type { User } from '@/types';

const AUTH_KEY = 'force1_auth';
const USERS_KEY = 'force1_users';

export function getStoredUsers(): User[] {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { return [...DEMO_USERS]; }
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_USERS));
  return [...DEMO_USERS];
}

export function saveUser(user: User, password: string): void {
  const users = getStoredUsers();
  const passwords = getStoredPasswords();
  const existing = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (!existing) {
    users.push(user);
    passwords[user.email.toLowerCase()] = password;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem('force1_passwords', JSON.stringify(passwords));
  }
}

export function getStoredPasswords(): Record<string, string> {
  const stored = localStorage.getItem('force1_passwords');
  if (stored) {
    try { return JSON.parse(stored); } catch { }
  }
  const defaults: Record<string, string> = {};
  DEMO_USERS.forEach(u => { defaults[u.email.toLowerCase()] = '123456'; });
  localStorage.setItem('force1_passwords', JSON.stringify(defaults));
  return defaults;
}

export function loginUser(email: string, password: string): { user: User | null; error: string | null } {
  const users = getStoredUsers();
  const passwords = getStoredPasswords();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { user: null, error: 'No account found with this email. Please register first.' };
  const stored = passwords[email.toLowerCase()];
  if (stored !== password) return { user: null, error: 'Incorrect password. Please try again.' };
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return { user, error: null };
}

export function registerUser(name: string, email: string, password: string, role: User['role'] = 'agent'): { user: User | null; error: string | null } {
  const users = getStoredUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return { user: null, error: 'An account with this email already exists. Please login.' };
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    role,
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
    tasksCompleted: 0,
    attendanceRate: 0,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=244855&color=FBE9D0&size=80`,
  };
  saveUser(newUser, password);
  localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
  return { user: newUser, error: null };
}

export function getCurrentUser(): User | null {
  const stored = localStorage.getItem(AUTH_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { }
  }
  return null;
}

export function logoutUser(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
