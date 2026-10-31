import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { NotificationItem, CampusNotice } from '../types/index.ts';
import { INITIAL_NOTIFICATIONS } from '../data/campusData.ts';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  onOpenCommandMenu: () => void;
  onOpenConflictModal: () => void;
  conflictCount: number;
  onOpenSettings: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectNotice?: (notice: CampusNotice) => void;
  notices: CampusNotice[];
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileMenu,
  onOpenCommandMenu,
  onOpenConflictModal,
  conflictCount,
  onOpenSettings,
  searchQuery,
  onSearchChange,
  onSelectNotice,
  notices
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setShowSearchResults(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotices = searchQuery.trim()
    ? notices.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.summary.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <header className="sticky top-0 z-30 w-full h-18 bg-[#100C14]/85 backdrop-blur-md border-b border-[#8B2EFF]/20 px-4 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        
        {/* Mobile Sidebar Toggle & Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-xl text-[#B9ADC9] hover:text-white hover:bg-[#1B1024] lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick campus status indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1B1024]/80 border border-[#8B2EFF]/25 text-xs text-[#B9ADC9]">
            <span className="w-2 h-2 rounded-full bg-[#22D3A6] animate-pulse"></span>
            <span className="font-medium text-white">MIT Campus, Moradabad</span>
            <span className="text-[#B9ADC9]/60">•</span>
            <span className="text-[#FFC857]">Fall Session 2026</span>
          </div>
        </div>

        {/* Global Search Bar (with Ctrl+K focus) */}
        <div className="relative flex-1 max-w-md mx-2 sm:mx-4">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#B9ADC9] absolute left-3.5 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Search anything... (e.g. events, notices)"
              className="w-full bg-[#160F21] border border-[#8B2EFF]/25 focus:border-[#FF38B8] focus:ring-1 focus:ring-[#FF38B8] rounded-xl pl-10 pr-20 py-2 text-xs sm:text-sm text-[#F8F5FF] placeholder-[#B9ADC9]/60 outline-none transition-all shadow-inner"
            />
            <button
              onClick={onOpenCommandMenu}
              className="absolute right-2.5 px-2 py-0.5 rounded-md bg-[#251638] text-[10px] font-mono text-[#B9ADC9] border border-[#8B2EFF]/30 hover:text-white transition-colors"
              title="Open Command Palette"
            >
              Ctrl + K
            </button>
          </div>

          {/* Dynamic Search Autocomplete Dropdown */}
          {showSearchResults && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#160E22] border border-[#8B2EFF]/30 rounded-2xl shadow-2xl p-3 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#8B2EFF]/15 text-[11px] text-[#B9ADC9]">
                <span>Matching Results</span>
                <button 
                  onClick={() => setShowSearchResults(false)}
                  className="text-[#FF38B8] hover:underline"
                >
                  Close
                </button>
              </div>

              {filteredNotices.length === 0 ? (
                <div className="py-4 text-center text-xs text-[#B9ADC9]/70">
                  No notices matching &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                <div className="mt-2 space-y-1.5">
                  {filteredNotices.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onSelectNotice?.(n);
                        setShowSearchResults(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-[#251538] cursor-pointer transition-colors flex items-center justify-between gap-2"
                    >
                      <div className="truncate">
                        <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                        <p className="text-[11px] text-[#B9ADC9] truncate">{n.summary}</p>
                      </div>
                      <span className="text-[9px] uppercase px-2 py-0.5 rounded font-mono font-bold bg-[#8B2EFF]/20 text-[#B44CFF]">
                        {n.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Conflict Badge if any detected */}
          {conflictCount > 0 && (
            <button
              onClick={onOpenConflictModal}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-all animate-pulse"
              title={`${conflictCount} conflict(s) detected in notices`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Conflicts</span>
              <span className="w-4 h-4 rounded-full bg-rose-500 text-[10px] text-white flex items-center justify-center font-bold">
                {conflictCount}
              </span>
            </button>
          )}

          {/* Notification Bell with Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2.5 rounded-xl text-[#B9ADC9] hover:text-white bg-[#1B1024]/80 hover:bg-[#251538] border border-[#8B2EFF]/25 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#FF38B8] ring-2 ring-[#100C14] animate-ping" />
              )}
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#FF38B8] ring-2 ring-[#100C14]" />
              )}
            </button>

            {/* Notification Panel */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#160E22] border border-[#8B2EFF]/30 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-[#8B2EFF]/15">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">Notifications</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF38B8]/20 text-[#FF38B8]">
                      {unreadCount} unread
                    </span>
                  </div>
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-[#FF8A24] hover:underline"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-xl border transition-all ${
                        notif.isRead
                          ? 'bg-[#120B1A]/50 border-[#8B2EFF]/10 opacity-75'
                          : 'bg-[#201230]/70 border-[#8B2EFF]/30 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-white">{notif.title}</span>
                        <span className="text-[10px] text-[#B9ADC9]">{notif.time}</span>
                      </div>
                      <p className="text-xs text-[#B9ADC9] leading-relaxed">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown: Ashu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-[#1B1024]/80 hover:bg-[#251538] border border-[#8B2EFF]/25 hover:border-[#FF38B8]/40 transition-all group"
            >
              {/* User Avatar */}
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B2EFF] via-[#FF38B8] to-[#FF8A24] p-0.5 shadow-md shadow-[#8B2EFF]/30">
                  <div className="w-full h-full bg-[#100C14] rounded-full flex items-center justify-center font-bold text-xs text-white">
                    A
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#22D3A6] ring-1.5 ring-[#100C14]" />
              </div>

              <div className="text-left hidden sm:block">
                <span className="block text-xs font-bold text-white group-hover:text-[#FFC857] transition-colors">
                  Ashu
                </span>
                <span className="block text-[10px] text-[#B9ADC9]">
                  MIT Scholar
                </span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-[#B9ADC9] group-hover:text-white transition-colors ml-0.5" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#160E22] border border-[#8B2EFF]/30 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
                <div className="p-3 border-b border-[#8B2EFF]/15">
                  <p className="text-xs font-bold text-white">Ashu</p>
                  <p className="text-[11px] text-[#B9ADC9]">ashu@mit.campus.edu</p>
                  <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#8B2EFF]/20 text-[#B44CFF]">
                    Student ID: MIT-2026-CS88
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#B9ADC9] hover:text-white hover:bg-[#251538] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#B44CFF]" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#B9ADC9] hover:text-white hover:bg-[#251538] transition-colors"
                  >
                    <Settings className="w-4 h-4 text-[#FF8A24]" />
                    <span>System Settings</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-[#8B2EFF]/15">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      alert('You are logged in as Ashu (MIT Student Account).');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Switch User / Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

