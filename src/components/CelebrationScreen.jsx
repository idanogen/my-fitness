import React, { useEffect, useState } from 'react';

const confettiColors = ['#FF6B4A', '#FF8F6B', '#0BB890', '#2ECDA3', '#7C5CFC', '#9B7FFF', '#F59E0B', '#60a5fa'];

function ConfettiPiece({ color, delay, left, size, shape }) {
  return (
    <div
      className="absolute"
      style={{
        backgroundColor: color,
        width: `${size}px`,
        height: shape === 'rect' ? `${size * 2.5}px` : `${size}px`,
        borderRadius: shape === 'circle' ? '50%' : shape === 'rect' ? '2px' : '1px',
        left: `${left}%`,
        top: '-20px',
        animation: `confetti-fall ${2.5 + Math.random() * 2}s ease-in ${delay}s forwards`,
        transform: `rotate(${Math.random() * 360}deg)`,
      }}
    />
  );
}

/* SVG stat icons in colored circles — replaces emoji */
const statIconData = [
  { // fire / sets
    color: '#FF6B4A',
    bg: '#FFF1ED',
    svg: <path d="M12 2c0 4-4 6-4 10a4 4 0 108 0c0-4-4-6-4-10z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  },
  { // clock / duration
    color: '#0BB890',
    bg: '#E6FAF5',
    svg: <><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" fill="none" /><path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></>,
  },
  { // dumbbell / exercises
    color: '#7C5CFC',
    bg: '#F0ECFF',
    svg: <><path d="M6 7v10M18 7v10M6 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" /><rect x="4" y="9" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" /><rect x="16" y="9" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" /></>,
  },
  { // chart / completion
    color: '#F59E0B',
    bg: '#FFF8EB',
    svg: <><path d="M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" /><path d="M7 20V14M12 20V8M17 20V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" /></>,
  },
];

const statLabels = ['סטים הושלמו', 'דקות', 'תרגילים', 'ביצוע'];
const statColors = ['text-primary-400', 'text-secondary-400', 'text-tertiary-400', 'text-amber-500'];

export default function CelebrationScreen({ stats, onClose }) {
  const [show, setShow] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
    const t = setTimeout(() => setStatsVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  const shapes = ['square', 'rect', 'circle'];
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    color: confettiColors[i % confettiColors.length],
    delay: Math.random() * 1,
    left: Math.random() * 100,
    size: 4 + Math.random() * 6,
    shape: shapes[i % shapes.length],
  }));

  const statValues = [stats.totalSets, stats.duration, stats.exercises, `${stats.completion}%`];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ background: 'radial-gradient(ellipse at center, rgba(255, 107, 74, 0.04) 0%, #F5F7FA 70%)' }}
    >
      {/* Dot pattern background */}
      <div className="absolute inset-0 bg-dots-primary opacity-20 pointer-events-none" />

      {confettiPieces.map((piece, i) => (
        <ConfettiPiece key={i} {...piece} />
      ))}

      <div className="text-center px-8 relative z-10">
        {/* Trophy with glow */}
        <div className="relative inline-block mb-6 animate-slide-up">
          <div className="absolute inset-0 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(255,107,74,0.15) 0%, transparent 70%)', transform: 'scale(2)' }} />
          <div className="relative w-24 h-24 mx-auto rounded-full gradient-energy flex items-center justify-center shadow-primary">
            <svg width="48" height="48" viewBox="0 0 24 24" className="text-white">
              <path d="M6 4h12v2a6 6 0 01-12 0V4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M12 12v3M9 18h6M10 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <path d="M6 4H4v3a3 3 0 003 3M18 4h2v3a3 3 0 01-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
        </div>

        <h1 className="text-[34px] font-extrabold text-txt-primary mb-1.5 animate-slide-up font-heading" style={{ animationDelay: '0.15s', opacity: 0 }}>כל הכבוד!</h1>
        <p className="text-txt-secondary text-[17px] mb-10 animate-slide-up" style={{ animationDelay: '0.25s', opacity: 0 }}>סיימת את האימון של היום</p>

        {/* Stats Grid */}
        <div className={`grid grid-cols-2 gap-3 mb-10 max-w-xs mx-auto transition-all duration-700 ${
          statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          {statValues.map((val, i) => (
            <div
              key={i}
              className="bg-surface rounded-3xl p-5 border border-border-light shadow-card"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2"
                style={{ backgroundColor: statIconData[i].bg }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ color: statIconData[i].color }}>
                  {statIconData[i].svg}
                </svg>
              </div>
              <p className={`text-[28px] font-extrabold tabular-nums font-heading ${statColors[i]}`}>{val}</p>
              <p className="text-[14px] text-txt-tertiary mt-1 font-semibold">{statLabels[i]}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className={`gradient-energy text-white font-extrabold py-4 px-14 rounded-3xl text-lg font-heading active:scale-[0.97] transition-all shadow-primary ${
            statsVisible ? 'animate-pulse-soft' : 'opacity-0'
          }`}
        >
          סגור
        </button>
      </div>
    </div>
  );
}
