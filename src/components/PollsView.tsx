import React from 'react';
import { BarChart3, Sparkles } from 'lucide-react';
import { PollCard } from './PollCard';

export const PollsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#FF38B8] to-[#FF8A24] text-white">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Campus Pulse Polling Center
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#B9ADC9] mt-1">
          Have your voice heard! Vote on current campus discussions, student initiatives, and facilities at MIT Campus.
        </p>
      </div>

      {/* Main Active Poll Card */}
      <PollCard />

      {/* Historical / Completed Polls Archive */}
      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#FFC857]">
          Recent Campus Poll Results
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-5 rounded-3xl bg-[#1C102A]/80 border border-[#8B2EFF]/25 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-[#B9ADC9]">
              <span className="font-bold text-white">Library Operating Hours Preference</span>
              <span className="font-mono text-[10px]">342 votes</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between mb-1 text-[#B9ADC9]">
                  <span>24/7 during Exam Weeks</span>
                  <span className="font-bold text-[#22D3A6]">78%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#100C14] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#22D3A6] to-[#10B981] w-[78%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-[#B9ADC9]">
                  <span>Standard 8 AM - 10 PM</span>
                  <span className="font-bold text-[#B44CFF]">22%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#100C14] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#8B2EFF] to-[#B44CFF] w-[22%]"></div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-[#22D3A6] font-semibold flex items-center gap-1">
              <span>Outcome: Approved by Dean Academics (24/7 Hours Active)</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#1C102A]/80 border border-[#8B2EFF]/25 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-[#B9ADC9]">
              <span className="font-bold text-white">Tech Fest 2026 Gaming Title</span>
              <span className="font-mono text-[10px]">419 votes</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between mb-1 text-[#B9ADC9]">
                  <span>Valorant 5v5 Championship</span>
                  <span className="font-bold text-[#FF38B8]">58%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#100C14] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF38B8] to-[#FF8A24] w-[58%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-[#B9ADC9]">
                  <span>BGMI Squad Rush</span>
                  <span className="font-bold text-[#FFC857]">42%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#100C14] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF8A24] to-[#FFC857] w-[42%]"></div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-[#FF8A24] font-semibold flex items-center gap-1">
              <span>Outcome: Valorant 5v5 officially scheduled for Tech Fest Day 2</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

