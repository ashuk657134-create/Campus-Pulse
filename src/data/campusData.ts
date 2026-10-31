import { CampusPoll, ForumPost, CampusResource, NotificationItem } from '../types/index.ts';

export const INITIAL_CAMPUS_POLL: CampusPoll = {
  id: 'campus-poll-main',
  question: 'What do you like most about Campus Pulse?',
  options: [
    { id: 'opt-events', text: 'Events & Activities', votes: 78 },
    { id: 'opt-forums', text: 'Community Forum', votes: 45 },
    { id: 'opt-resources', text: 'Study Resources', votes: 92 },
  ],
  totalVotes: 215,
};

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    title: 'DSA End-Semester Revision: Graph Algorithms Cheat Sheet & MOSS notes',
    author: 'Rohan Sharma',
    authorRole: '3rd Year CSE • Academic Lead',
    avatarColor: 'from-[#8B2EFF] to-[#B44CFF]',
    content: 'Hey everyone! Putting together a shared Notion revision page with Dijkstra, Bellman-Ford, and Floyd-Warshall implementations with common boundary test cases. Let me know if you want access or have additional notes!',
    category: 'academics',
    likes: 42,
    repliesCount: 16,
    createdAt: '2 hours ago',
    tags: ['DSA', 'Exams', 'StudyGroup']
  },
  {
    id: 'post-2',
    title: 'Need 1 Full-Stack Dev (React / Node) for Tech Fest 2026 24hr Hackathon',
    author: 'Priya Verma',
    authorRole: '2nd Year IT • Hacker',
    avatarColor: 'from-[#FF38B8] to-[#FF8A24]',
    content: 'Our team "CodeCrusaders" has 2 AI/ML developers and 1 UI/UX designer. We are looking for 1 solid React/Node full-stack developer for the Web3 & AI tracks at MIT Campus Tech Fest 2026. Free pizza on us!',
    category: 'events',
    likes: 29,
    repliesCount: 11,
    createdAt: '5 hours ago',
    tags: ['TechFest2026', 'Hackathon', 'TeamFormation']
  },
  {
    id: 'post-3',
    title: 'Hostel 3 Wi-Fi Speed & Router Maintenance Update',
    author: 'Aditya Gupta',
    authorRole: 'Hostel Student Representative',
    avatarColor: 'from-[#22D3A6] to-[#10B981]',
    content: 'IT Admin has upgraded the fiber switches for 2nd and 3rd floors in Hostel 3. Speeds are averaging 180 Mbps on 5GHz band. If you face captive portal login drops, clear DNS cache or report room number below.',
    category: 'campus-life',
    likes: 54,
    repliesCount: 23,
    createdAt: 'Yesterday',
    tags: ['Hostel', 'CampusFacilities', 'WiFi']
  },
  {
    id: 'post-4',
    title: 'TCS Digital Interview Experience & PPT Tips for Batch 2027',
    author: 'Sneha Patel',
    authorRole: 'Placed at TCS Prime • Alumni Mentor',
    avatarColor: 'from-[#FF8A24] to-[#FFC857]',
    content: 'Attended the preliminary PPT session yesterday. Key takeaways: Keep 2 crisp hard copies of resume, prepare Java/Python OOP fundamentals thoroughly, and be ready with 1 live project explanation.',
    category: 'placements',
    likes: 67,
    repliesCount: 31,
    createdAt: '2 days ago',
    tags: ['TCS', 'Placements', 'Careers']
  }
];

export const INITIAL_CAMPUS_RESOURCES: CampusResource[] = [
  {
    id: 'res-1',
    title: 'Data Structures & Algorithms - Complete Lab Manual & Solutions',
    category: 'manual',
    department: 'Computer Science',
    semester: 'Semester 5',
    fileSize: '4.8 MB',
    downloads: 412,
    format: 'PDF',
    updatedAt: 'Oct 2026'
  },
  {
    id: 'res-2',
    title: 'Computer Networks - Previous 5 Years Solved Mid-Sem & End-Sem Papers',
    category: 'pyq',
    department: 'CSE & IT',
    semester: 'Semester 5',
    fileSize: '12.4 MB',
    downloads: 689,
    format: 'PDF',
    updatedAt: 'Sep 2026'
  },
  {
    id: 'res-3',
    title: 'Operating Systems - Microkernel & CPU Scheduling Lecture Handouts',
    category: 'notes',
    department: 'Computer Science',
    semester: 'Semester 4',
    fileSize: '6.2 MB',
    downloads: 325,
    format: 'PDF',
    updatedAt: 'Aug 2026'
  },
  {
    id: 'res-4',
    title: 'MIT Campus Technical Fest 2026 - Rulebook, Categories & Problem Statements',
    category: 'handbook',
    department: 'All Departments',
    semester: 'All Semesters',
    fileSize: '3.1 MB',
    downloads: 870,
    format: 'PDF',
    updatedAt: 'Oct 2026'
  },
  {
    id: 'res-5',
    title: 'Database Management Systems - SQL Queries & Normalization Cheatsheet',
    category: 'notes',
    department: 'Information Technology',
    semester: 'Semester 4',
    fileSize: '2.5 MB',
    downloads: 512,
    format: 'PDF',
    updatedAt: 'Oct 2026'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Urgent: No Vehicle Day Tomorrow',
    message: 'MIT Campus gates will remain closed for private vehicles from 8:00 AM to 5:00 PM.',
    time: '15m ago',
    isRead: false,
    type: 'urgent'
  },
  {
    id: 'notif-2',
    title: 'Tech Fest 2026 Registration Open',
    message: 'Early bird registration closes in 5 days. Cash prizes worth ₹2,50,000!',
    time: '1h ago',
    isRead: false,
    type: 'event'
  },
  {
    id: 'notif-3',
    title: 'Library 24/7 Hours Active',
    message: 'Reading rooms now open round the clock for exam preparations.',
    time: '3h ago',
    isRead: true,
    type: 'system'
  },
  {
    id: 'notif-4',
    title: 'New Reply in Forums',
    message: 'Rohan Sharma replied to your query regarding Graph Algorithms implementation.',
    time: '5h ago',
    isRead: true,
    type: 'forum'
  }
];

