import React from 'react';
import { 
  AlertTriangle, 
  Copy, 
  X, 
  ArrowRight, 
  Check, 
  Trash2, 
  Clock, 
  MapPin, 
  Calendar,
  ShieldAlert,
  GitMerge
} from 'lucide-react';
import { CampusNotice, ConflictAlert, DuplicateCandidate } from '../types/index.ts';
import { formatDateTime } from '../utils/dateUtils.ts';

interface ConflictRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflicts: ConflictAlert[];
  duplicates: DuplicateCandidate[];
  onKeepOriginal: (origId: string, conflictingId: string) => void;
  onKeepNewer: (origId: string, conflictingId: string) => void;
  onDismissConflict: (origId: string, conflictingId: string) => void;
}

export const ConflictRadarModal: React.FC<ConflictRadarModalProps> = ({
  isOpen,
  onClose,
  conflicts,
  duplicates,
  onKeepOriginal,
  onKeepNewer,
  onDismissConflict
}) => {
  if (!isOpen) return null;

  const totalIssues = conflicts.length + duplicates.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#160E22] border border-rose-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#8B2EFF]/20 bg-gradient-to-r from-rose-950/50 via-[#1B1024] to-[#100C14]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">Discrepancy & Duplicate Radar</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">
                  {totalIssues} Detected
                </span>
              </div>
              <p className="text-xs text-[#B9ADC9] mt-0.5">
                Side-by-side comparison of conflicting notices and repeated WhatsApp forwards.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#B9ADC9] hover:text-white bg-[#100C14] hover:bg-[#251538] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {totalIssues === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white">No Conflicts or Duplicates Found!</p>
              <p className="text-xs text-slate-500 mt-1">All saved notices are distinct and free of discrepancies.</p>
            </div>
          ) : (
            <>
              {/* Conflicts Section */}
              {conflicts.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Conflicting Information Requiring Review ({conflicts.length})</span>
                  </div>

                  <div className="space-y-4">
                    {conflicts.map((conflict, index) => {
                      const orig = conflict.originalNotice;
                      const newer = conflict.conflictingNotice;

                      return (
                        <div
                          key={index}
                          className="p-4 sm:p-5 rounded-2xl bg-[#090D18] border border-rose-500/30 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                                {conflict.conflictType} Discrepancy
                              </span>
                              <p className="text-xs text-slate-300 mt-1 font-medium">
                                {conflict.description}
                              </p>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Suggestion
                            </span>
                          </div>

                          {/* Side by side cards */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                            
                            {/* Card A: Original Notice */}
                            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                              <div className="flex items-center justify-between text-[11px] text-slate-400">
                                <span className="font-semibold text-slate-300">Original Notice</span>
                                <span>{new Date(orig.createdAt).toLocaleDateString()}</span>
                              </div>
                              <h4 className="text-xs font-bold text-white">{orig.title}</h4>
                              <div className="space-y-1 text-xs text-slate-400">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Venue: <strong className="text-slate-200">{orig.venue || 'Not specified'}</strong></span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Time: <strong className="text-slate-200">{orig.eventTime || 'Not specified'}</strong></span>
                                </div>
                              </div>
                              <div className="pt-2 border-t border-slate-800 flex justify-end">
                                <button
                                  onClick={() => onKeepOriginal(orig.id, newer.id)}
                                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
                                >
                                  Keep Original Notice
                                </button>
                              </div>
                            </div>

                            {/* Card B: Newer Notice */}
                            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-indigo-500/30 space-y-2">
                              <div className="flex items-center justify-between text-[11px] text-indigo-300">
                                <span className="font-semibold text-indigo-300">Newer Notice</span>
                                <span>{new Date(newer.createdAt).toLocaleDateString()}</span>
                              </div>
                              <h4 className="text-xs font-bold text-white">{newer.title}</h4>
                              <div className="space-y-1 text-xs text-slate-400">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                                  <span>Venue: <strong className="text-rose-300">{newer.venue || 'Not specified'}</strong></span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>Time: <strong className="text-indigo-200">{newer.eventTime || 'Not specified'}</strong></span>
                                </div>
                              </div>
                              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                                <button
                                  onClick={() => onDismissConflict(orig.id, newer.id)}
                                  className="text-[11px] text-slate-400 hover:text-slate-200"
                                >
                                  Dismiss Alert
                                </button>
                                <button
                                  onClick={() => onKeepNewer(orig.id, newer.id)}
                                  className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
                                >
                                  Accept & Keep Newer
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Duplicate Detection Suggestions */}
              {duplicates.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <Copy className="w-4 h-4" />
                    <span>Likely Duplicate Forwards ({duplicates.length})</span>
                  </div>

                  <div className="space-y-3">
                    {duplicates.map((dup, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#090D18] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                              {dup.similarityScore}% Match
                            </span>
                            <span className="text-xs font-semibold text-white truncate max-w-xs sm:max-w-md">
                              &ldquo;{dup.noticeA.title}&rdquo; vs &ldquo;{dup.noticeB.title}&rdquo;
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {dup.reason}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => onDismissConflict(dup.noticeA.id, dup.noticeB.id)}
                            className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 bg-slate-800"
                          >
                            Ignore
                          </button>
                          <button
                            onClick={() => onKeepNewer(dup.noticeA.id, dup.noticeB.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white"
                          >
                            Merge / Keep One
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#090D18] flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Never deletes automatically. Student maintains full authority.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white"
          >
            Close Radar
          </button>
        </div>

      </div>
    </div>
  );
};

