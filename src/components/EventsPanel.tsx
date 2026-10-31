import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Trophy, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Ticket
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EventsPanelProps {
  onViewAllEvents: () => void;
}

export const EventsPanel: React.FC<EventsPanelProps> = ({ onViewAllEvents }) => {
  const [isRegistered, setIsRegistered] = useState(() => {
    return localStorage.getItem('campus_techfest_registered') === 'true';
  });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const handleRegister = () => {
    if (!isRegistered) {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF38B8', '#8B2EFF', '#FF8A24', '#FFC857', '#22D3A6']
      });
      localStorage.setItem('campus_techfest_registered', 'true');
      setIsRegistered(true);
      setShowFeedbackModal(true);
    } else {
      setShowFeedbackModal(true);
    }
  };

  return (
    <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-[#1C102A]/90 to-[#100C14]/95 border border-[#8B2EFF]/30 backdrop-blur-xl shadow-2xl flex flex-col justify-between relative overflow-hidden">
      
      {/* Decorative ambient background glows */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-bl from-[#FF8A24]/20 via-[#FF38B8]/15 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#8B2EFF]/20 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF8A24] to-[#FFC857] p-0.5 shadow-md shadow-[#FF8A24]/30">
            <div className="w-full h-full bg-[#100C14] rounded-[14px] flex items-center justify-center text-white">
              <Calendar className="w-5 h-5 text-[#FFC857]" />
            </div>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Upcoming Events</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF8A24]/20 text-[#FF8A24] border border-[#FF8A24]/30">
                Featured
              </span>
            </h2>
            <p className="text-xs text-[#B9ADC9]">
              Competitions, hackathons, and cultural meets
            </p>
          </div>
        </div>

        <button
          onClick={onViewAllEvents}
          className="text-xs font-bold text-[#FF8A24] hover:text-[#FFC857] flex items-center gap-1 transition-colors"
        >
          <span>All Events</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Featured Highlight Event Card: Tech Fest 2026 */}
      <div className="my-4 p-5 rounded-2xl bg-gradient-to-br from-[#26133B] via-[#1D0E2D] to-[#12081D] border border-[#8B2EFF]/40 hover:border-[#FF38B8]/60 transition-all duration-300 relative group overflow-hidden">
        
        {/* Subtle floating confetti simulation */}
        <div className="absolute top-2 right-12 w-2 h-2 rounded-full bg-[#FFC857] opacity-60 animate-float-slow pointer-events-none"></div>
        <div className="absolute bottom-3 right-6 w-2.5 h-2.5 rounded-full bg-[#FF38B8] opacity-50 animate-float-reverse pointer-events-none"></div>
        <div className="absolute top-6 left-1/2 w-1.5 h-1.5 rounded-full bg-[#22D3A6] opacity-60 animate-float-slow pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="space-y-3 flex-1">
            
            {/* Badges: Purple Date Badge + Trophy Tag */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-[#8B2EFF] to-[#B44CFF] text-white shadow-md shadow-[#8B2EFF]/30">
                <Ticket className="w-3.5 h-3.5" />
                <span>25 November 2026</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-[#FFC857]/15 text-[#FFC857] border border-[#FFC857]/30">
                <Trophy className="w-3.5 h-3.5 text-[#FFC857]" />
                <span>₹2,50,000 Prize Pool</span>
              </span>
            </div>

            {/* Event Title */}
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-[#FFC857] transition-colors leading-tight">
                Tech Fest 2026
              </h3>
              <p className="text-xs text-[#B9ADC9] mt-1 leading-relaxed">
                The flagship national technical symposium of MIT Campus. Featuring 24-hr Hackathons, Robowars, AI Showcases, and startup incubation fast-tracks.
              </p>
            </div>

            {/* Event Key Details */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#F8F5FF]/90 font-medium pt-1">
              <div className="flex items-center gap-1.5 text-[#FF8A24]">
                <Clock className="w-3.5 h-3.5" />
                <span>10:00 AM Sharp</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#B44CFF]">
                <MapPin className="w-3.5 h-3.5" />
                <span>MIT Campus, Moradabad</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#22D3A6]">
                <Users className="w-3.5 h-3.5" />
                <span>Teams: 2-4 Members</span>
              </div>
            </div>

          </div>

          {/* Golden Trophy Artwork Illustration */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#FF8A24] via-[#FFC857] to-[#FF38B8] p-1 flex-shrink-0 shadow-xl shadow-[#FF8A24]/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#12081D] rounded-[14px] flex flex-col items-center justify-center p-2 text-center">
              <Trophy className="w-10 h-10 text-[#FFC857] animate-bounce" />
              <span className="text-[10px] font-extrabold text-white mt-1 uppercase tracking-wider">
                MIT Fest
              </span>
            </div>
          </div>

        </div>

        {/* CTA Bar */}
        <div className="mt-5 pt-4 border-t border-[#8B2EFF]/20 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-[#B9ADC9]">
            {isRegistered ? '✅ Registered for Tech Fest 2026' : '⚡ Registration closes in 5 days'}
          </span>

          <button
            onClick={handleRegister}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all transform active:scale-95 flex items-center gap-2 shadow-lg ${
              isRegistered
                ? 'bg-[#22D3A6] text-[#100C14] hover:bg-[#1ebd94] shadow-[#22D3A6]/30'
                : 'bg-gradient-to-r from-[#FF8A24] via-[#FF38B8] to-[#8B2EFF] text-white hover:opacity-95 shadow-[#FF8A24]/30'
            }`}
          >
            {isRegistered ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>View Registration Pass</span>
              </>
            ) : (
              <>
                <span>Register Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>

      {/* Secondary Upcoming Event Teaser */}
      <div className="pt-3 border-t border-[#8B2EFF]/15 flex items-center justify-between text-xs text-[#B9ADC9]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF38B8]"></span>
          <span className="font-semibold text-white">Next:</span>
          <span>Google Developer Club Web3 Workshop</span>
        </div>
        <span className="text-[11px] font-mono text-[#FFC857]">28 Nov • Audi 2</span>
      </div>

      {/* Local Registration Confirmation Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#160E22] border border-[#FF38B8]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#22D3A6] to-[#10B981] p-0.5 mx-auto">
              <div className="w-full h-full bg-[#100C14] rounded-[14px] flex items-center justify-center text-[#22D3A6]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">
                Registration Confirmed! 🎉
              </h3>
              <p className="text-xs text-[#B9ADC9] leading-relaxed">
                You are registered for <strong>Tech Fest 2026</strong> at MIT Campus, Moradabad.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#100C14] border border-[#8B2EFF]/25 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-[#B9ADC9]">
                <span>Participant:</span>
                <span className="text-white font-bold">Ashu (MIT-2026-CS88)</span>
              </div>
              <div className="flex justify-between text-[#B9ADC9]">
                <span>Pass Code:</span>
                <span className="text-[#FFC857] font-bold">MIT-TF26-9812</span>
              </div>
              <div className="flex justify-between text-[#B9ADC9]">
                <span>Reporting Time:</span>
                <span className="text-[#22D3A6]">25 Nov, 09:30 AM</span>
              </div>
            </div>

            <div className="text-[11px] text-center text-[#B9ADC9]/70">
              * Local demonstration simulation. Pass code saved in your browser storage.
            </div>

            <button
              onClick={() => setShowFeedbackModal(false)}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8B2EFF] to-[#FF38B8] text-white"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

