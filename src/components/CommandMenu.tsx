import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  PlusCircle, 
  LayoutDashboard, 
  ListFilter, 
  Calendar, 
  CheckSquare, 
  AlertTriangle, 
  RotateCcw, 
  X,
  ArrowRight
} from 'lucide-react';
import { ViewTab, CampusNotice } from '../types/index.ts';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ViewTab) => void;
  onOpenAddModal: () => void;
  onOpenWeeklyDigest: () => void;
  onOpenConflictRadar: () => void;
  onResetDemo: () => void;
  notices: CampusNotice[];
  onSelectNotice: (notice: CampusNotice) => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenAddModal,
  onOpenWeeklyDigest,
  onOpenConflictRadar,
  onResetDemo,
  notices,
  onSelectNotice
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedNotices = query.trim() 
    ? notices.filter(n => n.title.toLowerCase().includes(query.toLowerCase()) || n.summary.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#160E22] border border-[#8B2EFF]/35 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Search Input */}
        <div className="relative border-b border-[#8B2EFF]/20 p-3 sm:p-4 bg-[#100C14]">
          <Search className="w-5 h-5 text-[#B44CFF] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search notices..."
            className="w-full bg-transparent pl-8 pr-8 text-sm text-white placeholder-[#B9ADC9]/60 outline-none"
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B9ADC9] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="p-3 max-h-80 overflow-y-auto space-y-1 text-xs">
          
          {/* Matched notices if searching */}
          {matchedNotices.length > 0 && (
            <div className="mb-3 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2">
                Matching Notices
              </span>
              {matchedNotices.map(notice => (
                <button
                  key={notice.id}
                  onClick={() => {
                    onSelectNotice(notice);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <div className="truncate pr-2">
                    <span className="font-semibold text-white">{notice.title}</span>
                    <span className="text-[11px] text-slate-400 block truncate">{notice.summary}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 text-indigo-300">
                    {notice.category}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Core Actions */}
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2">
            Instant Actions
          </span>

          <button
            onClick={() => {
              onOpenWeeklyDigest();
              onClose();
            }}
            className="w-full flex items-center justify-between p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="font-medium">What do I need to know this week? (Weekly Pulse AI)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            onClick={() => {
              onOpenAddModal();
              onClose();
            }}
            className="w-full flex items-center justify-between p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span className="font-medium">Paste & Analyze New Notice</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Add</span>
          </button>

          <button
            onClick={() => {
              onOpenConflictRadar();
              onClose();
            }}
            className="w-full flex items-center justify-between p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span className="font-medium">Open Discrepancy & Duplicate Radar</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Radar</span>
          </button>

          {/* Navigation */}
          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2">
              Navigation
            </span>
            <button
              onClick={() => {
                onNavigate('dashboard');
                onClose();
              }}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              <span>Go to Dashboard</span>
            </button>
            <button
              onClick={() => {
                onNavigate('notices');
                onClose();
              }}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ListFilter className="w-4 h-4 text-indigo-400" />
              <span>Go to Notice Explorer</span>
            </button>
            <button
              onClick={() => {
                onNavigate('calendar');
                onClose();
              }}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Go to Smart Calendar</span>
            </button>
            <button
              onClick={() => {
                onNavigate('actions');
                onClose();
              }}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>Go to Personal Action Center</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onResetDemo();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Reset Preloaded Demo Data</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-slate-800 bg-[#0B0F19] flex items-center justify-between text-[10px] text-slate-500 px-4">
          <span>Use &uarr; &darr; to navigate, Esc to close</span>
          <span className="font-mono">Campus Pulse AI</span>
        </div>

      </div>
    </div>
  );
};

