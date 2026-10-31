import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Share2, 
  Check, 
  FileText,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { CampusNotice } from '../types/index.ts';
import { formatDateTime, getDeadlineCountdown, formatRelativeDate } from '../utils/dateUtils.ts';

interface NoticeDetailModalProps {
  notice: CampusNotice | null;
  onClose: () => void;
  onEdit: (notice: CampusNotice) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({
  notice,
  onClose,
  onEdit,
  onDelete,
  onToggleComplete
}) => {
  if (!notice) return null;

  const deadlineInfo = notice.deadline ? getDeadlineCountdown(notice.deadline) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#160E22] border border-[#8B2EFF]/35 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-[#8B2EFF]/20 bg-[#100C14]">
          <div className="space-y-1.5 flex-1 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#8B2EFF]/20 text-[#B44CFF] border border-[#8B2EFF]/30">
                {notice.category}
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                notice.priority === 'urgent' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                  : 'bg-[#251538] text-[#B9ADC9]'
              }`}>
                {notice.priority.toUpperCase()} PRIORITY
              </span>
              {notice.isDemo && (
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#100C14] text-[#B9ADC9] border border-[#8B2EFF]/20">
                  Demo Notice
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
              {notice.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#B9ADC9] hover:text-white bg-[#100C14] hover:bg-[#251538] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Executive Summary */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
              Concise Summary
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {notice.summary}
            </p>
          </div>

          {/* Action Callout */}
          {notice.suggestedAction && (
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Recommended Student Action
                </span>
                <p className="text-xs font-semibold text-white mt-0.5">
                  {notice.suggestedAction}
                </p>
              </div>
              <button
                onClick={() => onToggleComplete(notice.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  notice.isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{notice.isCompleted ? 'Completed' : 'Mark Done'}</span>
              </button>
            </div>
          )}

          {/* Extracted Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            {/* Event Date vs Deadline */}
            <div className="p-3 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Event Occurrence Date
              </span>
              <p className="text-xs font-medium text-white">
                {notice.eventDate ? formatDateTime(notice.eventDate, notice.eventTime) : 'Not specified'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                Submission Deadline
              </span>
              <p className="text-xs font-medium text-white">
                {notice.deadline ? formatDateTime(notice.deadline) : 'No submission deadline'}
              </p>
              {deadlineInfo && (
                <span className={`inline-block text-[10px] font-semibold mt-1 ${
                  deadlineInfo.isOverdue ? 'text-rose-400' : 'text-amber-300'
                }`}>
                  ({deadlineInfo.text})
                </span>
              )}
            </div>

            {/* Venue & Location */}
            <div className="p-3 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Venue / Room
              </span>
              <p className="text-xs font-medium text-white">
                {notice.venue || 'Not specified'}
              </p>
            </div>

            {/* Target Audience */}
            <div className="p-3 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                Audience / Cohort
              </span>
              <p className="text-xs font-medium text-white">
                {notice.audience || 'All campus students'}
              </p>
            </div>

          </div>

          {/* Original Messy Text Inspector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                Original Announcement Text
              </span>
              <span className="font-mono text-[10px] text-slate-500">
                Confidence: {notice.confidenceScore}% • {notice.parsingMode}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#070A12] border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {notice.rawText}
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-800 bg-[#0B0F19] flex items-center justify-between">
          <button
            onClick={() => {
              onDelete(notice.id);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Notice</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(notice);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

