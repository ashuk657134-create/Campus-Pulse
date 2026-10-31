# ⚡ CAMPUS PULSE AI
> **"Your College Life. One Intelligent Dashboard."**

Transform chaotic, unstructured college announcements from WhatsApp groups, circular emails, and notice boards into organized, searchable, and actionable campus intelligence.

Built for the 3-hour Hackathon challenge — optimized for student productivity, zero hallucination, and privacy-first local operation.

---

## 🌟 The Problem
College students receive announcements scattered across WhatsApp groups, email circulars, corridor posters, and faculty notices. As a result:
- Crucial assignment and scholarship deadlines are missed.
- Students show up to the wrong lecture rooms due to last-minute relocations.
- Repeated forward messages cause clutter and confusion.
- There is no single intelligent source of truth for upcoming campus life.

---

## 🚀 Key Features

### 1. 📊 Executive Campus Dashboard
- **Dynamic Welcome & Metrics**: Tailored greeting, real-time date counter, and live counters for urgent notices, upcoming deadlines, today's schedule, and total saved announcements.
- **Priority & Deadline Radar**: Displays urgent notices and upcoming deadlines with countdown timers (e.g. `Due in 14h`, `Due in 2 days`, or `Overdue by 1d`).
- **Actionable Today Section**: Automatically isolates events happening today and assignments due tonight so students never miss a class or submission.
- **Recently Added Feed**: Rapid chronological review of newly ingested notices.

### 2. 🧠 Smart Notice Input & Intelligent Parser
- **Messy Notice Ingestion**: Paste unformatted WhatsApp forwarded messages, official circulars, or Hinglish notices.
- **Dual-Engine Processing Pipeline**:
  - **Deterministic Rule-Based Parser (Default)**: Advanced regex heuristics for dates, deadlines, 12h/24h times, venues (labs, auditoriums, seminar halls), audiences, and urgency keywords. Completely offline-capable with zero hallucinations.
  - **AI Mode (Optional)**: Connect a Gemini API key in Settings for structured LLM parsing with strict schema validation.
- **Zero Hallucination Guarantee**: Missing fields are explicitly marked as `"Not specified"` — dates and venues are never fabricated.
- **Ambiguous Date Guard**: If a date like `05/06/2026` is detected, it flags `Needs Clarification` and prompts the student to confirm before filing.
- **Editable Intelligence Preview**: Students can review and fine-tune extracted title, category, priority, dates, venue, audience, and suggested actions before confirming.
- **Realistic 1-Click Sample Notice Presets**: Quick buttons for DSA Lab Assignment, Mid-Sem Exam Circular, HackCampus Poster, Lab Venue Shift, Hinglish Placement Notice, and Diwali Break Circular.

### 3. 🔍 Notice Explorer
- **Comprehensive Filtering**: Filter by category (*Assignments*, *Exams*, *Events*, *Deadlines*, *General*), status (*Urgent*, *Upcoming*, *Completed*, *Expired*), or date range (*Today*, *This Week*, *Later*).
- **Search Engine**: Real-time search across titles, summaries, raw text, venues, and target audiences.
- **Multi-criteria Sorting**: Sort by recently added, priority ranking, or earliest/latest deadline.
- **Full Action Controls**: Quick completion toggle, edit modal, detailed inspector, and delete options.

### 4. 📅 Smart Campus Calendar
- **Interactive Monthly Grid**: View all academic commitments mapped strictly to verified dates.
- **Visual Categorization**: Color-coded badges distinguishing Assignments (Amber), Exams (Rose), Events (Purple), and Placements (Emerald).
- **Dedicated Undated Notices Panel**: Announcements with no verified dates are safely housed in a separate drawer so the calendar is never polluted with invented dates.

### 5. ✨ Weekly Pulse AI (Signature Feature)
- **"What do I need to know this week?"**: A single click compiles a comprehensive weekly intelligence briefing:
  - **Executive Summary**: Highlights key priorities for the week.
  - **Critical Deadlines**: Ranked upcoming submissions.
  - **Events This Week**: Campus sessions and exams scheduled for the current week.
  - **Overdue Alerts**: Highlights incomplete assignments past their deadlines.
  - **Action Checklist**: A step-by-step checklist of concrete next actions.
- **Export Capabilities**: Download the briefing as Markdown or copy formatted summary to clipboard with 1 click.

### 6. 🛡️ Discrepancy & Duplicate Radar
- **Venue & Schedule Conflict Detection**: Automatically identifies conflicting announcements sharing the same course or subject (e.g. *Networks Lab relocated from Lab 204 to Lab 305*).
- **Side-by-Side Review**: Compare original and newer announcements side-by-side. The student decides whether to keep original, accept newer, or dismiss.
- **Duplicate Detection**: Computes textual similarity scores to flag forwarded duplicate messages.

### 7. ✅ Personal Action Center
- **Focused Execution**: A distraction-free task list showing pending actions, countdowns, and quick completion checkboxes with celebratory confetti.
- **Completed Archive**: Review and re-open completed tasks anytime.

### 8. 🔒 Client-Side Persistence & Privacy
- **100% Local**: All notices, preferences, and theme states are stored in browser `localStorage`.
- **Zero Cloud Leakage**: No server backend required.
- **Export & Import**: Full JSON backup and restore capabilities.
- **Demo Reset**: 1-click restore to sample data with safety confirmation.

### 9. 🎨 Modern Productivity Aesthetic
- **Midnight Navy Theme**: Deep navy/slate palette (`#080C16`) with subtle indigo gradients, glass cards, and crisp contrast.
- **English / Hindi Interface Toggle**: 1-click switch between English and Hindi dashboard terminology.
- **Quick Command Palette (`Ctrl + K` / `Cmd + K`)**: Power-user keyboard navigation.

---

## 🛠️ Tech Stack
- **Framework**: React 18 with TypeScript
- **Bundler & Dev Server**: Vite 5
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Micro-interactions**: Canvas Confetti
- **Storage**: Browser LocalStorage

---

## 🏁 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Running the Application

1. **Clone or open the project directory**:
   ```bash
   cd "campus pulse"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Production Build & Preview**:
   ```bash
   npm run build
   npm run preview
   ```

---

## 🧪 Verification & Automated Testing
Campus Pulse AI includes a standalone test suite verifying parsing, conflict detection, countdown calculations, and weekly digest compilation:
```bash
node --experimental-strip-types test/verify.ts
```
Expected output: **25 passed, 0 failed**.

---

## ⚙️ AI Configuration & Limitations
- **Offline / Default Mode**: The application runs completely without an API key using the deterministic local parser.
- **Gemini API Mode (Optional)**: Click the **Settings (gear icon)** in the navbar to enter a Google Gemini API key (`AIzaSy...`). The key is stored strictly in your browser's `localStorage` and sent directly to Google's official Gemini endpoint.
- **Device Synchronization**: Because data is stored in browser `localStorage`, notices do not automatically sync across different browsers or devices unless exported/imported via JSON.

---

## 👥 Hackathon Submission Checklist
- [x] Full working responsive web application
- [x] Tested notice ingestion pipeline with realistic samples
- [x] Rule-based deterministic fallback for Hinglish and English college formats
- [x] Editable preview card with field validation
- [x] Executive dashboard with Priority & Deadline radar
- [x] "What do I need to know this week?" Weekly Pulse AI briefing
- [x] Smart calendar with separate undated notice handling
- [x] Conflict & duplicate detector with side-by-side comparison
- [x] Personal action center with task completion
- [x] LocalStorage persistence with JSON export/import and demo reset
- [x] Clean, dark-mode midnight productivity aesthetic
- [x] Automated test suite passing 25/25 checks

