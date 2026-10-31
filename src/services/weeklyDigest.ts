import type { CampusNotice, WeeklyDigest } from '../types/index.ts';
import { isDateThisWeek, getDeadlineCountdown } from '../utils/dateUtils.ts';

export function generateWeeklyDigestLocally(notices: CampusNotice[]): WeeklyDigest {
  const now = new Date();
  
  // Calculate current week range (Monday to Sunday)
  const currentDay = now.getDay();
  const distanceToMonday = (currentDay + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const weekRange = {
    start: monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    end: sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  // 1. Overdue incomplete items
  const overdueTasks = notices.filter(n => {
    if (n.isCompleted || n.isDismissed) return false;
    if (!n.deadline) return false;
    const info = getDeadlineCountdown(n.deadline);
    return info.isOverdue;
  });

  // 2. Urgent notices
  const urgentAlerts = notices.filter(n => 
    !n.isCompleted && !n.isDismissed && (n.priority === 'urgent' || n.status === 'urgent')
  );

  // 3. Top Deadlines this week
  const topDeadlines = notices
    .filter(n => !n.isCompleted && !n.isDismissed && n.deadline && isDateThisWeek(n.deadline))
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

  // 4. Events happening this week
  const eventsThisWeek = notices
    .filter(n => !n.isDismissed && n.eventDate && isDateThisWeek(n.eventDate))
    .sort((a, b) => new Date(a.eventDate!).getTime() - new Date(b.eventDate!).getTime());

  // 5. Items needing clarification (ambiguous date or missing venue for an in-person event)
  const clarificationNeeded = notices.filter(n => 
    !n.isDismissed && (n.hasAmbiguousDate || (n.category === 'exam' && n.venue === 'Not specified'))
  );

  // 6. Action Checklist
  const actionChecklist: WeeklyDigest['actionChecklist'] = [];
  
  // Prioritize overdue items first
  overdueTasks.forEach(n => {
    actionChecklist.push({
      task: n.suggestedAction || `Complete and submit ${n.title}`,
      noticeId: n.id,
      deadline: n.deadline,
      completed: n.isCompleted
    });
  });

  // Next, upcoming deadlines
  topDeadlines.forEach(n => {
    if (!actionChecklist.some(item => item.noticeId === n.id)) {
      actionChecklist.push({
        task: n.suggestedAction || `Prepare for ${n.title}`,
        noticeId: n.id,
        deadline: n.deadline,
        completed: n.isCompleted
      });
    }
  });

  // Add event prep
  eventsThisWeek.forEach(n => {
    if (!actionChecklist.some(item => item.noticeId === n.id)) {
      actionChecklist.push({
        task: n.suggestedAction || `Attend ${n.title} at ${n.venue || 'campus'}`,
        noticeId: n.id,
        deadline: n.eventDate,
        completed: n.isCompleted
      });
    }
  });

  // Synthesize executive summary
  let summary = '';
  if (notices.length === 0) {
    summary = 'No notices saved yet. Paste an announcement to generate your personalized campus intelligence briefing.';
  } else if (overdueTasks.length > 0) {
    summary = `Attention needed: You have ${overdueTasks.length} overdue task(s) and ${topDeadlines.length} critical deadline(s) arriving this week. Focus on pending submissions before attending campus sessions.`;
  } else if (topDeadlines.length > 0 || eventsThisWeek.length > 0) {
    summary = `You have ${topDeadlines.length} deadline(s) and ${eventsThisWeek.length} campus event(s) scheduled for this week. Priority is high on ${topDeadlines[0]?.title || 'upcoming deadlines'}.`;
  } else {
    summary = `Your week looks calm! No urgent deadlines are recorded for this week. Keep up the good work or check upcoming notices.`;
  }

  return {
    generatedAt: new Date().toISOString(),
    weekRange,
    summary,
    topDeadlines,
    eventsThisWeek,
    urgentAlerts,
    overdueTasks,
    actionChecklist,
    clarificationNeeded
  };
}

export async function generateWeeklyDigestWithAI(notices: CampusNotice[], apiKey: string): Promise<WeeklyDigest> {
  const base = generateWeeklyDigestLocally(notices);
  
  if (notices.length === 0) return base;

  try {
    const summaryPrompt = `You are Campus Pulse AI. Summarize the student's week in 2 punchy, motivating sentences based on these notices:
${notices.map(n => `- [${n.category.toUpperCase()}] ${n.title} (Deadline: ${n.deadline || 'None'}, EventDate: ${n.eventDate || 'None'}, Priority: ${n.priority})`).join('\n')}
Return ONLY a JSON object: {"summary": "2 sentence executive summary"}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: summaryPrompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
      })
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const parsed = JSON.parse(text);
        if (parsed.summary) {
          base.summary = parsed.summary;
        }
      }
    }
  } catch (err) {
    // Fail gracefully back to local deterministic summary
    console.warn('AI digest generation failed, using rule-based summary:', err);
  }

  return base;
}
