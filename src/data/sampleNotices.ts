import type { CampusNotice } from '../types/index.ts';
import { addDaysToCurrentDate } from '../utils/dateUtils.ts';

export interface SampleNoticeTemplate {
  name: string;
  tag: string;
  category: string;
  text: string;
}

export const SAMPLE_INPUT_PRESETS: SampleNoticeTemplate[] = [
  {
    name: "Tech Fest 2026 (MIT Campus)",
    tag: "Flagship Event",
    category: "event",
    text: `🚀 TECH FEST 2026 – REGISTER NOW! 🚀
Annual National Technical Symposium of MIT Campus, Moradabad.
📅 Date: 25 November 2026
⏰ Time: 10:00 AM Sharp
📍 Venue: Main Auditorium, MIT Campus, Moradabad
Events: Robowar, Web3 Hackathon, AI Innovation Showcase, Gaming Tournament.
Prizes worth ₹2,50,000 + Tech Internship Offers!
Registration Deadline: 20 November at 11:59 PM.
Register your team at: https://mit.campus.edu/techfest2026`
  },
  {
    name: "Urgent: No Vehicle Day Circular",
    tag: "Campus Green Drive",
    category: "administrative",
    text: `OFFICE OF THE DIRECTOR & PROCTORIAL BOARD
Ref: MIT/ENV/2026/18
URGENT CIRCULAR: NO VEHICLE DAY ON 22 MAY 2026
In support of environmental sustainability, all student and faculty two-wheelers and four-wheelers are strictly prohibited inside MIT Campus, Moradabad on 22 May 2026.
Gate entry for private motor vehicles will remain locked from 8:00 AM to 5:00 PM.
Electric shuttle buses will operate from Moradabad Railway Station to Campus Main Gate.`
  },
  {
    name: "MIT Library Timings Updated",
    tag: "General Notice",
    category: "general",
    text: `CENTRAL LIBRARY NOTIFICATION - MIT CAMPUS, MORADABAD
Please note that in view of the upcoming semester examinations, the Central Library reading halls and digital research labs will remain open 24/7 starting from next Monday.
Circulation & book return counters: 9:00 AM to 8:00 PM.
Silence is strictly mandatory in the mezzanine quiet zone.`
  },
  {
    name: "DSA Lab Assignment (WhatsApp)",
    tag: "WhatsApp Forward",
    category: "assignment",
    text: `[Forwarded message]
Guys note down urgent: DSA Lab Assignment 3 (Graph Algorithms & Dijkstra Implementation) has been uploaded on Moodle.
Submission deadline: Friday 11:59 PM.
Late submissions will face a strict 20% grade deduction per day.
Submission format: RollNo_DSA_Assign3.zip containing code and analysis report.
Plagiarism check through MOSS will be applied. Do not share code.
- Prof. A. K. Sharma (Dept of CSE)`
  },
  {
    name: "Mid-Term Examination Circular",
    tag: "Official Circular",
    category: "exam",
    text: `OFFICE OF THE CONTROLLER OF EXAMINATIONS
Ref: EXAM/EVEN/2026/044

CIRCULAR: MID-SEMESTER EXAMINATIONS - FALL 2026
This is to inform all B.Tech 2nd & 3rd Year students that Mid-Semester Examinations will commence from next Monday at 10:00 AM.
Venues: Central Examination Hall & Audi 2 (Seating plan will be displayed on department boards tomorrow).
Students must carry their valid College ID Cards and Hall Tickets. Smartwatches, mobile phones, and programmable calculators are strictly prohibited inside the hall.`
  },
  {
    name: "Networks Lab Venue Shift (Conflict)",
    tag: "Urgent Update",
    category: "academic",
    text: `URGENT ATTENTION 3rd Year CSE Batch B:
Please note that today's Computer Networks Lab (originally scheduled in Lab 204 at 2:00 PM) has been RELOCATED to Advanced Systems Lab 305 due to switch failure.
Timing remains unchanged: 2:00 PM to 4:00 PM.
Bring your completed routing protocol observation notebooks.`
  },
  {
    name: "Hinglish Campus Placement Alert",
    tag: "Hinglish / WhatsApp",
    category: "placement",
    text: `Sabhi final year students dhyan dein:
TCS Digital & Prime campus recruitment drive ka Pre-Placement Talk kal subah 10:30 AM Seminar Hall 1 mein hoga.
Formal dress code compulsory hai.
Sabhi registered candidates ko apna updated resume ka 2 printout aur college ID card sath lana mandatory hai. Attendance record hogi.`
  }
];

// Initial preloaded realistic notices for immediate demo
export const INITIAL_DEMO_NOTICES: CampusNotice[] = [
  {
    id: "demo-notice-techfest",
    rawText: SAMPLE_INPUT_PRESETS[0].text,
    title: "Tech Fest 2026 – Register Now!",
    summary: "Annual National Technical Symposium featuring Robowar, AI Hackathon & ₹2.5L prizes at MIT Campus, Moradabad.",
    category: "event",
    priority: "high",
    status: "upcoming",
    eventDate: "2026-11-25T10:00:00",
    eventTime: "10:00 AM",
    deadline: "2026-11-20T23:59:00",
    venue: "Main Auditorium, MIT Campus",
    audience: "All Undergraduate & Polytechnic Students",
    suggestedAction: "Register your 2-4 member squad for Tech Fest 2026",
    isCompleted: false,
    isDismissed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: true,
    parsingMode: "rule-based",
    confidenceScore: 98,
    inferredFields: {
      title: false,
      category: false,
      eventDate: false,
      deadline: false,
      eventTime: false,
      venue: false,
      audience: false,
      priority: false
    }
  },
  {
    id: "demo-notice-novehicle",
    rawText: SAMPLE_INPUT_PRESETS[1].text,
    title: "Urgent: No Vehicle Day on 22 May 2026",
    summary: "Private motor vehicles prohibited inside MIT Campus, Moradabad. Electric shuttles operational from Railway Station.",
    category: "administrative",
    priority: "urgent",
    status: "urgent",
    eventDate: "2026-05-22T08:00:00",
    eventTime: "08:00 AM - 05:00 PM",
    deadline: null,
    venue: "MIT Campus Gates & Parking",
    audience: "All Students, Faculty & Visitors",
    suggestedAction: "Use campus electric shuttles or public transport on 22 May",
    isCompleted: false,
    isDismissed: false,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    isDemo: true,
    parsingMode: "rule-based",
    confidenceScore: 96,
    inferredFields: {
      title: false,
      category: false,
      eventDate: false,
      deadline: true,
      eventTime: false,
      venue: false,
      audience: false,
      priority: false
    }
  },
  {
    id: "demo-notice-library",
    rawText: SAMPLE_INPUT_PRESETS[2].text,
    title: "General: MIT Library Timings Updated",
    summary: "Central Library reading rooms open 24/7 for exam preparation. Circulation counter open 9 AM to 8 PM.",
    category: "general",
    priority: "medium",
    status: "upcoming",
    eventDate: addDaysToCurrentDate(2, "09:00"),
    eventTime: "24/7 Open",
    deadline: null,
    venue: "Central Library, MIT Campus",
    audience: "All Enrolled Students",
    suggestedAction: "Collect reading room access pass from library circulation desk",
    isCompleted: false,
    isDismissed: false,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    isDemo: true,
    parsingMode: "rule-based",
    confidenceScore: 92,
    inferredFields: {
      title: false,
      category: false,
      eventDate: false,
      deadline: true,
      eventTime: false,
      venue: false,
      audience: true,
      priority: false
    }
  },
  {
    id: "demo-notice-1",
    rawText: SAMPLE_INPUT_PRESETS[3].text,
    title: "DSA Lab Assignment 3: Graph Algorithms & Dijkstra",
    summary: "Complete and submit Graph Algorithms code & analysis report on Moodle. Strict 20% penalty for late submission.",
    category: "assignment",
    priority: "urgent",
    status: "urgent",
    eventDate: null,
    eventTime: null,
    deadline: addDaysToCurrentDate(2, "23:59"),
    venue: "Online (Moodle Portal)",
    audience: "3rd Year CSE Students",
    suggestedAction: "Upload RollNo_DSA_Assign3.zip on Moodle before 11:59 PM",
    isCompleted: false,
    isDismissed: false,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    isDemo: true,
    parsingMode: "rule-based",
    confidenceScore: 94,
    inferredFields: {
      title: false,
      category: false,
      eventDate: false,
      deadline: false,
      eventTime: true,
      venue: true,
      audience: true,
      priority: false
    }
  },
  {
    id: "demo-notice-2",
    rawText: SAMPLE_INPUT_PRESETS[4].text,
    title: "Mid-Semester Examinations - Fall 2026",
    summary: "Mid-sem examinations commencing with mandatory ID and hall ticket requirements. Mobile devices prohibited.",
    category: "exam",
    priority: "urgent",
    status: "urgent",
    eventDate: addDaysToCurrentDate(3, "10:00"),
    eventTime: "10:00 AM",
    deadline: null,
    venue: "Central Examination Hall & Audi 2",
    audience: "B.Tech 2nd & 3rd Year (All Branches)",
    suggestedAction: "Collect and print Hall Ticket from ERP portal and verify seating plan",
    isCompleted: false,
    isDismissed: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    isDemo: true,
    parsingMode: "rule-based",
    confidenceScore: 92,
    inferredFields: {
      title: false,
      category: false,
      eventDate: false,
      deadline: true,
      eventTime: false,
      venue: false,
      audience: false,
      priority: false
    }
  },
  {
    id: "demo-notice-4-original",
    rawText: `Computer Networks Practical session for 3rd Year CSE Batch B will be held today at 2:00 PM in Lab 204. Lab in-charge: Dr. Verma.`,
    title: "Computer Networks Practical Session",
    summary: "Routine lab session for 3rd Year CSE Batch B in Lab 204.",
    category: "general",
    priority: "medium",
    status: "upcoming",
    eventDate: addDaysToCurrentDate(0, "14:00"),
    eventTime: "02:00 PM",
    deadline: null,
    venue: "Lab 204",
    audience: "3rd Year CSE Batch B",
    suggestedAction: "Reach Lab 204 with lab observation book",
    isCompleted: false,
    isDismissed: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    isDemo: true,
    parsingMode: "rule-based",
    confidenceScore: 90,
    inferredFields: {
      title: false,
      category: true,
      eventDate: false,
      deadline: true,
      eventTime: false,
      venue: false,
      audience: false,
      priority: true
    }
  },
  {
    id: "demo-notice-4-conflict",
    rawText: SAMPLE_INPUT_PRESETS[5].text,
    title: "Networks Lab Relocation Notice",
    summary: "Today's Computer Networks Lab relocated from Lab 204 to Advanced Systems Lab 305 due to switch maintenance.",
    category: "general",
    priority: "urgent",
    status: "urgent",
    eventDate: addDaysToCurrentDate(0, "14:00"),
    eventTime: "02:00 PM",
    deadline: null,
    venue: "Advanced Systems Lab 305",
    audience: "3rd Year CSE Batch B",
    suggestedAction: "Report to Advanced Systems Lab 305 instead of Lab 204",
    isCompleted: false,
    isDismissed: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    isDemo: true,
    parsingMode: "rule-based",
    confidenceScore: 95,
    inferredFields: {
      title: false,
      category: false,
      eventDate: false,
      deadline: true,
      eventTime: false,
      venue: false,
      audience: false,
      priority: false
    }
  },
  {
    id: "demo-notice-5",
    rawText: SAMPLE_INPUT_PRESETS[6].text,
    title: "TCS Campus Recruitment Pre-Placement Talk",
    summary: "Mandatory PPT for TCS Digital/Prime drive in Seminar Hall 1 with formal dress code and 2 printed resumes.",
    category: "placement",
    priority: "high",
    status: "upcoming",
    eventDate: addDaysToCurrentDate(1, "10:30"),
    eventTime: "10:30 AM",
    deadline: null,
    venue: "Seminar Hall 1",
    audience: "Final Year Registered Candidates",
    suggestedAction: "Print 2 copies of resume and arrange formal attire",
    isCompleted: false,
    isDismissed: false,
    createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 16).toISOString(),
    isDemo: true,
    parsingMode: "rule-based",
    confidenceScore: 91,
    inferredFields: {
      title: false,
      category: false,
      eventDate: false,
      deadline: true,
      eventTime: false,
      venue: false,
      audience: false,
      priority: false
    }
  }
];
