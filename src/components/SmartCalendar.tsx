import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  AlertCircle, 
  HelpCircle,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { CampusNotice, Language } from '../types';
import { translations } from '../utils/translations';

interface SmartCalendarProps {
  notices: CampusNotice[];
  onSelectNotice: (notice: CampusNotice) => void;
  lang: Language;
}

export const SmartCalendar: React.FC<SmartCalendarProps> = ({
  notices,
  onSelectNotice,
  lang
}) => {
  const t = translations[lang];

  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Separate dated vs undated items
  const datedNotices = notices.filter(n => !n.isDismissed && (n.deadline || n.eventDate));
  const undatedNotices = notices.filter(n => !n.isDismissed && !n.deadline && !n.eventDate);

  // Build calendar matrix
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const daysArray: { day: number; isCurrentMonth: boolean; dateStr: string }[] = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const prevM = month === 0 ? 12 : month;
    const prevY = month === 0 ? year - 1 : year;
    const dateStr = `${prevY}-${String(prevM).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    daysArray.push({ day: d, isCurrentMonth: false, dateStr });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    daysArray.push({ day: d, isCurrentMonth: true, dateStr });
  }

  // Next month leading days to complete the 35 or 42 grid
  const remaining = (7 - (daysArray.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const nextM = month === 11 ? 1 : month + 2;
    const nextY = month === 11 ? year + 1 : year;
    const dateStr = `${nextY}-${String(nextM).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    daysArray.push({ day: d, isCurrentMonth: false, dateStr });
  }

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to get items on a date
  const getNoticesForDate = (dateStr: string) => {
    return datedNotices.filter(n => {
      const dDate = n.deadline ? n.deadline.split('T')[0] : null;
      const eDate = n.eventDate ? n.eventDate.split('T')[0] : null;
      return dDate === dateStr || eDate === dateStr;
    });
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'assignment':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30';
      case 'exam':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30';
      case 'event':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30';
      case 'placement':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30';
      default:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-400" />
            <span>Smart Campus Calendar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize submissions and events strictly on verified dates. Never invented.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#0F172A] border border-slate-800 rounded-xl p-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-white px-3 min-w-[130px] text-center">
              {monthName}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            Today
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs bg-[#0F172A]/70 border border-slate-800/80 p-3 rounded-xl">
        <span className="text-slate-400 font-medium">Categories:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span className="text-slate-300">Assignments</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
          <span className="text-slate-300">Exams</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
          <span className="text-slate-300">Campus Events</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="text-slate-300">Placements</span>
        </div>
      </div>

      {/* Grid Layout: Calendar on Left, Undated Notices on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Monthly Calendar Grid (3 cols) */}
        <div className="lg:col-span-3 bg-[#0F172A] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl overflow-hidden">
          
          {/* Day Names Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2 py-1 border-b border-slate-800">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {daysArray.map((cell, index) => {
              const dayNotices = getNoticesForDate(cell.dateStr);
              const isToday = cell.dateStr === todayStr;

              return (
                <div
                  key={index}
                  className={`min-h-[85px] sm:min-h-[105px] p-1.5 rounded-xl border flex flex-col justify-between transition-colors ${
                    isToday
                      ? 'border-indigo-500 bg-indigo-950/20'
                      : cell.isCurrentMonth
                      ? 'border-slate-800/80 bg-[#0B0F19]'
                      : 'border-slate-900 bg-[#070A12] opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-semibold ${
                      isToday
                        ? 'w-5 h-5 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold'
                        : cell.isCurrentMonth
                        ? 'text-slate-200'
                        : 'text-slate-500'
                    }`}>
                      {cell.day}
                    </span>
                    {dayNotices.length > 0 && (
                      <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                        {dayNotices.length}
                      </span>
                    )}
                  </div>

                  {/* Notice Pills for this date */}
                  <div className="space-y-1 mt-1 overflow-y-auto max-h-[60px] sm:max-h-[75px] scrollbar-none">
                    {dayNotices.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => onSelectNotice(n)}
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded border truncate cursor-pointer transition-transform hover:scale-[1.02] ${getCategoryColor(
                          n.category
                        )}`}
                        title={`${n.title} (${n.category})`}
                      >
                        {n.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Dedicated Sidebar for Undated Campus Notices */}
        <div className="space-y-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Undated Announcements</span>
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {undatedNotices.length}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-3">
              Notices with no explicit date mentioned in the announcement are kept here so they don&apos;t clutter or falsify the calendar.
            </p>

            {undatedNotices.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                All saved notices have verified event or deadline dates!
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                {undatedNotices.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => onSelectNotice(n)}
                    className="p-3 rounded-xl bg-[#0B0F19] hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300">
                        {n.category}
                      </span>
                      <span className="text-[10px] text-slate-500">Date not stated</span>
                    </div>
                    <div className="text-xs font-semibold text-white line-clamp-1">{n.title}</div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{n.summary}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

