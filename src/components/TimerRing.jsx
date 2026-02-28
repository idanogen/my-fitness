import React from 'react';
import ExerciseIcon from './ExerciseIcon';

export default function TimerRing({ timeLeft, totalTime, onSkip, onAdjust, nextExercise, currentExerciseName, exerciseCategory }) {
  const size = 240;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? timeLeft / totalTime : 0;
  const offset = circumference * (1 - progress);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center animate-fade-in" style={{ background: 'rgba(245, 247, 250, 0.96)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <p className="text-txt-secondary text-[17px] mb-8 font-semibold tracking-wide font-heading">מנוחה בין סטים</p>

      <div className="relative">
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 40px rgba(255, 107, 74, 0.1), 0 0 80px rgba(255, 107, 74, 0.05)' }} />

        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B4A" />
              <stop offset="50%" stopColor="#FF8066" />
              <stop offset="100%" stopColor="#FF8F6B" />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E8EBF0" strokeWidth={strokeWidth} fill="none" />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke="url(#timerGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
            style={{ filter: 'drop-shadow(0 0 8px rgba(255, 107, 74, 0.3))' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {currentExerciseName && (
            <div className="absolute opacity-15">
              <ExerciseIcon exerciseName={currentExerciseName} size={80} category={exerciseCategory || 'legs'} />
            </div>
          )}
          <span className="relative text-5xl font-extrabold tabular-nums text-txt-primary tracking-tight font-heading" dir="ltr">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* +/- 15s Buttons */}
      <div className="flex items-center gap-6 mt-8">
        <button
          onClick={() => onAdjust && onAdjust(-15)}
          className="w-12 h-12 rounded-2xl bg-surface border border-border-light text-txt-secondary text-[17px] font-bold font-heading flex items-center justify-center active:bg-surfaceHover transition-colors shadow-card"
          dir="ltr"
        >-15</button>
        <button
          onClick={onSkip}
          className="px-8 py-3 text-txt-secondary border border-border-medium rounded-full text-[17px] font-semibold font-heading active:bg-surfaceHover active:text-txt-primary transition-all shadow-card"
        >דלג</button>
        <button
          onClick={() => onAdjust && onAdjust(15)}
          className="w-12 h-12 rounded-2xl bg-surface border border-border-light text-txt-secondary text-[17px] font-bold font-heading flex items-center justify-center active:bg-surfaceHover transition-colors shadow-card"
          dir="ltr"
        >+15</button>
      </div>

      {/* Next exercise preview */}
      {nextExercise && (
        <div className="mt-8 text-center">
          <p className="text-[14px] text-txt-tertiary font-bold uppercase tracking-widest mb-1 font-heading">הבא בתור</p>
          <p className="text-[17px] text-txt-secondary font-medium">{nextExercise}</p>
        </div>
      )}
    </div>
  );
}
