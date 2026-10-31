import React from 'react';
import { 
  Home, 
  Bell, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  FolderDown, 
  Info, 
  Sparkles, 
  GraduationCap, 
  MapPin, 
  CheckSquare, 
  CalendarDays,
  X,
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import { ViewTab } from '../types/index.ts';

interface SidebarProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  noticeCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenAddModal: () => void;
  onOpenWeeklyDigest: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  noticeCount,
  mobileOpen,
  onCloseMobile,
  onOpenAddModal,
  onOpenWeeklyDigest
}) => {
  const mainNavItems: { tab: ViewTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { tab: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { tab: 'notices', label: 'Notices', icon: <Bell className="w-5 h-5" />, badge: noticeCount },
    { tab: 'events', label: 'Events', icon: <Calendar className="w-5 h-5" />, badge: 'New' },
    { tab: 'forums', label: 'Forums', icon: <MessageSquare className="w-5 h-5" /> },
    { tab: 'polls', label: 'Polls', icon: <BarChart3 className="w-5 h-5" /> },
    { tab: 'resources', label: 'Resources', icon: <FolderDown className="w-5 h-5" /> },
    { tab: 'about', label: 'About', icon: <Info className="w-5 h-5" /> }
  ];

  const secondaryNavItems: { tab: ViewTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'calendar', label: 'Calendar View', icon: <CalendarDays className="w-4 h-4" /> },
    { tab: 'actions', label: 'Action Checklist', icon: <CheckSquare className="w-4 h-4" /> }
  ];

  const isTabActive = (tab: ViewTab) => {
    if (tab === 'home' && (currentTab === 'home' || currentTab === 'dashboard')) return true;
    return currentTab === tab;
  };

  const handleSelectTab = (tab: ViewTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-[#160E21] via-[#100C14] to-[#1A0E26] border-r border-[#8B2EFF]/20 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Brand Header */}
        <div className="p-5 border-b border-[#8B2EFF]/15 flex items-center justify-between">
          <div 
            onClick={() => handleSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Animated Logo with Pulse and Graduation Cap */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#8B2EFF] via-[#FF38B8] to-[#FF8A24] p-0.5 shadow-lg shadow-[#8B2EFF]/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#100C14] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <GraduationCap className="w-6 h-6 text-[#FF8A24] group-hover:rotate-12 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF38B8] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF38B8]"></span>
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-[#F8F5FF] via-[#FF38B8] to-[#FF8A24] bg-clip-text text-transparent">
                  Campus Pulse
                </span>
              </div>
              <p className="text-[11px] font-medium tracking-wide text-[#B9ADC9] flex items-center gap-1">
                <span>Learn</span>
                <span className="text-[#FF38B8]">•</span>
                <span>Connect</span>
                <span className="text-[#FF8A24]">•</span>
                <span>Grow</span>
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button 
            onClick={onCloseMobile}
            className="p-1.5 rounded-xl text-[#B9ADC9] hover:text-white hover:bg-[#1B1024] lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Callout (Weekly Pulse AI & Ingest) */}
        <div className="px-4 pt-4 pb-2 space-y-2">
          <button
            onClick={() => {
              onOpenWeeklyDigest();
              onCloseMobile();
            }}
            className="w-full relative group overflow-hidden rounded-xl p-3 bg-gradient-to-r from-[#8B2EFF]/20 via-[#FF38B8]/20 to-[#FF8A24]/20 border border-[#8B2EFF]/30 hover:border-[#FF38B8]/50 text-left transition-all shadow-sm hover:shadow-[#8B2EFF]/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-gradient-to-tr from-[#8B2EFF] to-[#FF38B8] text-white">
                  <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF8A24]">Weekly Pulse AI</div>
                  <div className="text-xs font-bold text-white group-hover:text-[#FFC857] transition-colors">What to know this week</div>
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              onOpenAddModal();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#8B2EFF] to-[#FF38B8] hover:from-[#9D4DFF] hover:to-[#FF4FBF] text-white shadow-md shadow-[#8B2EFF]/25 hover:shadow-[#FF38B8]/35 transition-all transform active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Campus Notice</span>
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 px-3 py-2 overflow-y-auto space-y-1">
          <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#B9ADC9]/60">
            Navigation
          </div>

          {mainNavItems.map(item => {
            const active = isTabActive(item.tab);
            return (
              <button
                key={item.tab}
                onClick={() => handleSelectTab(item.tab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active
                    ? 'bg-gradient-to-r from-[#8B2EFF] to-[#FF38B8] text-white font-semibold shadow-lg shadow-[#8B2EFF]/30'
                    : 'text-[#B9ADC9] hover:text-white hover:bg-[#1B1024]/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${active ? 'text-white' : 'text-[#B9ADC9] group-hover:text-[#FF8A24]'} transition-colors`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    active 
                      ? 'bg-white/20 text-white' 
                      : typeof item.badge === 'number'
                      ? 'bg-[#8B2EFF]/20 text-[#B44CFF] border border-[#8B2EFF]/30'
                      : 'bg-[#FF8A24]/20 text-[#FF8A24] border border-[#FF8A24]/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#B9ADC9]/60">
            Productivity Hub
          </div>

          {secondaryNavItems.map(item => {
            const active = isTabActive(item.tab);
            return (
              <button
                key={item.tab}
                onClick={() => handleSelectTab(item.tab)}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-[#8B2EFF]/25 text-white border border-[#8B2EFF]/40'
                    : 'text-[#B9ADC9] hover:text-white hover:bg-[#1B1024]/60'
                }`}
              >
                <span className={active ? 'text-[#FF38B8]' : 'text-[#B9ADC9]'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Decorative Campus Illustration & Location Footer */}
        <div className="p-4 border-t border-[#8B2EFF]/15 bg-[#140C1A]/90">
          <div className="relative overflow-hidden rounded-2xl p-3 bg-gradient-to-br from-[#1B1024] to-[#100C14] border border-[#8B2EFF]/20 mb-3 group">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#FFC857] uppercase tracking-wider">Campus Anchor</span>
                <p className="text-xs font-bold text-white mt-0.5">MIT Campus</p>
                <p className="text-[11px] text-[#B9ADC9]">Moradabad, Uttar Pradesh</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8B2EFF] to-[#FF8A24] p-1.5 text-white flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#B9ADC9]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22D3A6] animate-pulse"></span>
              Live Campus Net
            </span>
            <span className="font-mono text-[10px] text-[#B9ADC9]/70">v2.4 Pro</span>
          </div>
        </div>

      </aside>
    </>
  );
};

