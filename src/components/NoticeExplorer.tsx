import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Clock, 
  Calendar, 
  MapPin, 
  Users, 
  Trash2, 
  Edit3, 
  Eye, 
  Check, 
  X,
  HelpCircle,
  Inbox,
  Filter,
  Sparkles
} from 'lucide-react';
import { CampusNotice, NoticeCategory, NoticePriority, Language } from '../types/index.ts';
import { formatRelativeDate, getDeadlineCountdown, formatDateTime } from '../utils/dateUtils.ts';
import { translations } from '../utils/translations.ts';

interface NoticeExplorerProps {
  notices: CampusNotice[];
  onSelectNotice: (notice: CampusNotice) => void;
  onEditNotice: (notice: CampusNotice) => void;
  onDeleteNotice: (id: string) => void;
  onToggleComplete: (id: string) => void;
  lang: Language;
}

type FilterType = 
  | 'all' 
  | 'assignment' 
  | 'exam' 
  | 'event' 
  | 'deadline' 
  | 'general' 
  | 'urgent' 
  | 'upcoming' 
  | 'completed' 
  | 'expired'
  | 'needs_clarification';

type SortOption = 'date_asc' | 'date_desc' | 'priority' | 'recently_added';
type DateFilter = 'all' | 'today' | 'this_week' | 'later';

export const NoticeExplorer: React.FC<NoticeExplorerProps> = ({
  notices,
  onSelectNotice,
  onEditNotice,
  onDeleteNotice,
  onToggleComplete,
  lang
}) => {
  const t = translations[lang];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recently_added');

  const filterPills: { id: FilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All Notices', count: notices.length },
    { id: 'urgent', label: 'Urgent', count: notices.filter(n => !n.isCompleted && (n.priority === 'urgent' || n.status === 'urgent')).length },
    { id: 'upcoming', label: 'Upcoming', count: notices.filter(n => !n.isCompleted && n.status === 'upcoming').length },
    { id: 'assignment', label: 'Assignments', count: notices.filter(n => n.category === 'assignment').length },
    { id: 'exam', label: 'Exams', count: notices.filter(n => n.category === 'exam').length },
    { id: 'event', label: 'Events', count: notices.filter(n => n.category === 'event').length },
    { id: 'deadline', label: 'Deadlines', count: notices.filter(n => n.category === 'deadline' || !!n.deadline).length },
    { id: 'general', label: 'General', count: notices.filter(n => n.category === 'general' || n.category === 'administrative' || n.category === 'holiday').length },
    { id: 'completed', label: 'Completed', count: notices.filter(n => n.isCompleted).length },
    { id: 'expired', label: 'Expired / Overdue', count: notices.filter(n => {
      if (!n.deadline) return false;
      return getDeadlineCountdown(n.deadline).isOverdue;
    }).length },
    { id: 'needs_clarification', label: 'Needs Clarification', count: notices.filter(n => n.hasAmbiguousDate && !n.dateConfirmed).length }
  ];

  const filteredNotices = useMemo(() => {
    return notices.filter(notice => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = notice.title.toLowerCase().includes(q);
        const matchesSummary = notice.summary.toLowerCase().includes(q);
        const matchesRaw = notice.rawText.toLowerCase().includes(q);
        const matchesVenue = notice.venue?.toLowerCase().includes(q) || false;
        const matchesAudience = notice.audience?.toLowerCase().includes(q) || false;
        if (!matchesTitle && !matchesSummary && !matchesRaw && !matchesVenue && !matchesAudience) {
          return false;
        }
      }

      if (activeFilter === 'urgent') {
        if (notice.isCompleted || (notice.priority !== 'urgent' && notice.status !== 'urgent')) return false;
      } else if (activeFilter === 'upcoming') {
        if (notice.isCompleted || notice.status !== 'upcoming') return false;
      } else if (activeFilter === 'completed') {
        if (!notice.isCompleted) return false;
      } else if (activeFilter === 'expired') {
        if (!notice.deadline) return false;
        if (!getDeadlineCountdown(notice.deadline).isOverdue) return false;
      } else if (activeFilter === 'needs_clarification') {
        if (!notice.hasAmbiguousDate || notice.dateConfirmed) return false;
      } else if (activeFilter === 'assignment' || activeFilter === 'exam' || activeFilter === 'event' || activeFilter === 'general') {
        if (notice.category !== activeFilter) return false;
      } else if (activeFilter === 'deadline') {
        if (notice.category !== 'deadline' && !notice.deadline) return false;
      }

      if (dateFilter !== 'all') {
        const targetDateStr = notice.deadline || notice.eventDate;
        if (!targetDateStr) return false;
        const target = new Date(targetDateStr);
        const now = new Date();

        if (dateFilter === 'today') {
          const isToday = 
            target.getDate() === now.getDate() &&
            target.getMonth() === now.getMonth() &&
            target.getFullYear() === now.getFullYear();
          if (!isToday) return false;
        } else if (dateFilter === 'this_week') {
          const start = new Date(now);
          start.setDate(now.getDate() - now.getDay());
          const end = new Date(start);
          end.setDate(start.getDate() + 7);
          if (target < start || target > end) return false;
        } else if (dateFilter === 'later') {
          const nextWeek = new Date(now);
          nextWeek.setDate(now.getDate() + 7);
          if (target <= nextWeek) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'recently_added') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'priority') {
        const prioRank = { urgent: 4, high: 3, medium: 2, low: 1 };
        return prioRank[b.priority] - prioRank[a.priority];
      } else if (sortBy === 'date_asc') {
        const timeA = a.deadline ? new Date(a.deadline).getTime() : a.eventDate ? new Date(a.eventDate).getTime() : Infinity;
        const timeB = b.deadline ? new Date(b.deadline).getTime() : b.eventDate ? new Date(b.eventDate).getTime() : Infinity;
        return timeA - timeB;
      } else if (sortBy === 'date_desc') {
        const timeA = a.deadline ? new Date(a.deadline).getTime() : a.eventDate ? new Date(a.eventDate).getTime() : 0;
        const timeB = b.deadline ? new Date(b.deadline).getTime() : b.eventDate ? new Date(b.eventDate).getTime() : 0;
        return timeB - timeA;
      }
      return 0;
    });
  }, [notices, searchQuery, activeFilter, dateFilter, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Notice Explorer</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#1C102A] text-[#B44CFF] border border-[#8B2EFF]/30">
              {filteredNotices.length} of {notices.length}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#B9ADC9] mt-0.5">
            Filter, search, organize and take action on all saved college circulars and announcements.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#B9ADC9] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-[#160E22] border border-[#8B2EFF]/25 focus:border-[#FF38B8] rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-white placeholder-[#B9ADC9]/60 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#B9ADC9] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterPills.map((pill) => (
          <button
            key={pill.id}
            onClick={() => setActiveFilter(pill.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === pill.id
                ? 'bg-gradient-to-r from-[#8B2EFF] to-[#FF38B8] text-white shadow-lg shadow-[#8B2EFF]/30'
                : 'bg-[#1C102A]/80 border border-[#8B2EFF]/25 text-[#B9ADC9] hover:text-white hover:bg-[#251538]'
            }`}
          >
            <span>{pill.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeFilter === pill.id ? 'bg-white/20 text-white' : 'bg-[#100C14] text-[#B9ADC9]'
            }`}>
              {pill.count}
            </span>
          </button>
        ))}
      </div>

      {/* Secondary Controls: Date Scope & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1C102A]/70 border border-[#8B2EFF]/25 p-3 rounded-2xl text-xs backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="text-[#B9ADC9] font-medium mr-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#FF8A24]" />
            Date Range:
          </span>
          {(['all', 'today', 'this_week', 'later'] as DateFilter[]).map((df) => (
            <button
              key={df}
              onClick={() => setDateFilter(df)}
              className={`px-2.5 py-1 rounded-xl text-xs capitalize transition-colors ${
                dateFilter === df
                  ? 'bg-gradient-to-r from-[#8B2EFF] to-[#FF38B8] text-white font-bold'
                  : 'text-[#B9ADC9] hover:text-white'
              }`}
            >
              {df.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#B44CFF]" />
          <span className="text-[#B9ADC9]">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-[#100C14] border border-[#8B2EFF]/30 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none"
          >
            <option value="recently_added">Recently Ingested</option>
            <option value="priority">Urgency / Priority</option>
            <option value="date_asc">Earliest Deadline / Event</option>
            <option value="date_desc">Latest Deadline / Event</option>
          </select>
        </div>
      </div>

      {/* Notices Feed */}
      {filteredNotices.length === 0 ? (
        <div className="bg-[#1C102A]/80 border border-[#8B2EFF]/25 rounded-3xl p-10 text-center">
          <Inbox className="w-12 h-12 text-[#B9ADC9]/40 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No notices match your current filters</h3>
          <p className="text-xs text-[#B9ADC9] mt-1 max-w-sm mx-auto">
            Try adjusting search terms, clearing filters, or adding a new circular.
          </p>
          {(searchQuery || activeFilter !== 'all' || dateFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
                setDateFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-[#8B2EFF]/25 hover:bg-[#8B2EFF]/40 text-[#B44CFF] hover:text-white border border-[#8B2EFF]/30"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredNotices.map((notice) => {
            const deadlineInfo = notice.deadline ? getDeadlineCountdown(notice.deadline) : null;
            const isOverdue = deadlineInfo?.isOverdue;

            return (
              <div
                key={notice.id}
                className={`group p-4 sm:p-5 rounded-3xl border transition-all duration-300 shadow-xl relative ${
                  notice.isCompleted
                    ? 'bg-[#150E1F]/50 border-[#8B2EFF]/15 opacity-75'
                    : notice.priority === 'urgent'
                    ? 'bg-gradient-to-r from-[#241026]/90 to-[#170E22]/95 border-[#FF38B8]/40 hover:border-[#FF38B8]'
                    : 'bg-[#1C102A]/80 hover:bg-[#251538]/90 border-[#8B2EFF]/25 hover:border-[#8B2EFF]/50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  
                  {/* Left: Checkbox + Content */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => onToggleComplete(notice.id)}
                      className={`mt-1 flex-shrink-0 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        notice.isCompleted
                          ? 'bg-[#22D3A6] border-[#22D3A6] text-[#100C14]'
                          : 'border-[#8B2EFF]/40 hover:border-[#FF38B8] bg-[#100C14]'
                      }`}
                      title={notice.isCompleted ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {notice.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#8B2EFF]/20 text-[#B44CFF] border border-[#8B2EFF]/30">
                          {notice.category}
                        </span>

                        {notice.priority === 'urgent' && (
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                            Urgent
                          </span>
                        )}

                        {notice.hasAmbiguousDate && !notice.dateConfirmed && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FF8A24]/20 text-[#FF8A24] border border-[#FF8A24]/30 flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" />
                            Confirm Date
                          </span>
                        )}

                        {notice.isDemo && (
                          <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-[#100C14] text-[#B9ADC9] border border-[#8B2EFF]/20">
                            Demo Circular
                          </span>
                        )}

                        <span className="text-[10px] text-[#B9ADC9]/60 ml-auto hidden sm:inline">
                          Added {formatRelativeDate(notice.createdAt)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 
                        onClick={() => onSelectNotice(notice)}
                        className={`text-sm sm:text-base font-bold cursor-pointer transition-colors ${
                          notice.isCompleted
                            ? 'line-through text-[#B9ADC9]/60'
                            : 'text-white group-hover:text-[#FFC857]'
                        }`}
                      >
                        {notice.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs text-[#B9ADC9] mt-1 line-clamp-2 leading-relaxed">
                        {notice.summary}
                      </p>

                      {/* Metadata Chips */}
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#B9ADC9]">
                        {notice.deadline && (
                          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl ${
                            isOverdue 
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/35 font-bold' 
                              : 'bg-[#FF8A24]/15 text-[#FF8A24] border border-[#FF8A24]/30'
                          }`}>
                            <Clock className="w-3.5 h-3.5" />
                            <span>Deadline: {deadlineInfo?.text}</span>
                          </span>
                        )}

                        {notice.eventDate && (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#8B2EFF]/15 text-[#B44CFF] border border-[#8B2EFF]/30">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDateTime(notice.eventDate, notice.eventTime)}</span>
                          </span>
                        )}

                        {notice.venue && (
                          <span className="flex items-center gap-1 text-[#B9ADC9]">
                            <MapPin className="w-3.5 h-3.5 text-[#22D3A6]" />
                            <span>{notice.venue}</span>
                          </span>
                        )}

                        {notice.audience && (
                          <span className="flex items-center gap-1 text-[#B9ADC9]">
                            <Users className="w-3.5 h-3.5 text-[#FF38B8]" />
                            <span>{notice.audience}</span>
                          </span>
                        )}
                      </div>

                      {/* Suggested Next Action */}
                      {notice.suggestedAction && (
                        <div className="mt-3 py-2 px-3 rounded-xl bg-[#100C14] border border-[#8B2EFF]/25 text-xs text-[#F8F5FF] flex items-center justify-between">
                          <span className="truncate">
                            <strong className="text-[#FF8A24] font-bold">Action: </strong>
                            {notice.suggestedAction}
                          </span>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => onSelectNotice(notice)}
                      className="p-2 rounded-xl text-[#B9ADC9] hover:text-white hover:bg-[#251538]"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditNotice(notice)}
                      className="p-2 rounded-xl text-[#B9ADC9] hover:text-[#B44CFF] hover:bg-[#251538]"
                      title="Edit Notice"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteNotice(notice.id)}
                      className="p-2 rounded-xl text-[#B9ADC9] hover:text-rose-400 hover:bg-[#251538]"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
