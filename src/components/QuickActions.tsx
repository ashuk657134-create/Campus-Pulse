import React from 'react';
import { 
  Bell, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  FolderDown, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ViewTab } from '../types/index.ts';

interface QuickActionsProps {
  onNavigate: (tab: ViewTab) => void;
}

interface ActionCardItem {
  tab: ViewTab;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  shadowColor: string;
  accentBadge: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  const cards: ActionCardItem[] = [
    {
      tab: 'notices',
      title: 'View Notices',
      subtitle: 'Verified announcements & circulars',
      icon: <Bell className="w-6 h-6" />,
      gradientFrom: 'from-[#8B2EFF]',
      gradientTo: 'to-[#FF38B8]',
      borderColor: 'border-[#8B2EFF]/30 hover:border-[#FF38B8]/60',
      shadowColor: 'hover:shadow-[#8B2EFF]/25',
      accentBadge: 'Academics'
    },
    {
      tab: 'events',
      title: 'Upcoming Events',
      subtitle: 'Tech Fest 2026, Robowar, Hackathons',
      icon: <Calendar className="w-6 h-6" />,
      gradientFrom: 'from-[#22D3A6]',
      gradientTo: 'to-[#10B981]',
      borderColor: 'border-[#22D3A6]/30 hover:border-[#10B981]/60',
      shadowColor: 'hover:shadow-[#22D3A6]/25',
      accentBadge: 'Campus Life'
    },
    {
      tab: 'forums',
      title: 'Join Forum',
      subtitle: 'Ask queries, team up & discuss',
      icon: <MessageSquare className="w-6 h-6" />,
      gradientFrom: 'from-[#FF8A24]',
      gradientTo: 'to-[#FFC857]',
      borderColor: 'border-[#FF8A24]/30 hover:border-[#FFC857]/60',
      shadowColor: 'hover:shadow-[#FF8A24]/25',
      accentBadge: 'Community'
    },
    {
      tab: 'polls',
      title: 'Take a Poll',
      subtitle: 'Voice your opinion on student affairs',
      icon: <BarChart3 className="w-6 h-6" />,
      gradientFrom: 'from-[#FF38B8]',
      gradientTo: 'to-[#E11D48]',
      borderColor: 'border-[#FF38B8]/30 hover:border-[#E11D48]/60',
      shadowColor: 'hover:shadow-[#FF38B8]/25',
      accentBadge: 'Interactive'
    },
    {
      tab: 'resources',
      title: 'Access Resources',
      subtitle: 'Lecture notes, lab manuals & PYQs',
      icon: <FolderDown className="w-6 h-6" />,
      gradientFrom: 'from-[#B44CFF]',
      gradientTo: 'to-[#EC4899]',
      borderColor: 'border-[#B44CFF]/30 hover:border-[#EC4899]/60',
      shadowColor: 'hover:shadow-[#B44CFF]/25',
      accentBadge: 'Library'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF8A24]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#B9ADC9]">
            Quick Campus Portals
          </h2>
        </div>
        <span className="text-xs text-[#B9ADC9]/60">1-click access</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => onNavigate(card.tab)}
            className={`group relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-[#1C102A]/90 to-[#100C14]/95 border ${card.borderColor} backdrop-blur-md cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl ${card.shadowColor} flex flex-col justify-between`}
          >
            {/* Top gradient glow overlay */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${card.gradientFrom} ${card.gradientTo} opacity-10 group-hover:opacity-20 rounded-bl-full transition-opacity duration-300 pointer-events-none`} />

            <div>
              {/* Badge & Icon */}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.gradientFrom} ${card.gradientTo} p-0.5 shadow-md`}>
                  <div className="w-full h-full bg-[#100C14] rounded-[14px] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#100C14]/80 text-[#B9ADC9] border border-[#8B2EFF]/20">
                  {card.accentBadge}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-sm font-bold text-white group-hover:text-[#FFC857] transition-colors leading-snug">
                {card.title}
              </h3>

              <p className="text-[11px] text-[#B9ADC9] mt-1 line-clamp-2 leading-relaxed">
                {card.subtitle}
              </p>
            </div>

            {/* Bottom Arrow Indicator */}
            <div className="mt-4 pt-3 border-t border-[#8B2EFF]/15 flex items-center justify-between text-xs font-semibold text-[#B9ADC9] group-hover:text-white transition-colors">
              <span className="text-[11px]">Enter Hub</span>
              <div className="p-1 rounded-lg bg-[#1B1024] group-hover:bg-[#FF38B8] text-white transition-colors">
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

