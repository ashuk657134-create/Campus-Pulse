import React from 'react';
import { Info, GraduationCap, ShieldCheck, Sparkles, Heart, Code2, Cpu, Globe } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Hero Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#241338] via-[#1B1024] to-[#100C14] border border-[#8B2EFF]/35 shadow-2xl relative overflow-hidden text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#8B2EFF] via-[#FF38B8] to-[#FF8A24] p-1 mx-auto shadow-xl shadow-[#8B2EFF]/40">
          <div className="w-full h-full bg-[#100C14] rounded-[20px] flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-[#FFC857]" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white">
          About Campus Pulse
        </h1>
        <p className="text-xs sm:text-sm font-bold bg-gradient-to-r from-[#B44CFF] via-[#FF38B8] to-[#FF8A24] bg-clip-text text-transparent uppercase tracking-wider">
          Learn • Connect • Grow
        </p>
        <p className="text-xs sm:text-sm text-[#B9ADC9] max-w-xl mx-auto leading-relaxed">
          Engineered for college students to transform fragmented notices, WhatsApp forwards, and circulars into unified, actionable campus intelligence.
        </p>
      </div>

      {/* Campus Anchor Card */}
      <div className="p-6 rounded-3xl bg-[#1C102A]/80 border border-[#8B2EFF]/25 backdrop-blur-md shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF8A24]">
            Campus Anchor
          </span>
          <h2 className="text-lg font-bold text-white mt-1">
            MIT Campus, Moradabad
          </h2>
          <p className="text-xs text-[#B9ADC9] mt-2 leading-relaxed">
            Campus Pulse is custom-tailored for the student community of MIT Campus, Moradabad. From examination circulars from the Controller of Examinations to technical symposiums and hostel facility updates, every module reflects true campus life.
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="p-3 rounded-2xl bg-[#100C14] border border-[#8B2EFF]/20 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#22D3A6] flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">Zero Hallucination Guarantee</h4>
              <p className="text-[11px] text-[#B9ADC9]">Missing event details are strictly marked as &ldquo;Not specified&rdquo;.</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#100C14] border border-[#8B2EFF]/20 flex items-center gap-3">
            <Cpu className="w-5 h-5 text-[#B44CFF] flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">Dual-Engine Parser</h4>
              <p className="text-[11px] text-[#B9ADC9]">Runs 100% offline with deterministic heuristics + optional Gemini AI.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Grid */}
      <div className="p-6 rounded-3xl bg-[#1C102A]/80 border border-[#8B2EFF]/25 backdrop-blur-md shadow-xl">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-[#FFC857]">
          Architecture & Technology
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-[#100C14] border border-[#8B2EFF]/20">
            <Code2 className="w-5 h-5 text-[#B44CFF] mx-auto mb-1" />
            <span className="block text-xs font-bold text-white">React 18 + TS</span>
            <span className="text-[10px] text-[#B9ADC9]">Type-Safe Frontend</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#100C14] border border-[#8B2EFF]/20">
            <Sparkles className="w-5 h-5 text-[#FF38B8] mx-auto mb-1" />
            <span className="block text-xs font-bold text-white">Tailwind CSS</span>
            <span className="text-[10px] text-[#B9ADC9]">Dark Plum Design</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#100C14] border border-[#8B2EFF]/20">
            <Globe className="w-5 h-5 text-[#FF8A24] mx-auto mb-1" />
            <span className="block text-xs font-bold text-white">Vite 5</span>
            <span className="text-[10px] text-[#B9ADC9]">Sub-second HMR</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#100C14] border border-[#8B2EFF]/20">
            <ShieldCheck className="w-5 h-5 text-[#22D3A6] mx-auto mb-1" />
            <span className="block text-xs font-bold text-white">LocalStorage</span>
            <span className="text-[10px] text-[#B9ADC9]">100% Local Privacy</span>
          </div>
        </div>
      </div>

    </div>
  );
};

