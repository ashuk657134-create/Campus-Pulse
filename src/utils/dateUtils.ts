// Utility functions for dates, deadlines, and countdown calculations

export function formatRelativeDate(dateStr: string | null): string {
  if (!dateStr) return 'Not specified';
  
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return dateStr;

  const now = new Date();
  
  // Strip time for day comparison
  const targetDateOnly = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = targetDateOnly.getTime() - nowDateOnly.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

  return target.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: target.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

export function formatDateTime(dateStr: string | null, timeStr?: string | null): string {
  if (!dateStr) return 'Not specified';
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return dateStr;

  const dateFormatted = target.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  if (timeStr) return `${dateFormatted} at ${timeStr}`;
  return dateFormatted;
}

export function getDeadlineCountdown(deadlineStr: string | null): {
  text: string;
  isOverdue: boolean;
  hoursRemaining: number;
  urgencyLevel: 'critical' | 'warning' | 'normal' | 'none';
} {
  if (!deadlineStr) {
    return { text: 'No deadline set', isOverdue: false, hoursRemaining: Infinity, urgencyLevel: 'none' };
  }

  const deadline = new Date(deadlineStr);
  if (isNaN(deadline.getTime())) {
    return { text: 'Invalid deadline', isOverdue: false, hoursRemaining: Infinity, urgencyLevel: 'none' };
  }

  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffMs < 0) {
    const overdueDays = Math.floor(Math.abs(diffHours) / 24);
    const overdueHours = Math.floor(Math.abs(diffHours) % 24);
    const text = overdueDays > 0 ? `Overdue by ${overdueDays}d ${overdueHours}h` : `Overdue by ${overdueHours}h`;
    return { text, isOverdue: true, hoursRemaining: diffHours, urgencyLevel: 'critical' };
  }

  const days = Math.floor(diffHours / 24);
  const hours = Math.floor(diffHours % 24);

  if (diffHours <= 24) {
    return { text: `Due in ${Math.max(1, Math.floor(diffHours))}h`, isOverdue: false, hoursRemaining: diffHours, urgencyLevel: 'critical' };
  } else if (diffHours <= 72) {
    return { text: `Due in ${days}d ${hours}h`, isOverdue: false, hoursRemaining: diffHours, urgencyLevel: 'warning' };
  } else {
    return { text: `Due in ${days} days`, isOverdue: false, hoursRemaining: diffHours, urgencyLevel: 'normal' };
  }
}

export function isDateThisWeek(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return false;

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  endOfWeek.setHours(23, 59, 59, 999);

  return target >= startOfWeek && target <= endOfWeek;
}

export function isDateToday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return false;

  const now = new Date();
  return (
    target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth() &&
    target.getDate() === now.getDate()
  );
}

export function addDaysToCurrentDate(days: number, timeStr: string = '23:59'): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${timeStr}:00`;
}

export function getCurrentDateFormatted(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

