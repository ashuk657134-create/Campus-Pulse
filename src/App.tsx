import React, { useState, useEffect, useMemo } from 'react';
import { 
  CampusNotice, 
  ViewTab, 
  Language 
} from './types/index.ts';
import { 
  loadNoticesFromStorage, 
  saveNoticesToStorage, 
  resetDemoDataInStorage, 
  clearAllNoticesFromStorage,
  loadThemeFromStorage,
  saveThemeToStorage,
  loadLanguageFromStorage,
  saveLanguageToStorage
} from './services/storage.ts';
import { detectConflicts, detectDuplicates } from './services/conflictDetector.ts';

import { Sidebar } from './components/Sidebar.tsx';
import { Topbar } from './components/Topbar.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { NoticeExplorer } from './components/NoticeExplorer.tsx';
import { EventsView } from './components/EventsView.tsx';
import { ForumsView } from './components/ForumsView.tsx';
import { PollsView } from './components/PollsView.tsx';
import { ResourcesView } from './components/ResourcesView.tsx';
import { AboutView } from './components/AboutView.tsx';
import { SmartCalendar } from './components/SmartCalendar.tsx';
import { PersonalActionCenter } from './components/PersonalActionCenter.tsx';
import { SmartNoticeInput } from './components/SmartNoticeInput.tsx';
import { WeeklyPulseModal } from './components/WeeklyPulseModal.tsx';
import { ConflictRadarModal } from './components/ConflictRadarModal.tsx';
import { NoticeDetailModal } from './components/NoticeDetailModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { CommandMenu } from './components/CommandMenu.tsx';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

export const App: React.FC = () => {
  const [notices, setNotices] = useState<CampusNotice[]>(() => loadNoticesFromStorage());
  const [currentTab, setCurrentTab] = useState<ViewTab>('home');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => loadThemeFromStorage());
  const [lang, setLang] = useState<Language>(() => loadLanguageFromStorage());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWeeklyPulseOpen, setIsWeeklyPulseOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  
  // Selected notice for inspection & editing
  const [selectedNotice, setSelectedNotice] = useState<CampusNotice | null>(null);
  const [noticeToEdit, setNoticeToEdit] = useState<CampusNotice | null>(null);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    saveNoticesToStorage(notices);
  }, [notices]);

  // Sync Theme
  useEffect(() => {
    saveThemeToStorage(theme);
    const root = document.documentElement;
    root.classList.add('dark');
  }, [theme]);

  // Sync Language
  useEffect(() => {
    saveLanguageToStorage(lang);
  }, [lang]);

  // Dynamic conflicts and duplicate detection
  const conflicts = useMemo(() => detectConflicts(notices), [notices]);
  const duplicates = useMemo(() => detectDuplicates(notices), [notices]);
  const totalDiscrepancies = conflicts.length + duplicates.length;

  // Handlers
  const handleSaveNotice = (savedNotice: CampusNotice) => {
    setNotices(prev => {
      const exists = prev.some(n => n.id === savedNotice.id);
      if (exists) {
        return prev.map(n => n.id === savedNotice.id ? savedNotice : n);
      }
      return [savedNotice, ...prev];
    });

    setIsAddModalOpen(false);
    setNoticeToEdit(null);
    showToast(`Notice "${savedNotice.title}" saved successfully!`);
  };

  const handleDeleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    showToast('Notice removed from campus board.', 'info');
  };

  const handleToggleComplete = (id: string) => {
    setNotices(prev => prev.map(n => {
      if (n.id === id) {
        const nextStatus = !n.isCompleted;
        return {
          ...n,
          isCompleted: nextStatus,
          status: nextStatus ? 'completed' : (n.priority === 'urgent' ? 'urgent' : 'upcoming')
        };
      }
      return n;
    }));
  };

  const handleResetDemo = () => {
    const fresh = resetDemoDataInStorage();
    setNotices(fresh);
    showToast('MIT Campus demo data restored!');
  };

  const handleClearAll = () => {
    clearAllNoticesFromStorage();
    setNotices([]);
    showToast('All saved notices cleared.', 'info');
  };

  const handleImportNotices = (imported: CampusNotice[]) => {
    setNotices(imported);
    saveNoticesToStorage(imported);
    showToast(`Imported ${imported.length} notices successfully!`);
  };

  const handleKeepOriginal = (origId: string, conflictingId: string) => {
    setNotices(prev => prev.filter(n => n.id !== conflictingId));
    showToast('Original notice retained; newer update dismissed.');
  };

  const handleKeepNewer = (origId: string, conflictingId: string) => {
    setNotices(prev => prev.filter(n => n.id !== origId));
    showToast('Newer notice accepted; old notice replaced.');
  };

  const handleDismissConflict = () => {
    showToast('Conflict alert acknowledged.');
  };

  return (
    <div className="min-h-screen bg-[#100C14] text-[#F8F5FF] font-sans antialiased selection:bg-[#B44CFF] selection:text-white flex">
      
      {/* 1. Left Fixed Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        noticeCount={notices.length}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenAddModal={() => {
          setNoticeToEdit(null);
          setIsAddModalOpen(true);
        }}
        onOpenWeeklyDigest={() => setIsWeeklyPulseOpen(true)}
      />

      {/* 2. Main Content Wrapper (Shifted right for fixed sidebar on lg screens) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 transition-all duration-300">
        
        {/* Top Navigation Bar */}
        <Topbar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenCommandMenu={() => setIsCommandMenuOpen(true)}
          onOpenConflictModal={() => setIsConflictModalOpen(true)}
          conflictCount={totalDiscrepancies}
          onOpenSettings={() => setIsSettingsOpen(true)}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onSelectNotice={(n) => setSelectedNotice(n)}
          notices={notices}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          {(currentTab === 'home' || currentTab === 'dashboard') && (
            <Dashboard
              notices={notices}
              onOpenAddModal={() => {
                setNoticeToEdit(null);
                setIsAddModalOpen(true);
              }}
              onOpenWeeklyDigest={() => setIsWeeklyPulseOpen(true)}
              onSelectNotice={(notice) => setSelectedNotice(notice)}
              onNavigate={setCurrentTab}
              onToggleComplete={handleToggleComplete}
              lang={lang}
            />
          )}

          {currentTab === 'notices' && (
            <NoticeExplorer
              notices={notices}
              onSelectNotice={(notice) => setSelectedNotice(notice)}
              onEditNotice={(notice) => {
                setNoticeToEdit(notice);
                setIsAddModalOpen(true);
              }}
              onDeleteNotice={handleDeleteNotice}
              onToggleComplete={handleToggleComplete}
              lang={lang}
            />
          )}

          {currentTab === 'events' && (
            <EventsView />
          )}

          {currentTab === 'forums' && (
            <ForumsView />
          )}

          {currentTab === 'polls' && (
            <PollsView />
          )}

          {currentTab === 'resources' && (
            <ResourcesView />
          )}

          {currentTab === 'about' && (
            <AboutView />
          )}

          {currentTab === 'calendar' && (
            <SmartCalendar
              notices={notices}
              onSelectNotice={(notice) => setSelectedNotice(notice)}
              lang={lang}
            />
          )}

          {currentTab === 'actions' && (
            <PersonalActionCenter
              notices={notices}
              onToggleComplete={handleToggleComplete}
              onSelectNotice={(notice) => setSelectedNotice(notice)}
              lang={lang}
            />
          )}
        </main>

        {/* Sub-footer */}
        <footer className="border-t border-[#8B2EFF]/20 py-6 text-center text-xs text-[#B9ADC9]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white">Campus Pulse</span>
              <span>—</span>
              <span>MIT Campus, Moradabad • Learn • Connect • Grow</span>
            </div>
            <div className="flex items-center gap-4 text-[#B9ADC9]">
              <span>Client-Side Local Storage</span>
              <span>•</span>
              <button onClick={handleResetDemo} className="hover:text-white underline">Reset Demo Data</button>
            </div>
          </div>
        </footer>

      </div>

      {/* Ingestion & Edit Notice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl my-8">
            <SmartNoticeInput
              onSaveNotice={handleSaveNotice}
              onCancel={() => {
                setIsAddModalOpen(false);
                setNoticeToEdit(null);
              }}
              initialNoticeToEdit={noticeToEdit}
            />
          </div>
        </div>
      )}

      {/* Weekly Pulse AI Modal */}
      <WeeklyPulseModal
        isOpen={isWeeklyPulseOpen}
        onClose={() => setIsWeeklyPulseOpen(false)}
        notices={notices}
        onSelectNotice={(notice) => {
          setIsWeeklyPulseOpen(false);
          setSelectedNotice(notice);
        }}
      />

      {/* Conflict Radar Modal */}
      <ConflictRadarModal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        conflicts={conflicts}
        duplicates={duplicates}
        onKeepOriginal={handleKeepOriginal}
        onKeepNewer={handleKeepNewer}
        onDismissConflict={handleDismissConflict}
      />

      {/* Notice Detail Inspector Modal */}
      <NoticeDetailModal
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
        onEdit={(notice) => {
          setSelectedNotice(null);
          setNoticeToEdit(notice);
          setIsAddModalOpen(true);
        }}
        onDelete={handleDeleteNotice}
        onToggleComplete={handleToggleComplete}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        notices={notices}
        onResetDemo={handleResetDemo}
        onClearAll={handleClearAll}
        onImportNotices={handleImportNotices}
        lang={lang}
        onToggleLang={() => setLang(prev => prev === 'en' ? 'hi' : 'en')}
      />

      {/* Command Palette (Ctrl+K) */}
      <CommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
        onNavigate={setCurrentTab}
        onOpenAddModal={() => {
          setNoticeToEdit(null);
          setIsAddModalOpen(true);
        }}
        onOpenWeeklyDigest={() => setIsWeeklyPulseOpen(true)}
        onOpenConflictRadar={() => setIsConflictModalOpen(true)}
        onResetDemo={handleResetDemo}
        notices={notices}
        onSelectNotice={(notice) => setSelectedNotice(notice)}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1C102A] border border-[#FF38B8]/40 shadow-2xl text-xs text-white animate-slide-up">
          {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-[#22D3A6]" />}
          {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-[#B9ADC9] hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};

export default App;
