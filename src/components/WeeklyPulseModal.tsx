import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Download, 
  Copy, 
  Check, 
  Flame,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { CampusNotice, WeeklyDigest } from '../types/index.ts';
import { generateWeeklyDigestLocally, generateWeeklyDigestWithAI } from '../services/weeklyDigest.ts';
import { loadApiKeyFromStorage } from '../services/storage.ts';
import { getDeadlineCountdown, formatRelativeDate } from '../utils/dateUtils.ts';

interface WeeklyPulseModalProps {
  isOpen: boolean;
  onClose: () => void;
  notices: CampusNotice[];
  onSelectNotice: (notice: CampusNotice) => void;
}

export const WeeklyPulseModal: React.FC<WeeklyPulseModalProps> = ({
  isOpen,
  onClose,
  notices,
  onSelectNotice
}) => {
  const [digest, setDigest] = useState<WeeklyDigest | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const apiKey = loadApiKeyFromStorage();

  useEffect(() => {
    if (isOpen) {
      handleGenerateDigest();
    }
  }, [isOpen, notices]);

  const handleGenerateDigest = async () => {
    setIsGenerating(true);
    try {
      if (apiKey && apiKey.length > 5) {
        const aiDigest = await generateWeeklyDigestWithAI(notices, apiKey);
        setDigest(aiDigest);
      } else {
        const localDigest = generateWeeklyDigestLocally(notices);
        setDigest(localDigest);
      }
    } catch {
      const fallback = generateWeeklyDigestLocally(notices);
      setDigest(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  const handleCopyMarkdown = () => {
    if (!digest) return;

    const md = `# ⚡ CAMPUS PULSE AI — WEEKLY BRIEFING
**Week:** ${digest.weekRange.start} – ${digest.weekRange.end}
**Generated:** ${new Date(digest.generatedAt).toLocaleString()}

## 📌 Executive Summary
${digest.summary}

## 🚨 Critical Deadlines
${digest.topDeadlines.length === 0 ? '- None for this week.' : digest.topDeadlines.map(n => `- [ ] **${n.title}** (Due: ${n.deadline}) - ${n.suggestedAction || 'Submit on portal'}`).join('\n')}

## 📅 Events This Week
${digest.eventsThisWeek.length === 0 ? '- No scheduled events.' : digest.eventsThisWeek.map(n => `- **${n.title}** (${n.eventDate} at ${n.venue || 'Campus'})`).join('\n')}

## ⚠️ Overdue Submissions
${digest.overdueTasks.length === 0 ? '- None! You are caught up.' : digest.overdueTasks.map(n => `- ❗ **${n.title}** (Past deadline: ${n.deadline})`).join('\n')}

## 📋 Action Plan Checklist
${digest.actionChecklist.map(item => `- [${item.completed ? 'x' : ' '}] ${item.task}`).join('\n')}
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!digest) return;
    const md = `# ⚡ CAMPUS PULSE AI — WEEKLY BRIEFING\n\n${digest.summary}\n\n## Action Checklist\n${digest.actionChecklist.map(i => `- [ ] ${i.task}`).join('\n')}`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Campus_Pulse_Digest_${digest.weekRange.start.replace(/\s+/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#160E22] border border-[#8B2EFF]/35 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#8B2EFF]/20 bg-gradient-to-r from-[#241338] via-[#1B1024] to-[#100C14]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#8B2EFF] via-[#FF38B8] to-[#FF8A24] text-white shadow-lg shadow-[#8B2EFF]/25">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">Weekly Pulse AI Digest</h2>
                {apiKey ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#22D3A6]/15 text-[#22D3A6] border border-[#22D3A6]/30">
                    AI Enhanced
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#8B2EFF]/20 text-[#B44CFF] border border-[#8B2EFF]/30">
                    Rule-based
                  </span>
                )}
              </div>
              <p className="text-xs text-[#B9ADC9] mt-0.5">
                Week of {digest?.weekRange.start} – {digest?.weekRange.end}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="p-2 rounded-xl text-[#B9ADC9] hover:text-white bg-[#100C14] hover:bg-[#251538] border border-[#8B2EFF]/20 transition-colors"
              title="Copy as Markdown"
            >
              {copied ? <Check className="w-4 h-4 text-[#22D3A6]" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="p-2 rounded-xl text-[#B9ADC9] hover:text-white bg-[#100C14] hover:bg-[#251538] border border-[#8B2EFF]/20 transition-colors"
              title="Download Digest Markdown"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#B9ADC9] hover:text-white bg-[#100C14] hover:bg-[#251538] border border-[#8B2EFF]/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {isGenerating ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-[#FF38B8] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-semibold text-white">Synthesizing Campus Intelligence...</p>
              <p className="text-[11px] text-[#B9ADC9]">Correlating deadlines, venue shifts, and incomplete tasks</p>
            </div>
          ) : !digest ? (
            <div className="py-12 text-center text-[#B9ADC9] text-xs">
              No saved notices found to compile weekly intelligence.
            </div>
          ) : (
            <>
              {/* Executive Briefing Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#241338] via-[#1B1024] to-[#100C14] border border-[#8B2EFF]/30">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFC857] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Executive Campus Briefing
                </div>
                <p className="text-xs sm:text-sm text-[#F8F5FF] leading-relaxed font-sans">
                  {digest.summary}
                </p>
              </div>

              {/* Overdue Submissions Warning (if any) */}
              {digest.overdueTasks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Overdue Incomplete Tasks ({digest.overdueTasks.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {digest.overdueTasks.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onClose();
                          onSelectNotice(item);
                        }}
                        className="p-3 rounded-2xl bg-rose-950/25 border border-rose-500/35 hover:border-rose-500/60 cursor-pointer transition-all"
                      >
                        <div className="text-xs font-bold text-white line-clamp-1">{item.title}</div>
                        <div className="text-[11px] text-rose-300 mt-1 font-mono">
                          {getDeadlineCountdown(item.deadline).text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Deadlines this week */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FF8A24] uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  <span>Important Deadlines This Week ({digest.topDeadlines.length})</span>
                </div>
                {digest.topDeadlines.length === 0 ? (
                  <p className="text-xs text-[#B9ADC9]/60 italic">No assignment deadlines scheduled for this week.</p>
                ) : (
                  <div className="space-y-2">
                    {digest.topDeadlines.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onClose();
                          onSelectNotice(item);
                        }}
                        className="p-3.5 rounded-2xl bg-[#100C14] border border-[#8B2EFF]/20 hover:border-[#FF38B8]/40 cursor-pointer flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{item.title}</div>
                          <div className="text-[11px] text-[#B9ADC9] mt-0.5">{item.suggestedAction}</div>
                        </div>
                        <span className="text-xs font-mono font-semibold text-[#FF8A24] whitespace-nowrap">
                          {getDeadlineCountdown(item.deadline).text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Campus Events this week */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#B44CFF] uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  <span>Campus Events This Week ({digest.eventsThisWeek.length})</span>
                </div>
                {digest.eventsThisWeek.length === 0 ? (
                  <p className="text-xs text-[#B9ADC9]/60 italic">No events or exams on this week&apos;s schedule.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {digest.eventsThisWeek.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onClose();
                          onSelectNotice(item);
                        }}
                        className="p-3.5 rounded-2xl bg-[#100C14] border border-[#8B2EFF]/20 hover:border-[#FF38B8]/40 cursor-pointer"
                      >
                        <div className="text-xs font-bold text-white line-clamp-1">{item.title}</div>
                        <div className="text-[11px] text-[#FFC857] mt-1 flex items-center justify-between">
                          <span>{formatRelativeDate(item.eventDate)}</span>
                          <span className="text-[#B9ADC9]">{item.venue || 'MIT Campus'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended Action Plan Checklist */}
              <div className="space-y-2 pt-2 border-t border-[#8B2EFF]/15">
                <div className="flex items-center gap-2 text-xs font-bold text-[#22D3A6] uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Recommended Student Action Plan</span>
                </div>
                <div className="space-y-1.5">
                  {digest.actionChecklist.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#100C14] border border-[#8B2EFF]/20 flex items-center gap-3 text-xs text-white"
                    >
                      <span className="w-5 h-5 rounded-md bg-[#8B2EFF]/25 text-[#B44CFF] flex items-center justify-center font-mono font-bold text-[10px] flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="flex-1">{item.task}</span>
                    </div>
                  ))}
                </div>
              </div>

            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#8B2EFF]/20 bg-[#12091A] flex items-center justify-between">
          <div className="text-[11px] text-[#B9ADC9]">
            Dynamically synthesized from your active college notices
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8B2EFF] to-[#FF38B8] text-white shadow-lg"
          >
            Got it, Let&apos;s Conquer the Week
          </button>
        </div>

      </div>
    </div>
  );
};

