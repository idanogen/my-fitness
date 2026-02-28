import React, { useState } from 'react';
import { workoutPlan } from '../data/workoutPlan';
import { exportData, resetAllData, getHistory } from '../utils/storage';
import { getDayOfWeek } from '../utils/dateUtils';
import ExerciseIcon, { getExerciseCategory } from '../components/ExerciseIcon';

function formatExerciseInfo(ex) {
  if (ex.isStretch) {
    if (ex.timeSeconds) return `${Math.round(ex.timeSeconds / 60)} דק׳`;
    if (ex.reps >= 60) return `${Math.round(ex.reps / 60)} דק׳`;
    return `${ex.reps} שנ׳`;
  }
  if (ex.isMax) return `${ex.sets}×max`;
  if (ex.isTime) return `${ex.sets}×${ex.reps}s`;
  const base = `${ex.sets}×${ex.reps}`;
  return ex.perSide ? `${base} /צד` : base;
}

function ExerciseCard({ ex, index, planCategory }) {
  const [showGuide, setShowGuide] = useState(false);
  const hasGuide = ex.howTo || (ex.tips && ex.tips.length > 0);
  const cat = getExerciseCategory(ex, planCategory);

  return (
    <div className="group">
      <button
        onClick={() => hasGuide && setShowGuide(!showGuide)}
        className={`w-full text-right flex items-start gap-3 py-1.5 rounded-2xl transition-colors ${hasGuide ? 'active:bg-surfaceHover' : ''}`}
        disabled={!hasGuide}
      >
        <ExerciseIcon exerciseName={ex.name} size={36} category={cat} />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline gap-2">
            <span className="text-[16px] text-txt-primary font-medium">{ex.name}</span>
            <span className="text-primary-400/70 text-[15px] tabular-nums font-bold shrink-0 font-heading" dir="ltr">
              {formatExerciseInfo(ex)}
            </span>
          </div>
          {ex.muscles && (
            <p className="text-[14px] text-txt-tertiary mt-0.5">🎯 {ex.muscles}</p>
          )}
          <div className="flex items-center gap-1.5 mt-0.5">
            {ex.note && (
              <p className="text-[14px] text-txt-tertiary">{ex.note}</p>
            )}
            {hasGuide && (
              <span className={`text-[14px] font-semibold transition-colors font-heading ${showGuide ? 'text-primary-400' : 'text-txt-tertiary'}`}>
                {showGuide ? '▲ הסתר' : '📖 איך מבצעים?'}
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Exercise Guide */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        showGuide ? 'max-h-[600px] opacity-100 mt-2' : 'max-h-0 opacity-0'
      }`}>
        <div className="mr-10 bg-base rounded-2xl p-3.5 border border-border-light">
          {ex.howTo && (
            <div className="mb-3">
              <p className="text-[14px] text-primary-400 font-bold uppercase tracking-wider mb-1.5 font-heading">📖 ביצוע</p>
              <p className="text-[15px] text-txt-secondary leading-[1.65] whitespace-pre-line">{ex.howTo}</p>
            </div>
          )}
          {ex.tips && ex.tips.length > 0 && (
            <div>
              <p className="text-[14px] text-warning font-bold uppercase tracking-wider mb-1.5 font-heading">💡 טיפים</p>
              <ul className="space-y-0.5">
                {ex.tips.map((tip, ti) => (
                  <li key={ti} className="flex items-start gap-1.5 text-[15px] text-txt-secondary leading-relaxed">
                    <span className="text-warning/50 shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Plan() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [expandedDay, setExpandedDay] = useState(getDayOfWeek());
  const history = getHistory();
  const today = getDayOfWeek();

  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    window.location.reload();
  };

  return (
    <div className="px-5 pt-12 pb-28 min-h-screen">
      {/* Header */}
      <div className="mb-6 animate-fade-in">
        <p className="text-[14px] text-txt-tertiary font-bold uppercase tracking-widest mb-1 font-heading">התוכנית שלי</p>
        <h1 className="text-[28px] font-extrabold tracking-tight font-heading text-txt-primary">תוכנית שבועית</h1>
        <p className="text-txt-tertiary text-[15px] mt-1">לחץ על יום לפירוט, ועל תרגיל להסבר</p>
      </div>

      <div className="space-y-3">
        {workoutPlan.map((day, i) => {
          const isExpanded = expandedDay === i;
          const isToday = today === i;
          const firstEx = day.exercises.find(e => !e.isStretch) || day.exercises[0];
          const dayCat = day.category || 'rest';

          return (
            <div
              key={i}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden animate-fade-in bg-surface shadow-card ${
                isToday ? 'border-primary-200 border-r-[3px] border-r-primary-400 shadow-card-hover' : 'border-border-light'
              }`}
              style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
            >
              {/* Day Header */}
              <button
                onClick={() => setExpandedDay(isExpanded ? -1 : i)}
                className="w-full p-4 text-right"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {firstEx ? (
                      <ExerciseIcon exerciseName={firstEx.name} size={40} category={firstEx ? getExerciseCategory(firstEx, dayCat) : dayCat} />
                    ) : (
                      <ExerciseIcon exerciseName="rest" size={40} category="rest" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] text-txt-tertiary font-bold uppercase tracking-wider font-heading">יום {day.dayName}</p>
                        {isToday && (
                          <span className="text-[13px] bg-primary-50 text-primary-400 font-bold px-1.5 py-0.5 rounded border border-primary-100 font-heading">היום</span>
                        )}
                      </div>
                      <h3 className="font-bold text-[17px] mt-0.5 text-txt-primary font-heading">{day.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {day.duration > 0 && (
                      <span className="text-[14px] text-txt-tertiary bg-base px-2.5 py-0.5 rounded-full font-semibold border border-border-light">
                        {day.duration} דק׳
                      </span>
                    )}
                    <svg
                      className={`w-4 h-4 text-txt-tertiary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Expanded Detail */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className={`relative px-4 pb-4 ${dayCat === 'upper' ? 'bg-dots-secondary' : dayCat === 'stretch' ? 'bg-dots-tertiary' : dayCat !== 'rest' ? 'bg-dots-primary' : ''} bg-clip-padding`} style={dayCat !== 'rest' ? { backgroundSize: '20px 20px' } : {}}>
                  {day.description && (
                    <p className="text-[15px] text-txt-secondary mb-3 pb-3 border-b border-border-light leading-relaxed">
                      {day.description}
                    </p>
                  )}

                  {day.exercises.length > 0 ? (
                    <div className="space-y-3">
                      {day.exercises.map((ex, j) => (
                        <ExerciseCard key={j} ex={ex} index={j} planCategory={dayCat} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-[17px] text-txt-tertiary">אין תרגילים — יום התאוששות</p>
                  )}

                  {day.type === 'workout' && (
                    <div className="flex gap-2 mt-4 pt-3 border-t border-border-light">
                      <span className="text-[14px] text-txt-tertiary bg-base px-2.5 py-1 rounded-xl font-semibold border border-border-light">
                        {day.category === 'legs' ? '🦵 רגליים' : '💪 פלג עליון'}
                      </span>
                      <span className="text-[14px] text-txt-tertiary bg-base px-2.5 py-1 rounded-xl font-semibold border border-border-light">
                        ⏱ מנוחה: {day.defaultRest}״
                      </span>
                      <span className="text-[14px] text-txt-tertiary bg-base px-2.5 py-1 rounded-xl font-semibold border border-border-light">
                        {day.exercises.filter(e => !e.isStretch).length} תרגילים
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Data Management */}
      <div className="mt-10 space-y-3 animate-fade-in stagger-7 opacity-0">
        <h2 className="text-[14px] font-bold text-txt-tertiary uppercase tracking-widest mb-2 font-heading">ניהול נתונים</h2>

        <div className="bg-surface rounded-3xl p-4 border border-border-light shadow-card flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-energy flex items-center justify-center text-white text-[17px] font-extrabold font-heading shadow-primary">{history.length}</div>
          <p className="text-[17px] text-txt-secondary font-medium">אימונים שמורים</p>
        </div>

        <button
          onClick={exportData}
          className="w-full bg-surface border border-border-light text-txt-secondary py-3.5 rounded-3xl text-[17px] font-semibold active:bg-surfaceHover transition-colors flex items-center justify-center gap-2 shadow-card"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          ייצוא נתונים (JSON)
        </button>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full bg-surface border border-red-200 text-red-400 py-3.5 rounded-3xl text-[17px] font-semibold active:bg-red-50 transition-colors"
          >
            איפוס כל הנתונים
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-4">
            <p className="text-[17px] text-red-500 mb-3 font-semibold font-heading">
              בטוח? כל הנתונים יימחקו לצמיתות
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-2xl text-[17px] font-bold active:bg-red-600 transition-colors"
              >
                כן, מחק
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-surface text-txt-secondary py-2.5 rounded-2xl text-[17px] font-medium border border-border-light"
              >
                ביטול
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
