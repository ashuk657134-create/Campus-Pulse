import React from 'react';
import { HeroBanner } from './HeroBanner';
import { QuickActions } from './QuickActions';
import { NoticePanel } from './NoticePanel';
import { EventsPanel } from './EventsPanel';
import { PollCard } from './PollCard';
import { WelcomeFooter } from './WelcomeFooter';
import { CampusNotice, ViewTab, Language } from '../types/index.ts';

interface DashboardProps {
  notices: CampusNotice[];
  onOpenAddModal: () => void;
  onOpenWeeklyDigest: () => void;
  onSelectNotice: (notice: CampusNotice) => void;
  onNavigate: (tab: ViewTab) => void;
  onToggleComplete: (id: string) => void;
  lang: Language;
}

export const Dashboard: React.FC<DashboardProps> = ({
  notices,
  onOpenAddModal,
  onOpenWeeklyDigest,
  onSelectNotice,
  onNavigate,
  onToggleComplete,
  lang
}) => {
  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-in">
      
      {/* 1. Cinematic Hero Banner with Embedded Weather Card & Parallax */}
      <HeroBanner
        onExploreMore={() => onNavigate('notices')}
        onOpenWeeklyDigest={onOpenWeeklyDigest}
      />

      {/* 2. Quick Action Portals (5 Colorful Interactive Cards) */}
      <QuickActions onNavigate={onNavigate} />

      {/* 3. Main Grid: Latest Notices (Left) + Upcoming Events (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Latest Notices Panel (7 cols) */}
        <div className="lg:col-span-7">
          <NoticePanel
            notices={notices}
            onViewAll={() => onNavigate('notices')}
            onSelectNotice={onSelectNotice}
            onOpenAddModal={onOpenAddModal}
          />
        </div>

        {/* Upcoming Events Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <EventsPanel
            onViewAllEvents={() => onNavigate('events')}
          />

          {/* Embedded Poll Card for Quick Voting */}
          <PollCard />
        </div>

      </div>

      {/* 4. Futuristic Welcome Strip & Statistics Footer */}
      <WelcomeFooter onLetsGo={() => onNavigate('notices')} />

    </div>
  );
};
