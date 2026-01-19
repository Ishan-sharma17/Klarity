
import { Priority, Task, TaskStatus, User, WorkloadCell, Email, ProjectFile } from './types.ts';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Chen',
  avatar: 'https://picsum.photos/id/1005/200/200',
  role: 'Manager',
  burnoutScore: 42,
};

export const MOCK_USERS: User[] = [
  CURRENT_USER,
  { id: 'u2', name: 'Sarah Jones', avatar: 'https://picsum.photos/id/1011/200/200', role: 'Employee', burnoutScore: 78 },
  { id: 'u3', name: 'Mike Ross', avatar: 'https://picsum.photos/id/1012/200/200', role: 'Employee', burnoutScore: 15 },
  { id: 'u4', name: 'Priya Patel', avatar: 'https://picsum.photos/id/1025/200/200', role: 'Employee', burnoutScore: 60 },
];

const TODAY = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const TODAY_STR = formatDate(TODAY);
const TOMORROW_STR = formatDate(new Date(Date.now() + 86400000));
const YESTERDAY_STR = formatDate(new Date(Date.now() - 86400000));
const NEXT_WEEK_STR = formatDate(new Date(Date.now() + 86400000 * 5));
const TWO_DAYS_AGO_STR = formatDate(new Date(Date.now() - 86400000 * 2));
const IN_3_DAYS_STR = formatDate(new Date(Date.now() + 86400000 * 3));

// --- Projects ---
const PROJECTS = {
    MARKETING: { id: 'p1', name: 'Marketing & Design', color: 'bg-indigo-500' },
    MOBILE: { id: 'p2', name: 'Mobile App Launch', color: 'bg-blue-500' },
    REBRAND: { id: 'p3', name: 'Q4 Rebrand', color: 'bg-emerald-500' }
};

// --- Activity Sets ---

const GENERAL_ACTIVITIES = [
  { id: 'a1', user: CURRENT_USER, type: 'UPDATE', text: 'changed due date from Yesterday to Today', timestamp: new Date(Date.now() - 1000 * 60 * 10) },
  { id: 'a2', user: CURRENT_USER, type: 'UPDATE', text: 'set priority to High', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: 'a3', user: MOCK_USERS[1], type: 'COMMENT', text: 'I can help with the initial setup if needed.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) },
];

const COLLAB_ACTIVITIES = [
  { 
      id: 'ca1', 
      user: MOCK_USERS[1], 
      type: 'COMMENT', 
      text: 'Uploaded the latest specs. Please review.', 
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      attachments: [
          { id: 'att1', name: 'Q4_Design_Specs_v2.pdf', type: 'FILE', url: '#', size: '2.4 MB' },
          { id: 'att2', name: 'Moodboard Link', type: 'LINK', url: '#', icon: 'figma' }
      ]
  },
  { id: 'ca2', user: CURRENT_USER, type: 'UPDATE', text: 'changed status to In Progress', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25) },
  { id: 'ca3', user: MOCK_USERS[2], type: 'COMMENT', text: 'Looks good to me.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) },
];

const API_ACTIVITIES = [
  { id: 'api1', user: CURRENT_USER, type: 'UPDATE', text: 'created this task', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
  { 
      id: 'api2', 
      user: MOCK_USERS[1], 
      type: 'COMMENT', 
      text: 'Do we need the v2 endpoints? I attached the current schema for reference.', 
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      attachments: [
          { id: 'att3', name: 'api_schema_v1.json', type: 'FILE', url: '#', size: '45 KB' }
      ]
  },
  { id: 'api3', user: CURRENT_USER, type: 'COMMENT', text: 'Yes, for the mobile app support.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23) },
  { id: 'api4', user: CURRENT_USER, type: 'UPDATE', text: 'added tag "API"', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23) },
];

const REVIEW_ACTIVITIES = [
  { id: 'ra1', user: MOCK_USERS[3], type: 'UPDATE', text: 'moved to Review', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { 
      id: 'ra2', 
      user: CURRENT_USER, 
      type: 'COMMENT', 
      text: 'Checking this now. Can you also look at the new flow?', 
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      attachments: [
          { id: 'att4', name: 'User_Flow_Diagram.png', type: 'IMAGE', url: 'https://picsum.photos/id/20/400/300', size: '1.2 MB' }
      ]
  },
];

export const INITIAL_TASKS: Task[] = [
  // AI SUGGESTION (GHOST TASK)
  {
    id: 't_ghost_1',
    title: 'Optimize Database Queries',
    status: TaskStatus.TODO,
    priority: Priority.HIGH,
    assignee: undefined,
    tags: ['Database', 'AI'],
    startDate: TODAY_STR,
    dueDate: IN_3_DAYS_STR,
    description: "Detected slow query logs on the payments table. Suggested indexing for improved performance.",
    weight: 45,
    subtasks: [],
    activities: [],
    isGhost: true,
    aiConfidence: 0.92,
    project: PROJECTS.MOBILE
  },

  // NOT STARTED (TODO)
  {
    id: 't_demo_1',
    title: 'Implement New Feature',
    status: TaskStatus.TODO,
    priority: Priority.MEDIUM,
    assignee: MOCK_USERS[1],
    tags: ['Feature'],
    startDate: '2024-04-17',
    dueDate: '2024-05-15',
    description: "Add a 'dark mode' option for improved UX.",
    weight: 30,
    subtasks: [],
    activities: GENERAL_ACTIVITIES as any,
    project: PROJECTS.MARKETING
  },
  {
    id: 't_demo_2',
    title: 'Fix Bug - On Payment',
    status: TaskStatus.TODO,
    priority: Priority.CRITICAL,
    assignee: MOCK_USERS[2],
    tags: ['Bug'],
    startDate: '2024-05-10',
    dueDate: '2024-07-18',
    description: "The 'save' button is not working on mobile.",
    weight: 60,
    subtasks: [],
    activities: [],
    project: PROJECTS.MOBILE
  },
  {
    id: 't_demo_3',
    title: 'Review Design - Final',
    status: TaskStatus.TODO,
    priority: Priority.MEDIUM,
    assignee: CURRENT_USER,
    tags: ['Review'],
    startDate: '2024-06-11',
    dueDate: '2024-07-17',
    description: "Provide feedback on the latest UI prototypes.",
    weight: 20,
    subtasks: [],
    activities: COLLAB_ACTIVITIES as any,
    project: PROJECTS.MARKETING
  },
  {
    id: 't_demo_4',
    title: 'New Version - Quality Check',
    status: TaskStatus.TODO,
    priority: Priority.LOW,
    assignee: MOCK_USERS[3],
    tags: ['Testing'],
    startDate: '2024-05-27',
    dueDate: '2024-06-11',
    description: "Conduct thorough testing of updated software.",
    weight: 40,
    subtasks: [],
    activities: [],
    project: PROJECTS.REBRAND
  },

  // IN PROGRESS
  {
    id: 't_demo_5',
    title: 'Fix Bug - Mobile Compatibility',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.CRITICAL,
    assignee: MOCK_USERS[1],
    tags: ['Bug'],
    startDate: '2024-04-17',
    dueDate: '2024-05-15',
    description: "The app is crashing on some Android devices.",
    weight: 70,
    subtasks: [],
    activities: [],
    project: PROJECTS.MOBILE
  },
  {
    id: 't_demo_6',
    title: 'Review Marketing Campaign',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.MEDIUM,
    assignee: MOCK_USERS[2],
    tags: ['Review'],
    startDate: '2024-05-10',
    dueDate: '2024-07-18',
    description: "Analyze the effectiveness of recent social media.",
    weight: 35,
    subtasks: [],
    activities: [],
    project: PROJECTS.MARKETING
  },
  {
    id: 't_demo_7',
    title: 'Conduct User Research',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.MEDIUM,
    assignee: CURRENT_USER,
    tags: ['Testing'],
    startDate: '2024-06-11',
    dueDate: '2024-07-17',
    description: "Gather feedback from users to identify areas.",
    weight: 50,
    subtasks: [],
    activities: [],
    project: PROJECTS.REBRAND
  },
  {
    id: 't_demo_8',
    title: 'Update Documentation',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.CRITICAL,
    assignee: MOCK_USERS[3],
    tags: ['Review'],
    startDate: '2024-05-27',
    dueDate: '2024-06-11',
    description: "Ensure all documentation is update and accurate.",
    weight: 25,
    subtasks: [],
    activities: [],
    project: PROJECTS.MOBILE
  },

  // DONE
  {
    id: 't_demo_9',
    title: 'Optimize Database Performance',
    status: TaskStatus.DONE,
    priority: Priority.LOW,
    assignee: MOCK_USERS[2],
    tags: ['Feature'],
    startDate: '2024-04-17',
    dueDate: '2024-05-15',
    description: "Improve database query efficiency & scalability.",
    weight: 40,
    subtasks: [],
    activities: [],
    project: PROJECTS.MOBILE
  },
  {
    id: 't_demo_10',
    title: 'Improve API Security',
    status: TaskStatus.DONE,
    priority: Priority.CRITICAL,
    assignee: CURRENT_USER,
    tags: ['Feature'],
    startDate: '2024-05-10',
    dueDate: '2024-07-18',
    description: "Enhance API security measures to protect.",
    weight: 80,
    subtasks: [],
    activities: [],
    project: PROJECTS.MOBILE
  },
  {
    id: 't_demo_11',
    title: 'Implement API for Task Creation',
    status: TaskStatus.DONE,
    priority: Priority.MEDIUM,
    assignee: MOCK_USERS[1],
    tags: ['Feature'],
    startDate: '2024-05-27',
    dueDate: '2024-06-11',
    description: "Develop an API endpoint to create new tasks.",
    weight: 45,
    subtasks: [],
    activities: [],
    project: PROJECTS.MOBILE
  }
];

export const MOCK_EMAILS: Email[] = [
  {
    id: 'e1',
    sender: 'Client: Acme Corp',
    subject: 'Urgent: Revision for Homepage',
    preview: 'Hi Alex, we need to change the hero image...',
    body: 'Hi Alex,\n\nWe need to change the hero image on the homepage before the launch tomorrow. Can you please prioritize this?\n\nThanks,\nJohn',
    date: '10:30 AM',
    read: false,
    category: 'PRIMARY',
    archived: false,
  },
  {
    id: 'e2',
    sender: 'Sarah Jones',
    subject: 'Design Assets',
    preview: 'Here are the assets you requested.',
    body: 'Attached are the files for the Q3 review presentation.',
    date: 'Yesterday',
    read: true,
    category: 'PRIMARY',
    archived: false,
  },
  {
    id: 'e3',
    sender: 'HR Department',
    subject: 'Open Enrollment',
    preview: 'It is that time of year again...',
    body: 'Please review your benefits package by Friday.',
    date: 'Oct 20',
    read: true,
    category: 'OTHER',
    archived: false,
  },
  {
    id: 'e4',
    sender: 'Newsletter: Tech Weekly',
    subject: 'The Future of AI is Here',
    preview: 'Top stories this week in artificial intelligence...',
    body: 'Read our latest digest on how AI is transforming the workplace.',
    date: 'Oct 19',
    read: false,
    category: 'LATER',
    archived: false,
  },
  {
    id: 'e5',
    sender: 'System Notification',
    subject: 'Password Changed Successfully',
    preview: 'Your password was updated on Oct 15.',
    body: 'If this was not you, please contact support immediately.',
    date: 'Oct 15',
    read: true,
    category: 'OTHER',
    archived: true,
  }
];

export const HEATMAP_DATA: Record<string, WorkloadCell[]> = {
  'u1': Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
    hours: 6 + Math.random() * 4,
    adHocPercentage: 20 + Math.random() * 30,
    meetingCount: Math.floor(Math.random() * 6),
  })),
  'u2': Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
    hours: 7 + Math.random() * 5, // High workload
    adHocPercentage: 40 + Math.random() * 40,
    meetingCount: Math.floor(Math.random() * 8),
  })),
  'u3': Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
    hours: 4 + Math.random() * 3,
    adHocPercentage: 10 + Math.random() * 10,
    meetingCount: Math.floor(Math.random() * 3),
  })),
  'u4': Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
    hours: 6 + Math.random() * 2,
    adHocPercentage: 25 + Math.random() * 15,
    meetingCount: Math.floor(Math.random() * 5),
  })),
};

export const MOCK_FILES: ProjectFile[] = [
    {
        id: 'f1',
        name: 'Homepage_Redesign_v2.fig',
        type: 'FIGMA',
        url: '#',
        size: '12 MB',
        uploadedBy: CURRENT_USER,
        uploadedAt: 'Today, 10:23 AM'
    },
    {
        id: 'f2',
        name: 'Q4_Marketing_Strategy.pdf',
        type: 'PDF',
        url: '#',
        size: '4.5 MB',
        uploadedBy: MOCK_USERS[1],
        uploadedAt: 'Yesterday'
    },
    {
        id: 'f3',
        name: 'Hero_Banner_Assets.zip',
        type: 'DOC',
        url: '#',
        size: '156 MB',
        uploadedBy: MOCK_USERS[2],
        uploadedAt: 'Oct 24'
    },
    {
        id: 'f4',
        name: 'User_Research_Report_2024.docx',
        type: 'DOC',
        url: '#',
        size: '1.2 MB',
        uploadedBy: MOCK_USERS[3],
        uploadedAt: 'Oct 20'
    },
    {
        id: 'f5',
        name: 'Screenshot_Error_Login.png',
        type: 'IMAGE',
        url: '#',
        size: '240 KB',
        uploadedBy: MOCK_USERS[1],
        uploadedAt: 'Today, 9:00 AM'
    },
    {
        id: 'f6',
        name: 'Budget_Q4.xlsx',
        type: 'SHEET',
        url: '#',
        size: '34 KB',
        uploadedBy: CURRENT_USER,
        uploadedAt: 'Oct 18'
    }
];
