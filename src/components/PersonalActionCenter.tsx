import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  RotateCcw,
  Sparkles,
  Inbox
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CampusNotice, Language } from '../types';
import { getDeadlineCountdown, formatRelativeDate } from '../utils/dateUtils';
import { translations } from '../utils/translations';

interface PersonalActionCenterProps {
  notices: CampusNotice[];
  onToggleComplete: (id: string) => void;
  onSelectNotice: (notice: CampusNotice) => void;
  lang: Language;
}

export const PersonalActionCenter: React.FC<PersonalActionCenterProps> = ({
  notices,
  onToggleComplete,
  onSelectNotice,
  lang
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  const pendingNotices = notices.filter(n => !n.isCompleted && !n.isDismissed);
  const completedNotices = notices.filter(n => n.isCompleted && !n.isDismissed);

  // Trigger celebration confetti on task complete
  const handleCheck = (notice: CampusNotice) => {
    if (!notice.isCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366F1', '#10B981', '#F59E0B', '#38BDF8']
      });
    }
    onToggleComplete(notice.id);
  };

  // Group pending into Overdue, Today, and Upcoming
  const overdueItems = pendingNotices.filter(n => {
    if (!n.deadline) return false;
    return getDeadlineCountdown(n.deadline).isOverdue;
  });

  const dueSoonItems = pendingNotices.filter(n => {
    if (!n.deadline) return false;
    const cd = getDeadlineCountdown(n.deadline);
    return !cd.isOverdue && cd.hoursRemaining <= 72;
  });

  const remainingItems = pendingNotices.filter(n => 
    !overdueItems.includes(n) && !dueSoonItems.includes(n)
  );

  return (
    <div className="space-y-6">
      
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-emerald-400" />
            <span>Personal Action Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Your personal campus command checklist. Check off submissions and exam preps directly.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-[#0F172A] border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pending'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Pending Tasks</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">
              {pendingNotices.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'completed'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Completed</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">
              {completedNotices.length}
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'pending' ? (
        <div className="space-y-6">
          
          {/* Overdue Section if any */}
          {overdueItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Overdue Incomplete Tasks ({overdueItems.length})</span>
              </div>
              <div className="space-y-2.5">
                {overdueItems.map(item => (
                  <ActionItemCard 
                    key={item.id} 
                    notice={item} 
                    onCheck={() => handleCheck(item)} 
                    onSelect={() => onSelectNotice(item)}
                    isUrgentHighlight
                  />
                ))}
              </div>
            </div>
          )}

          {/* Due Soon Section */}
          {dueSoonItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Due in Next 72 Hours ({dueSoonItems.length})</span>
              </div>
              <div className="space-y-2.5">
                {dueSoonItems.map(item => (
                  <ActionItemCard 
                    key={item.id} 
                    notice={item} 
                    onCheck={() => handleCheck(item)} 
                    onSelect={() => onSelectNotice(item)} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Remaining General Tasks */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Upcoming Campus Actions ({remainingItems.length})</span>
            </div>
            {remainingItems.length === 0 && overdueItems.length === 0 && dueSoonItems.length === 0 ? (
              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">No pending tasks remaining!</p>
                <p className="text-xs text-slate-500 mt-1">You are completely up to date with your academic tasks.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {remainingItems.map(item => (
                  <ActionItemCard 
                    key={item.id} 
                    notice={item} 
                    onCheck={() => handleCheck(item)} 
                    onSelect={() => onSelectNotice(item)} 
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Completed Tasks List */
        <div className="space-y-3">
          {completedNotices.length === 0 ? (
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
              <Inbox className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No completed tasks yet</p>
              <p className="text-xs text-slate-500 mt-1">Click the checkbox on any pending notice once you complete it.</p>
            </div>
          ) : (
            completedNotices.map(item => (
              <div
                key={item.id}
                className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-4 flex items-center justify-between gap-3 opacity-80 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleComplete(item.id)}
                    className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center flex-shrink-0"
                    title="Mark as incomplete"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-300 line-through">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Completed action: {item.suggestedAction || 'Done'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onToggleComplete(item.id)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Re-open</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};

interface ActionItemCardProps {
  notice: CampusNotice;
  onCheck: () => void;
  onSelect: () => void;
  isUrgentHighlight?: boolean;
}

const ActionItemCard: React.FC<ActionItemCardProps> = ({
  notice,
  onCheck,
  onSelect,
  isUrgentHighlight
}) => {
  const cd = notice.deadline ? getDeadlineCountdown(notice.deadline) : null;

  return (
    <div className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
      isUrgentHighlight 
        ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50' 
        : 'bg-[#0F172A] border-slate-800 hover:border-slate-700'
    }`}>
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        <button
          onClick={onCheck}
          className="mt-0.5 w-5 h-5 rounded-md border border-slate-600 hover:border-emerald-400 bg-slate-900/50 flex items-center justify-center flex-shrink-0 transition-colors"
          title="Mark completed"
        >
        </button>

        <div className="flex-1 min-w-0 cursor-pointer" onClick={onSelect}>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300">
              {notice.category}
            </span>
            {cd && (
              <span className={`text-[10px] font-semibold px-2 py-0.2 rounded ${
                cd.isOverdue ? 'bg-rose-500/20 text-rose-300 font-bold' : 'bg-amber-500/10 text-amber-300'
              }`}>
                {cd.text}
              </span>
            )}
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-white hover:text-indigo-200 transition-colors">
            {notice.title}
          </h3>

          <div className="mt-1.5 text-xs text-indigo-200 bg-[#0B0F19] border border-indigo-500/20 px-3 py-1.5 rounded-lg flex items-center justify-between">
            <span className="truncate">
              <strong className="text-indigo-400 font-medium">To-Do: </strong>
              {notice.suggestedAction || 'Review notice details'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

