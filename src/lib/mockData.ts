import type { User, Task, AttendanceRecord, Expense, BlogPost, TeamMember, Region, Notification } from '@/types';

export const DEMO_USERS: User[] = [
  {
    id: 'agent-1',
    name: 'Rahul Sharma',
    email: 'agent@demo.com',
    role: 'agent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    phone: '+91 98765 43210',
    region: 'Mumbai North',
    status: 'active',
    joinDate: '2023-03-15',
    tasksCompleted: 148,
    attendanceRate: 96,
  },
  {
    id: 'manager-1',
    name: 'Priya Patel',
    email: 'manager@demo.com',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
    phone: '+91 98765 43211',
    region: 'Mumbai',
    status: 'active',
    joinDate: '2022-07-01',
    tasksCompleted: 320,
    attendanceRate: 98,
  },
  {
    id: 'admin-1',
    name: 'Arjun Singh',
    email: 'admin@demo.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    phone: '+91 98765 43212',
    region: 'All Regions',
    status: 'active',
    joinDate: '2021-01-10',
    tasksCompleted: 512,
    attendanceRate: 99,
  },
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Site Survey — Andheri West', description: 'Conduct detailed site survey at Andheri West market zone', assignedTo: 'agent-1', assignedBy: 'manager-1', priority: 'high', status: 'in-progress', dueDate: '2026-04-30', createdAt: '2026-04-27', location: 'Andheri West, Mumbai', category: 'Survey' },
  { id: 't2', title: 'Client Visit — TechPark', description: 'Visit TechPark client for demo and KYC collection', assignedTo: 'agent-1', assignedBy: 'manager-1', priority: 'urgent', status: 'pending', dueDate: '2026-04-29', createdAt: '2026-04-26', location: 'Powai, Mumbai', category: 'Client Visit' },
  { id: 't3', title: 'Data Collection — Bandra', description: 'Collect market data from 20 retail stores in Bandra', assignedTo: 'agent-1', assignedBy: 'manager-1', priority: 'medium', status: 'completed', dueDate: '2026-04-25', createdAt: '2026-04-22', location: 'Bandra, Mumbai', category: 'Data Collection' },
  { id: 't4', title: 'Installation — Dadar', description: 'Install promotional material at 5 shops in Dadar', assignedTo: 'agent-1', assignedBy: 'manager-1', priority: 'low', status: 'completed', dueDate: '2026-04-24', createdAt: '2026-04-21', location: 'Dadar, Mumbai', category: 'Installation' },
  { id: 't5', title: 'Monthly Market Report', description: 'Compile and submit monthly field market analysis report', assignedTo: 'agent-1', assignedBy: 'manager-1', priority: 'high', status: 'pending', dueDate: '2026-04-30', createdAt: '2026-04-20', location: 'Office', category: 'Report' },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'a1', userId: 'agent-1', date: '2026-04-29', checkIn: '09:02', checkOut: undefined, status: 'present', location: 'Andheri Office, Mumbai' },
  { id: 'a2', userId: 'agent-1', date: '2026-04-28', checkIn: '09:15', checkOut: '18:30', status: 'present', location: 'Powai Field' },
  { id: 'a3', userId: 'agent-1', date: '2026-04-27', checkIn: '09:00', checkOut: '17:45', status: 'present', location: 'Bandra Field' },
  { id: 'a4', userId: 'agent-1', date: '2026-04-26', checkIn: undefined, checkOut: undefined, status: 'absent' },
  { id: 'a5', userId: 'agent-1', date: '2026-04-25', checkIn: '09:45', checkOut: '18:15', status: 'late', location: 'Dadar Field' },
];

export const MOCK_EXPENSES: Expense[] = [
  { id: 'e1', userId: 'agent-1', userName: 'Rahul Sharma', title: 'Travel — Auto Rickshaw', amount: 850, category: 'Travel', date: '2026-04-29', status: 'pending', description: 'Auto fare for client visit round trip' },
  { id: 'e2', userId: 'agent-1', userName: 'Rahul Sharma', title: 'Client Refreshments', amount: 450, category: 'Entertainment', date: '2026-04-28', status: 'approved', description: 'Tea and snacks for client meeting at TechPark' },
  { id: 'e3', userId: 'agent-1', userName: 'Rahul Sharma', title: 'Printing Materials', amount: 1200, category: 'Office', date: '2026-04-27', status: 'approved', description: 'Printed brochures and forms for field work' },
  { id: 'e4', userId: 'agent-1', userName: 'Rahul Sharma', title: 'Local Train Pass', amount: 2000, category: 'Travel', date: '2026-04-25', status: 'rejected', description: 'Monthly local train pass — April 2026' },
  { id: 'e5', userId: 'agent-1', userName: 'Rahul Sharma', title: 'Field Equipment', amount: 3500, category: 'Equipment', date: '2026-04-22', status: 'pending', description: 'Measurement tape and inspection kit' },
];

export const MOCK_TEAM: TeamMember[] = [
  { id: 'ag1', name: 'Rahul Sharma', email: 'rahul.s@force1.in', role: 'agent', status: 'active', region: 'Mumbai North', tasksCompleted: 148, attendanceRate: 96, phone: '+91 98765 43210', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face', lat: 19.118, lng: 72.856 },
  { id: 'ag2', name: 'Sneha Desai', email: 'sneha.d@force1.in', role: 'agent', status: 'active', region: 'Mumbai South', tasksCompleted: 132, attendanceRate: 94, phone: '+91 98765 43213', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face', lat: 18.930, lng: 72.834 },
  { id: 'ag3', name: 'Kiran Joshi', email: 'kiran.j@force1.in', role: 'agent', status: 'active', region: 'Thane', tasksCompleted: 165, attendanceRate: 98, phone: '+91 98765 43214', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face', lat: 19.218, lng: 72.978 },
  { id: 'ag4', name: 'Meera Nair', email: 'meera.n@force1.in', role: 'agent', status: 'inactive', region: 'Navi Mumbai', tasksCompleted: 89, attendanceRate: 82, phone: '+91 98765 43215', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face', lat: 19.033, lng: 73.029 },
  { id: 'ag5', name: 'Vijay Kumar', email: 'vijay.k@force1.in', role: 'agent', status: 'active', region: 'Pune', tasksCompleted: 201, attendanceRate: 99, phone: '+91 98765 43216', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=60&h=60&fit=crop&crop=face', lat: 18.520, lng: 73.856 },
  { id: 'mg1', name: 'Priya Patel', email: 'priya.p@force1.in', role: 'manager', status: 'active', region: 'Mumbai', tasksCompleted: 320, attendanceRate: 98, phone: '+91 98765 43211', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face', lat: 19.076, lng: 72.877 },
];

export const MOCK_REGIONS: Region[] = [
  { id: 'r1', name: 'Mumbai North', agentCount: 12, managerCount: 2, activeTasksCount: 34, completionRate: 87 },
  { id: 'r2', name: 'Mumbai South', agentCount: 10, managerCount: 2, activeTasksCount: 28, completionRate: 91 },
  { id: 'r3', name: 'Thane', agentCount: 8, managerCount: 1, activeTasksCount: 22, completionRate: 84 },
  { id: 'r4', name: 'Navi Mumbai', agentCount: 6, managerCount: 1, activeTasksCount: 18, completionRate: 78 },
  { id: 'r5', name: 'Pune', agentCount: 15, managerCount: 3, activeTasksCount: 45, completionRate: 93 },
  { id: 'r6', name: 'Nashik', agentCount: 5, managerCount: 1, activeTasksCount: 14, completionRate: 72 },
];

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: 'b1',
    title: 'How AI is Transforming Field Force Management in 2026',
    excerpt: 'Discover how machine learning and predictive analytics are revolutionizing how companies manage distributed teams across regions.',
    content: `The field force management industry is undergoing a massive transformation driven by artificial intelligence and machine learning technologies. Companies that adopt AI-powered platforms are seeing productivity gains of 30-40% while reducing operational costs significantly.

Modern field force management platforms now leverage real-time GPS tracking combined with AI algorithms to optimize route planning, predict task completion times, and automatically reassign tasks when agents face delays. This level of automation was unimaginable just five years ago.

**Key AI Features Reshaping the Industry:**

1. **Predictive Task Assignment**: AI analyzes agent performance history, current location, and skill set to automatically assign the most suitable agent to each task.

2. **Smart Route Optimization**: Machine learning algorithms process traffic data, historical patterns, and task priorities to create optimal daily routes for field agents.

3. **Automated Expense Verification**: Computer vision technology can scan receipts and automatically categorize expenses, reducing manual processing time by 80%.

4. **Performance Analytics**: AI-powered dashboards provide real-time insights into team performance, identifying bottlenecks before they impact business outcomes.

The future of field force management is intelligent, predictive, and automated. Organizations that embrace these technologies today will have a significant competitive advantage in the years ahead.`,
    author: 'Arjun Singh',
    date: '2026-04-20',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    readTime: '5 min read',
    tags: ['AI', 'Field Management', 'Technology', 'Productivity'],
  },
  {
    id: 'b2',
    title: '10 Best Practices for Managing Remote Field Agents',
    excerpt: 'Learn proven strategies for maintaining productivity, morale, and performance in distributed field teams across multiple regions.',
    content: `Managing remote field agents presents unique challenges that traditional office-based management practices cannot address. Here are the 10 most effective practices adopted by leading organizations.

**1. Clear Communication Protocols**
Establish daily briefings, task updates, and end-of-day reports using your field management platform. Consistency in communication prevents misunderstandings and keeps everyone aligned.

**2. GPS-Based Accountability**
Use location tracking not as surveillance, but as a tool to understand workload distribution and optimize agent deployment across territories.

**3. Real-Time Task Visibility**
Both managers and agents should have complete visibility into task status, priorities, and deadlines through mobile apps and web dashboards.

**4. Automated Attendance Systems**
Replace manual attendance sheets with geo-fenced check-in systems that capture accurate time and location data effortlessly.

**5. Mobile-First Tools**
Field agents work on the move. Ensure all tools are optimized for mobile use with offline capabilities for areas with poor connectivity.

**6. Performance Recognition**
Implement gamification elements like leaderboards, achievement badges, and performance bonuses to motivate distributed teams.

**7. Regular Training Programs**
Use the platform to deliver micro-learning modules that agents can complete between tasks, keeping skills sharp without disrupting workflow.

**8. Data-Driven Decision Making**
Leverage analytics to understand which agents perform best in specific territories and task types, then optimize assignments accordingly.

**9. Transparent Expense Management**
Streamline expense submission and approval to reduce agent frustration and ensure timely reimbursements.

**10. Emergency Protocols**
Establish clear escalation paths for field emergencies, ensuring agents know exactly who to contact and how in any situation.`,
    author: 'Priya Patel',
    date: '2026-04-15',
    category: 'Management',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
    readTime: '7 min read',
    tags: ['Management', 'Remote Work', 'Best Practices', 'Teams'],
  },
  {
    id: 'b3',
    title: 'GPS Tracking vs. Geo-Fencing: What Works Best for Field Teams?',
    excerpt: 'A comprehensive comparison of real-time GPS tracking and geo-fencing approaches for managing field force attendance and task verification.',
    content: `When deploying a field force management solution, one of the most critical decisions is choosing between continuous GPS tracking and geo-fencing based verification. Each approach has distinct advantages depending on your operational needs.

**Real-Time GPS Tracking:**
Continuous GPS monitoring provides managers with live visibility into agent locations, movement patterns, and route compliance. This approach is ideal for delivery teams, service technicians, and sales representatives who cover large territories.

**Benefits:**
- Complete movement history and audit trail
- Route optimization based on actual movement
- Emergency response capabilities
- Accurate mileage calculation for expense reimbursement

**Geo-Fencing:**
Geo-fencing creates virtual boundaries around specific locations like client sites, offices, or store locations. Actions (like task updates or attendance marking) are only possible when the agent is physically within the defined boundary.

**Benefits:**
- Privacy-respecting approach
- Lower battery consumption on agent devices
- Automatic task triggers based on location
- Attendance verification at specific sites

**The Verdict:**
For most organizations, a hybrid approach works best. Use geo-fencing for attendance and task completion verification at known locations, while enabling GPS tracking for route monitoring during field activities. Force1 supports both approaches with configurable settings for each agent type.`,
    author: 'Rahul Verma',
    date: '2026-04-10',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&h=400&fit=crop',
    readTime: '6 min read',
    tags: ['GPS', 'Geo-Fencing', 'Tracking', 'Technology'],
  },
  {
    id: 'b4',
    title: 'Force1 Case Study: 45% Productivity Boost for FMCG Company',
    excerpt: 'How a leading FMCG company deployed Force1 across 500 field agents in 8 states and achieved remarkable results within 3 months.',
    content: `A leading consumer goods company managing 500+ field sales representatives across 8 Indian states faced significant challenges with task completion rates, expense management, and real-time visibility into field activities.

**The Challenge:**
Manual attendance systems were unreliable, expense processing took 3-4 weeks, and managers had no visibility into daily field activities without calling each agent individually.

**The Force1 Solution:**
After deploying Force1 across all field agents and managers:

- Automated GPS-based attendance replaced paper registers
- Digital expense submission with instant manager approval
- Real-time task assignment and status tracking
- Performance dashboards for all management levels

**Results After 3 Months:**
- 45% improvement in task completion rates
- 60% reduction in expense processing time
- 35% reduction in travel costs through route optimization
- 28% improvement in attendance accuracy
- ROI achieved within the first 2 months of deployment

This case study demonstrates the transformative impact of modern field force management technology when properly implemented with the right change management approach.`,
    author: 'Anita Kapoor',
    date: '2026-04-05',
    category: 'Case Study',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    readTime: '8 min read',
    tags: ['Case Study', 'FMCG', 'Productivity', 'ROI'],
  },
  {
    id: 'b5',
    title: 'Mobile Workforce Trends to Watch in 2026',
    excerpt: 'From 5G integration to wearable technology, explore the top trends shaping the future of mobile workforce management.',
    content: `The mobile workforce landscape is evolving rapidly. Here are the most significant trends that will define how organizations manage distributed teams in 2026 and beyond.

**1. 5G-Enabled Real-Time Collaboration**
With 5G infrastructure now covering major Indian cities, field agents can share high-resolution photos, videos, and live streams from the field instantly, enabling remote technical support and better documentation.

**2. Wearable Technology Integration**
Smart watches and AR glasses are being piloted for hands-free task management, allowing technicians to access work orders and documentation without interrupting their work.

**3. Predictive Maintenance Scheduling**
IoT sensors combined with AI can predict equipment failures before they occur, allowing field service teams to be dispatched proactively.

**4. Voice-Activated Field Apps**
Natural language processing is making it possible for field agents to update task status, log expenses, and communicate with managers entirely through voice commands.

**5. Blockchain for Field Verification**
Immutable blockchain records of field activities are being explored for industries requiring high levels of audit compliance and fraud prevention.

These trends indicate a future where field work is increasingly augmented by technology, making agents more efficient and managers better informed than ever before.`,
    author: 'Dev Mehta',
    date: '2026-04-01',
    category: 'Trends',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
    readTime: '4 min read',
    tags: ['Trends', '5G', 'Wearables', 'Future of Work'],
  },
  {
    id: 'b6',
    title: 'Building a Culture of Accountability in Distributed Teams',
    excerpt: 'Creating accountability without micromanagement is the new management challenge. Here is how successful companies do it.',
    content: `Accountability in distributed field teams doesn't come from surveillance — it comes from systems, culture, and leadership. Companies that successfully build accountable field teams share several common practices.

**Transparent Goal Setting**
Every field agent should know their weekly and monthly targets — tasks to complete, territories to cover, and performance metrics to achieve. When goals are clear and measurable, accountability becomes natural.

**Tool-Enabled Self-Reporting**
The best field management platforms make it easy for agents to self-report their work. When updating task status takes 10 seconds on a mobile app, compliance rates approach 100%.

**Manager as Coach, Not Monitor**
Reframe the manager's role from surveillance to coaching. Use data to identify where agents need support, not to catch them making mistakes. This cultural shift dramatically improves engagement.

**Recognition and Rewards**
Public recognition through leaderboards and performance badges creates healthy competition and acknowledges excellence. Monetary rewards tied to performance metrics further drive accountability.

**Regular Retrospectives**
Weekly team reviews where agents share challenges, learnings, and successes build a culture where accountability is collective, not just individual.

Force1 provides all the tools needed to build this culture — from transparent task management to performance analytics to team leaderboards.`,
    author: 'Priya Patel',
    date: '2026-03-25',
    category: 'Management',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop',
    readTime: '5 min read',
    tags: ['Culture', 'Accountability', 'Leadership', 'Management'],
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'New Task Assigned', message: 'Site Survey — Andheri West has been assigned to you', type: 'info', timestamp: '2026-04-29T09:00:00', read: false },
  { id: 'n2', title: 'Expense Approved', message: 'Your Client Refreshments expense of ₹450 has been approved', type: 'success', timestamp: '2026-04-28T14:30:00', read: false },
  { id: 'n3', title: 'Task Overdue', message: 'Client Visit — TechPark is now overdue', type: 'warning', timestamp: '2026-04-28T18:00:00', read: true },
  { id: 'n4', title: 'Expense Rejected', message: 'Local Train Pass expense has been rejected. Please resubmit.', type: 'error', timestamp: '2026-04-27T10:15:00', read: true },
];

export const CHART_DATA = {
  weeklyTasks: [
    { day: 'Mon', completed: 8, assigned: 10 },
    { day: 'Tue', completed: 12, assigned: 14 },
    { day: 'Wed', completed: 6, assigned: 8 },
    { day: 'Thu', completed: 9, assigned: 11 },
    { day: 'Fri', completed: 14, assigned: 15 },
    { day: 'Sat', completed: 5, assigned: 6 },
    { day: 'Sun', completed: 2, assigned: 2 },
  ],
  monthlyAttendance: [
    { week: 'W1', present: 92, absent: 8 },
    { week: 'W2', present: 88, absent: 12 },
    { week: 'W3', present: 95, absent: 5 },
    { week: 'W4', present: 90, absent: 10 },
  ],
  expenseByCategory: [
    { name: 'Travel', value: 45, color: '#244855' },
    { name: 'Entertainment', value: 20, color: '#E64833' },
    { name: 'Office', value: 15, color: '#874F41' },
    { name: 'Equipment', value: 12, color: '#90AEAD' },
    { name: 'Others', value: 8, color: '#FBE9D0' },
  ],
  regionPerformance: [
    { region: 'Mum N', score: 87 },
    { region: 'Mum S', score: 91 },
    { region: 'Thane', score: 84 },
    { region: 'Navi', score: 78 },
    { region: 'Pune', score: 93 },
    { region: 'Nashik', score: 72 },
  ],
};
