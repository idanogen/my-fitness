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

const statIcons = ['🔥', '⏱', '🏋️', '📈'];
const statLabels = ['סטים הושלמו', 'דקות', 'תרגילים', 'ביצוע'];
const statColors = ['text-primary-400', 'text-secondary-400', 'text-tertiary-400', 'text-primary-400'];

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
      {confettiPieces.map((piece, i) => (
        <ConfettiPiece key={i} {...piece} />
      ))}

      <div className="text-center px-8 relative z-10">
        {/* Trophy with glow */}
        <div className="relative inline-block mb-6 animate-slide-up">
          <div className="absolute inset-0 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(255,107,74,0.15) 0%, transparent 70%)', transform: 'scale(2)' }} />
          <div className="relative w-24 h-24 mx-auto rounded-full gradient-energy flex items-center justify-center shadow-primary">
            <span className="text-5xl">💪</span>
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
              <span className="text-lg mb-1 block">{statIcons[i]}</span>
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
