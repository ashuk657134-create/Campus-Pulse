import React from 'react';
import { Bell, ArrowRight, Clock, MapPin, CheckCircle2, ChevronRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CampusNotice } from '../types/index.ts';
import { formatRelativeDate, getDeadlineCountdown } from '../utils/dateUtils.ts';

interface NoticePanelProps {
  notices: CampusNotice[];
  onViewAll: () => void;
  onSelectNotice: (notice: CampusNotice) => void;
  onOpenAddModal: () => void;
}

export const NoticePanel: React.FC<NoticePanelProps> = ({
  notices,
  onViewAll,
  onSelectNotice,
  onOpenAddModal
}) => {
  // Sort notices: Urgent first, then newest
  const displayNotices = [...notices]
    .sort((a, b) => {
      if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
      if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 4);

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'assignment':
        return 'bg-[#FF8A24]/15 text-[#FF8A24] border-[#FF8A24]/30';
      case 'exam':
        return 'bg-[#FF38B8]/15 text-[#FF38B8] border-[#FF38B8]/30';
      case 'event':
        return 'bg-[#B44CFF]/15 text-[#B44CFF] border-[#B44CFF]/30';
      case 'administrative':
        return 'bg-[#FFC857]/15 text-[#FFC857] border-[#FFC857]/30';
      case 'placement':
        return 'bg-[#22D3A6]/15 text-[#22D3A6] border-[#22D3A6]/30';
      default:
        return 'bg-[#8B2EFF]/15 text-[#B9ADC9] border-[#8B2EFF]/30';
    }
  };

  return (
    <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-[#1C102A]/90 to-[#100C14]/95 border border-[#8B2EFF]/30 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#8B2EFF]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B2EFF] to-[#FF38B8] p-0.5 shadow-md shadow-[#8B2EFF]/30">
            <div className="w-full h-full bg-[#100C14] rounded-[14px] flex items-center justify-center text-white">
              <Bell className="w-5 h-5 text-[#FF38B8]" />
            </div>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Latest Notices</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#8B2EFF]/20 text-[#B44CFF] border border-[#8B2EFF]/30">
                {notices.length} Total
              </span>
            </h2>
            <p className="text-xs text-[#B9ADC9]">
              Verified administrative circulars & deadlines
            </p>
          </div>
        </div>

        <button
          onClick={onViewAll}
          className="group flex items-center gap-1.5 text-xs font-bold text-[#FF8A24] hover:text-[#FFC857] transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Notices Feed */}
      <div className="my-4 space-y-3">
        {displayNotices.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#B9ADC9]">
            <p>No notices available.</p>
            <button
              onClick={onOpenAddModal}
              className="mt-2 text-[#FF38B8] underline font-semibold"
            >
              Add your first notice
            </button>
          </div>
        ) : (
          displayNotices.map((notice) => {
            const cd = notice.deadline ? getDeadlineCountdown(notice.deadline) : null;
            const isUrgent = notice.priority === 'urgent' || notice.status === 'urgent';

            return (
              <div
                key={notice.id}
                onClick={() => onSelectNotice(notice)}
                className={`group p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isUrgent
                    ? 'bg-gradient-to-r from-[#2B1028]/80 to-[#180E24]/90 border-[#FF38B8]/40 hover:border-[#FF38B8] shadow-md shadow-[#FF38B8]/10 hover:-translate-y-1'
                    : 'bg-[#150D20]/80 border-[#8B2EFF]/20 hover:border-[#8B2EFF]/50 hover:bg-[#1E112E]/90 hover:-translate-y-1'
                }`}
              >
                <div>
                  {/* Badge Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryBadgeStyle(notice.category)}`}>
                        {notice.category}
                      </span>

                      {isUrgent && (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                          Urgent
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-[#B9ADC9]/80 font-mono">
                      {formatRelativeDate(notice.createdAt)}
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FFC857] transition-colors line-clamp-1">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-[#B9ADC9] mt-1 line-clamp-2 leading-relaxed">
                    {notice.summary}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="mt-3 pt-2.5 border-t border-[#8B2EFF]/15 flex items-center justify-between text-[11px] text-[#B9ADC9]">
                  <div className="flex items-center gap-3">
                    {notice.deadline && (
                      <span className={`flex items-center gap-1 font-semibold ${cd?.isOverdue ? 'text-rose-400' : 'text-[#FF8A24]'}`}>
                        <Clock className="w-3 h-3" />
                        <span>{cd?.text}</span>
                      </span>
                    )}

                    {notice.venue && (
                      <span className="flex items-center gap-1 text-[#B9ADC9]">
                        <MapPin className="w-3 h-3 text-[#22D3A6]" />
                        <span className="truncate max-w-[120px]">{notice.venue}</span>
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-1 text-[#B44CFF] font-semibold text-xs group-hover:translate-x-1 transition-transform">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Panel Bottom Action */}
      <div className="pt-3 border-t border-[#8B2EFF]/15 flex items-center justify-between">
        <span className="text-[11px] text-[#B9ADC9] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#22D3A6]" />
          Verified Official Circulars
        </span>

        <button
          onClick={onOpenAddModal}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#8B2EFF]/20 hover:bg-[#8B2EFF]/35 text-[#B44CFF] hover:text-white border border-[#8B2EFF]/30 transition-all"
        >
          + Post New Notice
        </button>
      </div>

    </div>
  );
};

