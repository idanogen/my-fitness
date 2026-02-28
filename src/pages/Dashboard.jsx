import React, { useMemo, useState, useCallback } from 'react';
import { workoutPlan } from '../data/workoutPlan';
import { quotes } from '../data/quotes';
import { getDayOfWeek, getTodayString, hebrewDays } from '../utils/dateUtils';
import { getHistory } from '../utils/storage';
import LogRunModal from '../components/LogRunModal';

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

export default function Dashboard({ onStartWorkout }) {
  const [showRunModal, setShowRunModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRunSaved = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const today = getDayOfWeek();
  const todayPlan = workoutPlan[today];
  const history = getHistory();
  const todayStr = getTodayString();
  const todayCompleted = history.some((h) => h.date === todayStr);

  const streak = useMemo(() => {
    let count = 0;
    const d = new Date();
    if (!todayCompleted && todayPlan.type !== 'rest') d.setDate(d.getDate() - 1);
    for (let i = 0; i < 365; i++) {
      const dateStr = d.toISOString().split('T')[0];
      const plan = workoutPlan[d.getDay()];
      if (plan.type === 'rest') { d.setDate(d.getDate() - 1); continue; }
      if (history.some((h) => h.date === dateStr)) { count++; d.setDate(d.getDate() - 1); } else break;
    }
    return count;
  }, [history, todayCompleted, todayPlan.type]);

  const weekData = useMemo(() => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const plan = workoutPlan[i];
      return {
        day: i,
        completed: history.some((h) => h.date === dateStr),
        isRest: plan.type === 'rest',
        isToday: i === today,
        isPast: i < today,
      };
    });
  }, [history, today]);

  const completedThisWeek = weekData.filter(d => d.completed).length;
  const totalWorkoutDays = weekData.filter(d => !d.isRest).length;

  const quote = useMemo(() => {
    const seed = parseInt(todayStr.replace(/-/g, ''), 10);
    return quotes[seed % quotes.length];
  }, [todayStr]);

  const adjustment = useMemo(() => {
    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 7 - lastWeekStart.getDay());
    let total = 0, completed = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(lastWeekStart);
      d.setDate(d.getDate() + i);
      if (workoutPlan[d.getDay()].type !== 'rest') {
        total++;
        if (history.some((h) => h.date === d.toISOString().split('T')[0])) completed++;
      }
    }
    if (total === 0) return null;
    const pct = completed / total;
    if (pct >= 0.9) return { type: 'increase', message: 'שבוע מעולה! העצימות עלתה ב-10%' };
    if (pct < 0.6) return { type: 'decrease', message: 'שבוע קשה? הפחתנו קצת את העצימות' };
    return null;
  }, [history]);

  const upcomingDays = useMemo(() => {
    const upcoming = [];
    for (let offset = 1; offset <= 7 && upcoming.length < 2; offset++) {
      const plan = workoutPlan[(today + offset) % 7];
      if (plan.type !== 'rest') upcoming.push(plan);
    }
    return upcoming;
  }, [today]);

  const dayTypeIcons = { rest: '🧘', workout: '💪', stretch: '🤸' };

  return (
    <div className="px-5 pt-12 pb-28 min-h-screen">
      {/* Greeting */}
      <div className="mb-7 animate-fade-in">
        <p className="text-txt-tertiary text-[15px] font-semibold uppercase tracking-widest mb-1 font-heading">יום {todayPlan.dayName}</p>
        <h1 className="text-[34px] font-extrabold tracking-tight leading-tight font-heading text-txt-primary">שלום 👋</h1>
      </div>

      {/* Adjustment Banner */}
      {adjustment && (
        <div className={`mb-5 p-4 rounded-3xl animate-fade-in stagger-1 opacity-0 shadow-card ${
          adjustment.type === 'increase'
            ? 'bg-secondary-50 border border-secondary-200/50'
            : 'bg-orange-50 border border-orange-200/50'
        }`}>
          <p className={`text-[17px] font-semibold font-heading ${adjustment.type === 'increase' ? 'text-secondary-500' : 'text-orange-600'}`}>
            {adjustment.type === 'increase' ? '📈' : '📉'} {adjustment.message}
          </p>
        </div>
      )}

      {/* Streak + Week Stats Row */}
      <div className="flex gap-3 mb-5 animate-fade-in stagger-1 opacity-0">
        {/* Streak Card */}
        <div className="flex-1 relative overflow-hidden bg-surface rounded-3xl p-4 border border-border-light shadow-card">
          <div className="absolute -top-8 -left-8 w-24 h-24 bg-primary-100/60 rounded-full blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl gradient-energy flex items-center justify-center shadow-primary">
              <span className="text-lg">🔥</span>
            </div>
            <div>
              <p className="text-[28px] font-extrabold text-primary-400 tabular-nums leading-none font-heading">{streak}</p>
              <p className="text-[15px] text-txt-tertiary font-semibold mt-0.5">ימים ברצף</p>
            </div>
          </div>
        </div>

        {/* This Week Summary */}
        <div className="w-28 bg-surface rounded-3xl p-4 border border-border-light shadow-card flex flex-col items-center justify-center">
          <p className="text-[28px] font-extrabold text-txt-primary tabular-nums leading-none font-heading">{completedThisWeek}<span className="text-txt-tertiary text-[18px]">/{totalWorkoutDays}</span></p>
          <p className="text-[15px] text-txt-tertiary font-semibold mt-1">השבוע</p>
        </div>
      </div>

      {/* Week Progress — Segmented Bar */}
      <div className="mb-5 bg-surface rounded-3xl p-4 border border-border-light shadow-card animate-fade-in stagger-2 opacity-0">
        <div className="flex items-center justify-between mb-2.5">
          {weekData.map((d) => (
            <span key={d.day} className={`text-[14px] font-bold flex-1 text-center font-heading ${d.isToday ? 'text-primary-400' : 'text-txt-tertiary'}`}>
              {hebrewDays[d.day]}
            </span>
          ))}
        </div>
        <div className="flex gap-1.5 h-2.5">
          {weekData.map((d) => (
            <div key={d.day} className={`flex-1 rounded-full transition-all duration-500 ${
              d.completed
                ? 'gradient-energy shadow-sm shadow-primary-200/40'
                : d.isToday
                  ? 'bg-primary-100 animate-shimmer'
                  : d.isRest
                    ? 'bg-base'
                    : d.isPast
                      ? 'bg-red-100'
                      : 'bg-border-light'
            }`} />
          ))}
        </div>
      </div>

      {/* Today's Workout Card */}
      <div className="relative overflow-hidden bg-surface rounded-4xl p-5 mb-5 border border-border-light shadow-card-lg animate-fade-in stagger-3 opacity-0">
        <div className="gradient-subtle absolute inset-0 rounded-4xl pointer-events-none" />
        <div className="relative">
          <div className="flex justify-between items-start mb-1">
            <div>
              <p className="text-[14px] text-primary-400 font-bold uppercase tracking-widest font-heading">אימון היום</p>
              <h2 className="text-xl font-extrabold mt-1 font-heading text-txt-primary">
                {dayTypeIcons[todayPlan.type]} {todayPlan.title}
              </h2>
              {todayPlan.description && (
                <p className="text-[15px] text-txt-secondary mt-1 leading-relaxed">{todayPlan.description}</p>
              )}
            </div>
            {todayCompleted && (
              <div className="bg-secondary-50 text-secondary-500 text-[14px] font-bold px-3 py-1.5 rounded-full border border-secondary-200/50 shrink-0 font-heading">✓ הושלם</div>
            )}
          </div>

          {todayPlan.duration > 0 && (
            <div className="flex items-center gap-4 mt-3 mb-4">
              <div className="flex items-center gap-1.5 text-[15px] text-txt-secondary">
                <svg className="w-3.5 h-3.5 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {todayPlan.duration} דק׳
              </div>
              <div className="flex items-center gap-1.5 text-[15px] text-txt-secondary">
                <svg className="w-3.5 h-3.5 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 6h16M4 12h10M4 18h6"/></svg>
                {todayPlan.exercises.filter(e => !e.isStretch).length} תרגילים
              </div>
              {todayPlan.defaultRest > 0 && (
                <div className="flex items-center gap-1.5 text-[15px] text-txt-secondary">
                  <svg className="w-3.5 h-3.5 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 3v18"/><path d="M19 3v18"/><path d="M5 12h14"/></svg>
                  מנוחה {todayPlan.defaultRest}״
                </div>
              )}
            </div>
          )}

          {todayPlan.exercises.length > 0 && (
            <div className="space-y-1">
              {todayPlan.exercises.map((ex, i) => (
                <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-2xl hover:bg-surfaceHover transition-colors">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-[14px] font-bold shrink-0 ${
                    ex.isStretch ? 'bg-tertiary-50 text-tertiary-400' : 'bg-primary-50 text-primary-400'
                  }`}>
                    {ex.isStretch ? '~' : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[16px] text-txt-primary font-medium">{ex.name}</span>
                    {ex.muscles && <span className="text-[14px] text-txt-tertiary mr-2"> · {ex.muscles}</span>}
                  </div>
                  <span className="text-primary-400/70 text-[15px] tabular-nums font-bold shrink-0 font-heading" dir="ltr">
                    {formatExerciseInfo(ex)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {todayPlan.exercises.length === 0 && (
            <p className="text-txt-tertiary text-[17px] mt-3">אין תרגילים — יום מנוחה והתאוששות</p>
          )}
        </div>
      </div>

      {/* CTA Button */}
      {!todayCompleted && todayPlan.type !== 'rest' && (
        <button
          onClick={onStartWorkout}
          className="w-full gradient-energy text-white font-extrabold py-4 rounded-3xl text-lg animate-pulse-soft animate-fade-in stagger-4 opacity-0 active:scale-[0.97] transition-transform shadow-primary font-heading"
        >
          {todayPlan.type === 'stretch' ? '🤸 התחל מתיחות' : '💪 התחל אימון'}
        </button>
      )}

      {todayPlan.type === 'rest' && !todayCompleted && (
        <div className="text-center py-6 animate-fade-in stagger-4 opacity-0">
          <p className="text-txt-secondary text-[17px]">יום מנוחה — תנוח, מגיע לך 💆</p>
        </div>
      )}

      {/* Upcoming Workouts */}
      {upcomingDays.length > 0 && (
        <div className="mt-7 animate-fade-in stagger-5 opacity-0">
          <h3 className="text-[14px] text-txt-tertiary font-bold uppercase tracking-widest mb-3 font-heading">בקרוב</h3>
          <div className="space-y-2.5">
            {upcomingDays.map((day, i) => (
              <div key={i} className="bg-surface rounded-3xl p-4 border border-border-light shadow-card flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl gradient-calm flex items-center justify-center text-white font-extrabold text-[17px] shrink-0 shadow-teal font-heading">
                  {day.dayName.slice(0, 1)}׳
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[16px] font-bold font-heading text-txt-primary">{day.title}</h4>
                  <p className="text-[15px] text-txt-tertiary mt-0.5 truncate">
                    {day.exercises.filter(e => !e.isStretch).map(e => e.name).join(' · ')}
                  </p>
                </div>
                <span className="text-[14px] text-txt-tertiary bg-base px-2.5 py-1 rounded-full shrink-0 font-semibold">{day.duration} דק׳</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quote */}
      <div className="mt-8 text-center animate-fade-in stagger-6 opacity-0">
        <div className="inline-block bg-surface rounded-3xl px-6 py-4 border border-border-light shadow-card">
          <p className="text-txt-secondary text-[16px] italic leading-relaxed">&ldquo;{quote}&rdquo;</p>
        </div>
      </div>

      {/* FAB — Log Run */}
      <button
        onClick={() => setShowRunModal(true)}
        className="fixed left-5 bottom-24 w-14 h-14 gradient-calm rounded-full shadow-teal flex items-center justify-center text-white text-2xl font-bold active:scale-90 transition-transform z-40"
        aria-label="רישום ריצה"
      >
        +
      </button>

      {/* Log Run Modal */}
      <LogRunModal
        open={showRunModal}
        onClose={() => setShowRunModal(false)}
        onSaved={handleRunSaved}
      />
    </div>
  );
}
