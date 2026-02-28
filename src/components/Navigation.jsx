import React from 'react';

const HomeIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    {!active && <polyline points="9 22 9 12 15 12 15 22" />}
  </svg>
);

const WorkoutIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5L17.5 17.5" />
    <path d="M7 2l-2 2 1.5 1.5" />
    <path d="M2 7l2-2" />
    <path d="M17 22l2-2-1.5-1.5" />
    <path d="M22 17l-2 2" />
    <path d="M3 12h4m10 0h4" />
    <path d="M12 3v4m0 10v4" />
  </svg>
);

const ChartIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="12" width="4" height="9" rx="1" />
    <rect x="10" y="7" width="4" height="14" rx="1" />
    <rect x="17" y="3" width="4" height="18" rx="1" />
  </svg>
);

const PlanIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="8" y1="8" x2="16" y2="8" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="8" y1="16" x2="12" y2="16" />
  </svg>
);

const tabs = [
  { id: 'dashboard', label: 'היום', Icon: HomeIcon },
  { id: 'workout', label: 'אימון', Icon: WorkoutIcon },
  { id: 'progress', label: 'התקדמות', Icon: ChartIcon },
  { id: 'plan', label: 'תוכנית', Icon: PlanIcon },
];

export default function Navigation({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 border-t border-border-light" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="flex justify-around items-center px-3 pt-2" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 14px), 14px)' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'text-primary-400 bg-primary-50'
                  : 'text-txt-tertiary active:text-txt-secondary active:bg-surfaceHover'
              }`}
            >
              <tab.Icon active={isActive} />
              <span className={`text-[14px] font-bold tracking-wide font-heading transition-colors duration-300 ${
                isActive ? 'text-primary-400' : 'text-txt-tertiary'
              }`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
