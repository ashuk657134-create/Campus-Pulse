import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Trophy, Users, Ticket, CheckCircle2, ArrowRight, Search, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CampusEventItem {
  id: string;
  title: string;
  category: 'technical' | 'cultural' | 'sports' | 'workshop';
  date: string;
  time: string;
  venue: string;
  teamSize: string;
  prizePool?: string;
  description: string;
  isRegistered?: boolean;
}

export const EventsView: React.FC = () => {
  const [events, setEvents] = useState<CampusEventItem[]>([
    {
      id: 'event-techfest',
      title: 'Tech Fest 2026 – Flagship National Symposium',
      category: 'technical',
      date: '25 November 2026',
      time: '10:00 AM',
      venue: 'Main Auditorium, MIT Campus',
      teamSize: '2 - 4 Members',
      prizePool: '₹2,50,000',
      description: 'The flagship annual technical festival featuring 24-hr Hackathons, Robowar, AI Model Exhibitions, and startup venture pitching.'
    },
    {
      id: 'event-robowar',
      title: 'RoboClash: 15kg & 30kg Combat Robotics Championship',
      category: 'technical',
      date: '26 November 2026',
      time: '01:00 PM',
      venue: 'Open Arena, MIT Campus',
      teamSize: '3 - 5 Members',
      prizePool: '₹80,000',
      description: 'High-intensity custom robot battle in an armored cage. Flails, spinners, and lifters competing for the MIT RoboClash trophy.'
    },
    {
      id: 'event-cultural',
      title: 'Rhythm 2026: Annual Inter-College Cultural Night',
      category: 'cultural',
      date: '12 December 2026',
      time: '05:30 PM',
      venue: 'Central Amphitheater',
      teamSize: 'Solo or Troupe',
      prizePool: 'Trophies & Swag',
      description: 'Battle of the bands, classical fusion choreography, stand-up comedy showcase, and live celebrity music performance.'
    },
    {
      id: 'event-hackathon',
      title: 'Campus Hack: 12-Hour AI & Web3 Sprint',
      category: 'workshop',
      date: '05 December 2026',
      time: '09:00 AM',
      venue: 'Innovation & Incubation Hub',
      teamSize: '2 - 3 Members',
      prizePool: '₹50,000 + Grants',
      description: 'Intense prototype building session focused on campus productivity, student mental health, and decentralized identity solutions.'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeRegisteredId, setActiveRegisteredId] = useState<string | null>(null);

  const handleRegisterEvent = (id: string) => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF8A24', '#FF38B8', '#B44CFF', '#FFC857']
    });

    setEvents(prev => prev.map(e => e.id === id ? { ...e, isRegistered: true } : e));
    setActiveRegisteredId(id);
  };

  const filteredEvents = events.filter(e => {
    if (activeCategory !== 'all' && e.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#FF38B8] to-[#FF8A24] text-white">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Campus Events & Competitions
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#B9ADC9] mt-1">
            Discover upcoming hackathons, tech fests, workshops, and cultural nights across MIT Campus, Moradabad.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-[#1C102A] text-[#FFC857] border border-[#FFC857]/30">
            {events.length} Major Meets
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1C102A]/80 border border-[#8B2EFF]/25 p-3 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['all', 'technical', 'cultural', 'workshop'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#FF8A24] via-[#FF38B8] to-[#8B2EFF] text-white shadow-md'
                  : 'text-[#B9ADC9] hover:text-white hover:bg-[#251538]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#B9ADC9] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, venues..."
            className="w-full bg-[#100C14] border border-[#8B2EFF]/20 focus:border-[#FF38B8] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#B9ADC9]/60 outline-none"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map(event => (
          <div
            key={event.id}
            className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#1C102A]/90 to-[#100C14]/95 border border-[#8B2EFF]/30 hover:border-[#FF38B8]/60 transition-all duration-300 shadow-xl flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#8B2EFF]/20 text-[#B44CFF] border border-[#8B2EFF]/40">
                  {event.category}
                </span>

                {event.prizePool && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[#FFC857] bg-[#FFC857]/15 px-2.5 py-0.5 rounded-full border border-[#FFC857]/30">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{event.prizePool}</span>
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#FFC857] transition-colors leading-snug">
                {event.title}
              </h3>

              <p className="text-xs text-[#B9ADC9] leading-relaxed">
                {event.description}
              </p>

              <div className="pt-2 grid grid-cols-2 gap-2 text-xs font-mono text-[#F8F5FF]">
                <div className="flex items-center gap-1.5 text-[#FF8A24]">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{event.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#B44CFF]">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#22D3A6] col-span-2">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{event.venue}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#8B2EFF]/15 flex items-center justify-between">
              <span className="text-[11px] text-[#B9ADC9]">
                Team: {event.teamSize}
              </span>

              <button
                onClick={() => handleRegisterEvent(event.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  event.isRegistered
                    ? 'bg-[#22D3A6] text-[#100C14]'
                    : 'bg-gradient-to-r from-[#FF8A24] via-[#FF38B8] to-[#8B2EFF] text-white hover:opacity-95 shadow-md'
                }`}
              >
                {event.isRegistered ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Registered</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Register Team</span>
                  </>
                )}
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

