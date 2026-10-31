import React, { useState, useEffect } from 'react';
import { BarChart3, CheckCircle2, Vote, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CampusPoll } from '../types/index.ts';
import { INITIAL_CAMPUS_POLL } from '../data/campusData.ts';

const POLL_STORAGE_KEY = 'campus_pulse_poll_state_v2';

export const PollCard: React.FC = () => {
  const [poll, setPoll] = useState<CampusPoll>(() => {
    try {
      const saved = localStorage.getItem(POLL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CAMPUS_POLL;
    } catch {
      return INITIAL_CAMPUS_POLL;
    }
  });

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(poll.userVotedOptionId || null);
  const [voted, setVoted] = useState<boolean>(!!poll.userVotedOptionId);
  const [justVoted, setJustVoted] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(POLL_STORAGE_KEY, JSON.stringify(poll));
    } catch (e) {
      console.warn('Failed to save poll state to localStorage', e);
    }
  }, [poll]);

  const handleVote = () => {
    if (!selectedOptionId || voted) return;

    const updatedOptions = poll.options.map(opt => {
      if (opt.id === selectedOptionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });

    const updatedPoll: CampusPoll = {
      ...poll,
      options: updatedOptions,
      totalVotes: poll.totalVotes + 1,
      userVotedOptionId: selectedOptionId
    };

    setPoll(updatedPoll);
    setVoted(true);
    setJustVoted(true);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#B44CFF', '#FF38B8', '#22D3A6']
    });

    setTimeout(() => setJustVoted(false), 3000);
  };

  const getOptionColor = (index: number) => {
    switch (index) {
      case 0:
        return {
          bar: 'from-[#8B2EFF] to-[#B44CFF]',
          border: 'border-[#B44CFF]',
          text: 'text-[#B44CFF]'
        };
      case 1:
        return {
          bar: 'from-[#FF38B8] to-[#FF8A24]',
          border: 'border-[#FF38B8]',
          text: 'text-[#FF38B8]'
        };
      case 2:
      default:
        return {
          bar: 'from-[#22D3A6] to-[#10B981]',
          border: 'border-[#22D3A6]',
          text: 'text-[#22D3A6]'
        };
    }
  };

  return (
    <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-[#1C102A]/90 to-[#100C14]/95 border border-[#8B2EFF]/30 backdrop-blur-xl shadow-2xl flex flex-col justify-between relative overflow-hidden">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#8B2EFF]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF38B8] to-[#FF8A24] p-0.5 shadow-md shadow-[#FF38B8]/30">
              <div className="w-full h-full bg-[#100C14] rounded-[10px] flex items-center justify-center text-white">
                <BarChart3 className="w-5 h-5 text-[#FF38B8]" />
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <span>Campus Voice Poll</span>
                {voted && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#22D3A6]/20 text-[#22D3A6]">
                    Voted
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-[#B9ADC9]">
                Live student consensus • MIT Campus
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#100C14] text-[#B9ADC9] border border-[#8B2EFF]/20">
            {poll.totalVotes} Votes
          </span>
        </div>

        {/* Question */}
        <h4 className="text-sm font-bold text-white mt-4 mb-3 leading-snug">
          &ldquo;{poll.question}&rdquo;
        </h4>

        {/* Options List */}
        <div className="space-y-2.5">
          {poll.options.map((opt, idx) => {
            const percentage = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
            const isSelected = selectedOptionId === opt.id;
            const colors = getOptionColor(idx);

            return (
              <div
                key={opt.id}
                onClick={() => {
                  if (!voted) setSelectedOptionId(opt.id);
                }}
                className={`relative overflow-hidden p-3 rounded-2xl border transition-all duration-300 ${
                  voted
                    ? isSelected 
                      ? 'bg-[#221034] border-[#FF38B8]/50 shadow-md' 
                      : 'bg-[#140D1E]/70 border-[#8B2EFF]/20'
                    : isSelected
                    ? 'bg-[#26123B] border-[#B44CFF] shadow-lg shadow-[#8B2EFF]/20 cursor-pointer'
                    : 'bg-[#140D1E]/70 hover:bg-[#1E112E] border-[#8B2EFF]/20 hover:border-[#8B2EFF]/40 cursor-pointer'
                }`}
              >
                {/* Background Animated Progress Bar (When Voted or Previewing) */}
                {voted && (
                  <div
                    className={`absolute top-0 bottom-0 left-0 bg-gradient-to-r ${colors.bar} opacity-20 transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                )}

                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Radio circle */}
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'border-[#FF38B8] bg-[#FF38B8]' 
                        : 'border-[#B9ADC9]/60 bg-transparent'
                    }`}>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>

                    <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-[#B9ADC9]'}`}>
                      {opt.text}
                    </span>
                  </div>

                  {voted && (
                    <span className={`text-xs font-mono font-bold ${colors.text}`}>
                      {percentage}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Button / Confirmation Bar */}
      <div className="mt-4 pt-3 border-t border-[#8B2EFF]/20 flex items-center justify-between">
        <span className="text-[10px] text-[#B9ADC9]/70 font-mono">
          * Simulated poll data persisted locally
        </span>

        {voted ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#22D3A6]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Vote Recorded!</span>
          </div>
        ) : (
          <button
            onClick={handleVote}
            disabled={!selectedOptionId}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#B44CFF] via-[#FF38B8] to-[#FF8A24] text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#B44CFF]/25 hover:opacity-95 transition-all transform active:scale-95"
          >
            <Vote className="w-3.5 h-3.5" />
            <span>Vote Now</span>
          </button>
        )}
      </div>

    </div>
  );
};

