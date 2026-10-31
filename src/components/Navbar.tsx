import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar as CalendarIcon, 
  LayoutDashboard, 
  ListFilter, 
  CheckSquare, 
  Search, 
  Settings, 
  Sun, 
  Moon, 
  AlertTriangle,
  Menu,
  X,
  PlusCircle,
  Globe
} from 'lucide-react';
import { ViewTab, Language } from '../types';
import { getCurrentDateFormatted } from '../utils/dateUtils';
import { translations } from '../utils/translations';

interface NavbarProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenAddModal: () => void;
  onOpenWeeklyDigest: () => void;
  onOpenConflictModal: () => void;
  conflictCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  lang: Language;
  onToggleLang: () => void;
  onOpenSettings: () => void;
  onOpenCommandMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenAddModal,
  onOpenWeeklyDigest,
  onOpenConflictModal,
  conflictCount,
  theme,
  onToggleTheme,
  lang,
  onToggleLang,
  onOpenSettings,
  onOpenCommandMenu
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  const navItems: { tab: ViewTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'dashboard', label: t.dashboard, icon: <LayoutDashboard className="w-4 h-4" /> },
    { tab: 'notices', label: t.notices, icon: <ListFilter className="w-4 h-4" /> },
    { tab: 'calendar', label: t.calendar, icon: <CalendarIcon className="w-4 h-4" /> },
    { tab: 'actions', label: t.actionCenter, icon: <CheckSquare className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200 border-slate-800/80 bg-slate-950/80 dark:border-slate-800/80 dark:bg-[#080C16]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/20 text-white font-bold text-xl">
              <span>⚡</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                  {t.appName}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            {navItems.map(item => (
              <button
                key={item.tab}
                onClick={() => onTabChange(item.tab)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentTab === item.tab
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Command Trigger */}
            <button
              onClick={onOpenCommandMenu}
              className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:text-slate-200 transition-colors"
              title="Quick Command Palette (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-[11px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">Ctrl K</span>
            </button>

            {/* Conflict Alert Indicator */}
            {conflictCount > 0 && (
              <button
                onClick={onOpenConflictModal}
                className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-all animate-pulse"
                title={`${conflictCount} conflict(s) or duplicate(s) detected!`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Conflicts</span>
                <span className="w-4 h-4 flex items-center justify-center rounded-full bg-rose-500 text-[10px] text-white font-bold">
                  {conflictCount}
                </span>
              </button>
            )}

            {/* Signature Feature: Weekly Pulse AI Button */}
            <button
              onClick={onOpenWeeklyDigest}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95 transition-all transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span className="hidden sm:inline">{t.whatDoINeedToKnow}</span>
              <span className="sm:hidden">Weekly AI</span>
            </button>

            {/* Add Notice Trigger */}
            <button
              onClick={onOpenAddModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.addNotice}</span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={onToggleLang}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800 transition-colors"
              title="Toggle English / Hindi"
            >
              <span className="text-xs font-bold font-mono">{lang === 'en' ? 'हिं' : 'EN'}</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800 transition-colors"
              title="Settings & Storage"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Dynamic Date & Subheader banner on desktop */}
        <div className="hidden sm:flex items-center justify-between py-1.5 text-[11px] text-slate-400 border-t border-slate-900">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Live Campus Stream</span>
            <span className="text-slate-600">•</span>
            <span>{getCurrentDateFormatted()}</span>
          </div>
          <div className="text-slate-500">
            Offline-first • Stored securely in your browser
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-2">
            {navItems.map(item => (
              <button
                key={item.tab}
                onClick={() => {
                  onTabChange(item.tab);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  currentTab === item.tab
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  onOpenAddModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white"
              >
                <PlusCircle className="w-4 h-4" />
                {t.addNotice}
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};

