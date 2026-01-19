
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ViewMode {
  // Global / Personal
  DASHBOARD = 'DASHBOARD',
  MY_TASKS = 'MY_TASKS',
  MY_CALENDAR = 'MY_CALENDAR',
  
  // Reflection / Pulse Section
  SELF_REFLECT = 'SELF_REFLECT', // Maps to "My Pulse"
  REFLECT_CHECKIN = 'REFLECT_CHECKIN',
  REFLECT_HISTORY = 'REFLECT_HISTORY',
  
  // Communication
  INBOX = 'INBOX',
  SPACES = 'SPACES', // New Spaces/Channels View
  
  HEATMAP = 'HEATMAP',
  
  // Project Specific
  PROJECT_OVERVIEW = 'PROJECT_OVERVIEW',
  PROJECT_LIST = 'PROJECT_LIST',
  PROJECT_BOARD = 'PROJECT_BOARD',
  PROJECT_CALENDAR = 'PROJECT_CALENDAR',
  PROJECT_FILES = 'PROJECT_FILES',
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'Manager' | 'Employee';
  burnoutScore: number; // 0-100
}

export interface Attachment {
  id: string;
  name: string;
  type: 'FILE' | 'LINK' | 'IMAGE';
  url: string;
  size?: string; // e.g. "2.4 MB"
  icon?: string; // e.g. "figma", "pdf"
}

export interface Activity {
  id: string;
  user: User;
  type: 'COMMENT' | 'HISTORY' | 'UPDATE';
  text: string;
  timestamp: Date;
  attachments?: Attachment[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface ProjectInfo {
    id: string;
    name: string;
    color?: string;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assignee?: User;
  priority: Priority;
  tags: string[];
  dueDate: string;
  startDate?: string;
  isGhost?: boolean; // AI Suggested task
  weight?: number; // 0-100, estimated effort vs interruption
  aiConfidence?: number; // For ghost tasks
  description?: string;
  activities?: Activity[];
  subtasks?: Subtask[];
  timeEstimate?: string;
  timeTracked?: string;
  project?: ProjectInfo;
}

export type EmailCategory = 'PRIMARY' | 'OTHER' | 'LATER';

export interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  read: boolean;
  archived?: boolean;
  category: EmailCategory;
}

export interface ChatMessage {
  role: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export interface WorkloadCell {
  date: string;
  hours: number;
  adHocPercentage: number;
  meetingCount: number;
}

export interface ProjectFile {
    id: string;
    name: string;
    type: 'FIGMA' | 'PDF' | 'IMAGE' | 'DOC' | 'SHEET';
    url: string;
    size: string;
    uploadedBy: User;
    uploadedAt: string;
}
