export type NoticeCategory = 
  | 'assignment' 
  | 'exam' 
  | 'event' 
  | 'deadline' 
  | 'general' 
  | 'holiday' 
  | 'placement' 
  | 'administrative';

export type NoticePriority = 'urgent' | 'high' | 'medium' | 'low';

export type NoticeStatus = 
  | 'urgent' 
  | 'upcoming' 
  | 'completed' 
  | 'expired' 
  | 'needs_clarification';

export interface InferredFlags {
  title: boolean;
  category: boolean;
  eventDate: boolean;
  deadline: boolean;
  eventTime: boolean;
  venue: boolean;
  audience: boolean;
  priority: boolean;
}

export interface CampusNotice {
  id: string;
  rawText: string;
  title: string;
  summary: string;
  category: NoticeCategory;
  priority: NoticePriority;
  status: NoticeStatus;
  
  // Dates can be ISO strings (YYYY-MM-DD or YYYY-MM-DDTHH:mm) or null if not specified
  eventDate: string | null;      // Date the event actually takes place
  eventTime: string | null;      // e.g. "10:30 AM" or "14:00"
  deadline: string | null;       // Date/time by which action/submission must be completed
  venue: string | null;          // Location e.g., "Auditorium 2", "Lab 305", "Online - Zoom"
  audience: string | null;       // Target audience e.g., "All 3rd Year CSE", "B.Tech Students"
  
  suggestedAction: string | null; // e.g., "Submit assignment on Moodle", "Fill Google Form"
  isCompleted: boolean;          // Student completion status
  isDismissed: boolean;          // Dismissed from radar
  
  // Meta
  createdAt: string;             // ISO string
  updatedAt: string;             // ISO string
  isDemo?: boolean;              // Demo data indicator
  parsingMode: 'rule-based' | 'ai';
  confidenceScore: number;       // 0 - 100
  inferredFields: InferredFlags;
  
  // Ambiguity / Needs user confirmation
  hasAmbiguousDate?: boolean;
  ambiguityReason?: string;
  dateConfirmed?: boolean;
}

export interface DuplicateCandidate {
  noticeA: CampusNotice;
  noticeB: CampusNotice;
  similarityScore: number; // 0 - 1
  reason: string;
}

export interface ConflictAlert {
  originalNotice: CampusNotice;
  conflictingNotice: CampusNotice;
  conflictType: 'venue' | 'date' | 'time' | 'deadline' | 'multiple';
  description: string;
  detectedAt: string;
}

export interface WeeklyDigest {
  generatedAt: string;
  weekRange: { start: string; end: string };
  summary: string;
  topDeadlines: CampusNotice[];
  eventsThisWeek: CampusNotice[];
  urgentAlerts: CampusNotice[];
  overdueTasks: CampusNotice[];
  actionChecklist: { task: string; noticeId: string; deadline: string | null; completed: boolean }[];
  clarificationNeeded: CampusNotice[];
}

export type ViewTab = 
  | 'home'
  | 'dashboard'
  | 'notices' 
  | 'events' 
  | 'forums' 
  | 'polls' 
  | 'resources' 
  | 'about' 
  | 'calendar' 
  | 'actions';

export type Language = 'en' | 'hi';

// Poll interface
export interface CampusPollOption {
  id: string;
  text: string;
  votes: number;
}

export interface CampusPoll {
  id: string;
  question: string;
  options: CampusPollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
}

// Forum interface
export interface ForumPost {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  avatarColor: string;
  content: string;
  category: 'academics' | 'events' | 'campus-life' | 'placements';
  likes: number;
  isLiked?: boolean;
  repliesCount: number;
  createdAt: string;
  tags: string[];
}

// Resource item
export interface CampusResource {
  id: string;
  title: string;
  category: 'notes' | 'pyq' | 'manual' | 'handbook';
  department: string;
  semester: string;
  fileSize: string;
  downloads: number;
  format: 'PDF' | 'ZIP' | 'DOC';
  updatedAt: string;
}

// Notification item
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'urgent' | 'event' | 'forum' | 'system';
}
