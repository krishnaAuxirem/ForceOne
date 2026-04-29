export type UserRole = 'admin' | 'manager' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  region?: string;
  status: 'active' | 'inactive' | 'on-leave';
  joinDate: string;
  tasksCompleted?: number;
  attendanceRate?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dueDate: string;
  createdAt: string;
  location?: string;
  proof?: string;
  category: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'on-leave';
  location?: string;
  notes?: string;
}

export interface Expense {
  id: string;
  userId: string;
  userName: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  receipt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  region: string;
  tasksCompleted: number;
  attendanceRate: number;
  phone: string;
  avatar: string;
  lat?: number;
  lng?: number;
}

export interface Region {
  id: string;
  name: string;
  agentCount: number;
  managerCount: number;
  activeTasksCount: number;
  completionRate: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export interface DashboardStats {
  totalAgents: number;
  activeTasks: number;
  completedToday: number;
  pendingExpenses: number;
  presentToday: number;
  totalRegions: number;
}
