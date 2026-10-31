import React from 'react';
import { Bot, ArrowRight, Users, Sparkles, Send, Award, Heart } from 'lucide-react';

interface WelcomeFooterProps {
  onLetsGo: () => void;
}

export const WelcomeFooter: React.FC<WelcomeFooterProps> = ({ onLetsGo }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#1E0F2B] via-[#150C1F] to-[#1F0E29] border border-[#8B2EFF]/35 shadow-2xl backdrop-blur-xl">
      
      {/* Animated Gradient Wave Ambient Lines */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#B44CFF_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-tr from-[#8B2EFF]/30 to-[#FF38B8]/20 rounded-full blur-3xl pointer-events-none animate-glow-pulse" />
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-bl from-[#FF8A24]/25 to-[#FFC857]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Paper Plane simulation */}
      <div className="absolute top-4 right-8 text-[#FFC857] opacity-70 animate-float-slow pointer-events-none hidden sm:block">
        <Send className="w-6 h-6 rotate-12" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left: Futuristic Friendly Robot Mascot + Greeting */}
        <div className="flex items-center gap-4 sm:gap-5 text-center sm:text-left flex-col sm:flex-row">
          
          {/* Robot Mascot Icon Artwork */}
          <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#8B2EFF] via-[#FF38B8] to-[#FF8A24] p-1 shadow-xl shadow-[#8B2EFF]/30 flex-shrink-0 animate-float-slow">
            <div className="w-full h-full bg-[#100C14] rounded-[20px] flex items-center justify-center relative overflow-hidden group">
              {/* Antenna Pulse */}
              <span className="absolute top-2 w-2 h-2 rounded-full bg-[#22D3A6] animate-ping" />
              <Bot className="w-10 h-10 text-[#FFC857]" />
              {/* Glowing smile indicator */}
              <span className="absolute bottom-2.5 w-6 h-1 rounded-full bg-[#FF38B8]" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#8B2EFF]/20 text-[#B44CFF] border border-[#8B2EFF]/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#FFC857]" />
              <span>Campus Assistant</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <span>Hi Ashu!</span>
              <span className="inline-block animate-bounce">👋</span>
            </h3>

            <p className="text-xs sm:text-sm text-[#B9ADC9] max-w-md">
              Explore, participate and be a part of our amazing campus community at MIT Moradabad!
            </p>
          </div>

        </div>

        {/* Center: 3 Sample Statistic Cards */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full lg:w-auto">
          
          <div className="p-3 sm:p-4 rounded-2xl bg-[#100C14]/80 border border-[#8B2EFF]/25 text-center min-w-[90px] sm:min-w-[110px]">
            <span className="block text-lg sm:text-xl font-black bg-gradient-to-r from-[#B44CFF] to-[#FF38B8] bg-clip-text text-transparent">
              120+
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-[#B9ADC9] mt-0.5 block">
              Students
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-[#100C14]/80 border border-[#8B2EFF]/25 text-center min-w-[90px] sm:min-w-[110px]">
            <span className="block text-lg sm:text-xl font-black bg-gradient-to-r from-[#FF38B8] to-[#FF8A24] bg-clip-text text-transparent">
              15+
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-[#B9ADC9] mt-0.5 block">
              Events
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-[#100C14]/80 border border-[#8B2EFF]/25 text-center min-w-[90px] sm:min-w-[110px]">
            <span className="block text-lg sm:text-xl font-black bg-gradient-to-r from-[#22D3A6] to-[#10B981] bg-clip-text text-transparent">
              100%
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-[#B9ADC9] mt-0.5 block">
              Engagement
            </span>
          </div>

        </div>

        {/* Right: "Let's Go →" CTA Button */}
        <div>
          <button
            onClick={onLetsGo}
            className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#8B2EFF] via-[#FF38B8] to-[#FF8A24] hover:from-[#9D4DFF] hover:to-[#FFA04D] text-white font-bold text-sm shadow-xl shadow-[#8B2EFF]/30 hover:shadow-[#FF38B8]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Let&apos;s Go</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

    </div>
  );
};

