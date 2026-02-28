import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { workoutPlan } from '../data/workoutPlan';
import { getDayOfWeek, getTodayString } from '../utils/dateUtils';
import {
  saveWorkout, getCurrentWorkout, saveCurrentWorkout, clearCurrentWorkout, getHistory,
} from '../utils/storage';
import TimerRing from '../components/TimerRing';
import CelebrationScreen from '../components/CelebrationScreen';
import ExerciseIcon, { getExerciseCategory } from '../components/ExerciseIcon';

const haptic = () => { if ('vibrate' in navigator) navigator.vibrate(40); };

export default function ActiveWorkout({ onFinish }) {
  const today = getDayOfWeek();
  const todayPlan = workoutPlan[today];
  const history = getHistory();

  const multiplier = useMemo(() => {
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
    if (total === 0) return 1;
    const pct = completed / total;
    if (pct >= 0.9) return 1.1;
    if (pct < 0.6) return 0.9;
    return 1;
  }, [history]);

  const adjustedExercises = useMemo(() =>
    todayPlan.exercises.map((ex) => ({
      ...ex,
      reps: !ex.isMax && !ex.isTime && !ex.isStretch ? Math.round(ex.reps * multiplier) : ex.reps,
    })), [todayPlan, multiplier]);

  const [exercises, setExercises] = useState(() => {
    const saved = getCurrentWorkout();
    if (saved && saved.date === getTodayString()) {
      return saved.exercises.map((savedEx, idx) => {
        const planEx = adjustedExercises[idx] || {};
        return { ...savedEx, muscles: savedEx.muscles || planEx.muscles || '', note: savedEx.note || planEx.note || '', howTo: savedEx.howTo || planEx.howTo || '', tips: savedEx.tips || planEx.tips || [] };
      });
    }
    return adjustedExercises.map((ex) => ({
      name: ex.name, isMax: !!ex.isMax, isTime: !!ex.isTime, isStretch: !!ex.isStretch,
      targetReps: ex.reps, perSide: !!ex.perSide, muscles: ex.muscles || '', note: ex.note || '',
      howTo: ex.howTo || '', tips: ex.tips || [],
      sets: Array.from({ length: ex.sets }, () => ({ completed: false, reps: ex.isMax ? 0 : ex.reps })),
    }));
  });

  const [startedAt] = useState(() => {
    const saved = getCurrentWorkout();
    return saved?.date === getTodayString() ? saved.startedAt : Date.now();
  });

  const [timerState, setTimerState] = useState({ timeLeft: 0, totalTime: 0, isRunning: false });
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationStats, setCelebrationStats] = useState(null);
  const [openGuide, setOpenGuide] = useState(-1);
  const [justCompleted, setJustCompleted] = useState(null);

  useEffect(() => {
    if (!timerState.isRunning || timerState.timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimerState((prev) => prev.timeLeft <= 1 ? { ...prev, timeLeft: 0, isRunning: false } : { ...prev, timeLeft: prev.timeLeft - 1 });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.timeLeft]);

  useEffect(() => {
    saveCurrentWorkout({ date: getTodayString(), startedAt, exercises });
  }, [exercises, startedAt]);

  const toggleSet = useCallback((exIdx, setIdx) => {
    setExercises((prev) => {
      const wasCompleted = prev[exIdx].sets[setIdx].completed;
      const next = prev.map((ex, ei) => ei !== exIdx ? ex : {
        ...ex, sets: ex.sets.map((s, si) => si !== setIdx ? s : { ...s, completed: !s.completed }),
      });
      if (!wasCompleted) {
        haptic();
        setJustCompleted({ exIdx, setIdx });
        setTimeout(() => setJustCompleted(null), 400);
        if (!prev[exIdx].isStretch) {
          const restTime = todayPlan.defaultRest || 0;
          if (restTime > 0) setTimerState({ timeLeft: restTime, totalTime: restTime, isRunning: true });
        }
      }
      return next;
    });
  }, [todayPlan]);

  const updateReps = useCallback((exIdx, setIdx, reps) => {
    setExercises((prev) => prev.map((ex, ei) => ei !== exIdx ? ex : {
      ...ex, sets: ex.sets.map((s, si) => si !== setIdx ? s : { ...s, reps: parseInt(reps, 10) || 0 }),
    }));
  }, []);

  const adjustTimer = useCallback((delta) => {
    setTimerState((prev) => {
      const newTime = Math.max(0, prev.timeLeft + delta);
      const newTotal = Math.max(prev.totalTime, newTime);
      return { ...prev, timeLeft: newTime, totalTime: newTotal, isRunning: newTime > 0 };
    });
  }, []);

  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = exercises.reduce((sum, ex) => sum + ex.sets.filter((s) => s.completed).length, 0);
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  const activeExIdx = exercises.findIndex(ex => ex.sets.some(s => !s.completed));

  const nextExerciseName = useMemo(() => {
    for (let i = 0; i < exercises.length; i++) {
      if (exercises[i].sets.some(s => !s.completed)) {
        for (let j = i + 1; j < exercises.length; j++) {
          if (exercises[j].sets.some(s => !s.completed)) return exercises[j].name;
        }
        return null;
      }
    }
    return null;
  }, [exercises]);

  const finishWorkout = () => {
    haptic();
    const duration = Math.round((Date.now() - startedAt) / 60000);
    setCelebrationStats({
      totalSets: completedSets, duration: Math.max(duration, 1),
      exercises: exercises.filter((ex) => ex.sets.some((s) => s.completed)).length,
      completion: Math.round(progress),
    });
    saveWorkout({
      date: getTodayString(), dayOfWeek: today, planTitle: todayPlan.title,
      exercises: exercises.map((ex) => ({ name: ex.name, sets: ex.sets })),
      completedAt: new Date().toISOString(), duration,
    });
    clearCurrentWorkout();
    setShowCelebration(true);
  };

  if (todayPlan.type === 'rest') {
    return (
      <div className="px-5 pt-14 pb-28 min-h-screen flex flex-col items-center justify-center">
        <div className="text-7xl mb-5">🧘</div>
        <h2 className="text-[28px] font-bold font-heading mb-2 text-txt-primary">יום מנוחה</h2>
        <p className="text-txt-tertiary text-[17px]">אפשר לעשות מתיחות קלות</p>
      </div>
    );
  }

  if (showCelebration && celebrationStats) {
    return <CelebrationScreen stats={celebrationStats} onClose={onFinish} />;
  }

  return (
    <div className="px-5 pt-12 pb-28 min-h-screen">
      {timerState.isRunning && timerState.timeLeft > 0 && (
        <TimerRing
          timeLeft={timerState.timeLeft} totalTime={timerState.totalTime}
          onSkip={() => setTimerState((p) => ({ ...p, timeLeft: 0, isRunning: false }))}
          onAdjust={adjustTimer} nextExercise={nextExerciseName}
          currentExerciseName={exercises[activeExIdx]?.name}
          exerciseCategory={exercises[activeExIdx] ? getExerciseCategory(exercises[activeExIdx], todayPlan.category) : 'legs'}
        />
      )}

      {/* Header */}
      <div className="mb-5">
        <p className="text-[14px] text-txt-tertiary font-bold uppercase tracking-widest font-heading">יום {todayPlan.dayName}</p>
        <h1 className="text-[28px] font-extrabold mt-0.5 font-heading text-txt-primary">{todayPlan.title}</h1>
        {multiplier !== 1 && (
          <p className="text-[15px] mt-1 font-semibold font-heading" style={{ color: multiplier > 1 ? '#0BB890' : '#F59E0B' }}>
            {multiplier > 1 ? '📈 עצימות מוגברת' : '📉 עצימות מופחתת'}
          </p>
        )}
      </div>

      {/* Progress */}
      <div className="mb-6 bg-surface rounded-3xl p-4 border border-border-light shadow-card">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[14px] text-txt-tertiary font-bold uppercase tracking-wider font-heading">התקדמות</span>
          <span className="text-[17px] text-primary-400 font-extrabold tabular-nums font-heading">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-base rounded-full overflow-hidden">
          <div className="h-full gradient-energy rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[14px] text-txt-tertiary tabular-nums">{completedSets} סטים</span>
          <span className="text-[14px] text-txt-tertiary tabular-nums">{totalSets} סה״כ</span>
        </div>
      </div>

      {/* Exercise List */}
      <div className="space-y-3">
        {exercises.map((ex, exIdx) => {
          const exCompleted = ex.sets.filter((s) => s.completed).length;
          const exTotal = ex.sets.length;
          const allDone = exCompleted === exTotal;
          const isActive = exIdx === activeExIdx && !allDone;
          const exCategory = getExerciseCategory(ex, todayPlan.category);
          const dotClass = exCategory === 'upper' ? 'bg-dots-secondary' : exCategory === 'stretch' ? 'bg-dots-tertiary' : exCategory === 'core' ? 'bg-dots-primary' : 'bg-dots-primary';

          return (
            <div
              key={exIdx}
              className={`relative overflow-hidden rounded-3xl p-4 border transition-all duration-300 animate-fade-in shadow-card ${
                allDone
                  ? 'bg-secondary-50 border-secondary-200/50'
                  : isActive
                    ? 'bg-surface border-primary-200/60 shadow-card-hover border-r-[3px] border-r-primary-400'
                    : 'bg-surface border-border-light'
              }`}
              style={{ animationDelay: `${exIdx * 0.06}s`, opacity: 0 }}
            >
              {isActive && <div className={`absolute inset-0 ${dotClass} opacity-30 pointer-events-none`} />}
              <div className="relative flex gap-3 items-start mb-3">
                <div className={`transition-opacity duration-300 ${allDone ? 'opacity-40' : ''}`}>
                  <ExerciseIcon exerciseName={ex.name} size={isActive ? 72 : 48} category={exCategory} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-[17px] font-heading ${allDone ? 'text-secondary-500' : 'text-txt-primary'}`}>
                      {ex.name}
                    </h3>
                    {allDone && <span className="text-[14px] bg-secondary-100 text-secondary-500 px-1.5 py-0.5 rounded font-bold">✓</span>}
                  </div>
                  <p className="text-[15px] text-txt-tertiary mt-0.5">
                    {ex.isStretch ? 'מתיחה' : ex.isMax ? `${exTotal} סטים × מקסימום` : ex.isTime ? `${exTotal} × ${ex.targetReps} שניות` : `${exTotal} × ${ex.targetReps} חזרות`}
                    {ex.perSide ? ' (כל צד)' : ''}
                  </p>
                  {ex.muscles && <p className="text-[14px] text-txt-tertiary mt-0.5">{ex.muscles}</p>}
                  {(ex.howTo || ex.tips?.length > 0) && (
                    <button
                      onClick={() => setOpenGuide(openGuide === exIdx ? -1 : exIdx)}
                      className={`text-[14px] font-semibold mt-1.5 transition-colors font-heading ${openGuide === exIdx ? 'text-primary-400' : 'text-txt-tertiary'}`}
                    >{openGuide === exIdx ? '▲ הסתר' : '📖 איך מבצעים?'}</button>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[15px] text-txt-secondary font-bold tabular-nums font-heading">{exCompleted}/{exTotal}</span>
                  <div className="w-12 h-1.5 bg-base rounded-full overflow-hidden">
                    <div className="h-full gradient-energy rounded-full transition-all duration-300" style={{ width: `${exTotal > 0 ? (exCompleted / exTotal) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>

              {/* Guide */}
              <div className={`transition-all duration-300 overflow-hidden ${openGuide === exIdx ? 'max-h-[500px] opacity-100 mb-3' : 'max-h-0 opacity-0'}`}>
                <div className="bg-base rounded-2xl p-3 border border-border-light">
                  {ex.howTo && (
                    <div className="mb-2">
                      <p className="text-[14px] text-primary-400 font-bold uppercase tracking-wider mb-1 font-heading">📖 ביצוע</p>
                      <p className="text-[15px] text-txt-secondary leading-[1.65] whitespace-pre-line">{ex.howTo}</p>
                    </div>
                  )}
                  {ex.tips?.length > 0 && (
                    <div>
                      <p className="text-[14px] text-warning font-bold uppercase tracking-wider mb-1 font-heading">💡 טיפים</p>
                      <ul className="space-y-0.5">
                        {(ex.tips || []).map((tip, ti) => (
                          <li key={ti} className="flex items-start gap-1.5 text-[15px] text-txt-secondary leading-relaxed">
                            <span className="text-warning/50 shrink-0">•</span><span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Set Buttons */}
              <div className="flex gap-2.5 flex-wrap">
                {ex.sets.map((set, setIdx) => {
                  const isJustDone = justCompleted?.exIdx === exIdx && justCompleted?.setIdx === setIdx;
                  return (
                    <div key={setIdx} className="flex flex-col items-center gap-1.5">
                      <button
                        onClick={() => toggleSet(exIdx, setIdx)}
                        className={`w-[52px] h-[52px] rounded-2xl border-2 transition-all duration-200 flex items-center justify-center font-bold font-heading active:scale-90 ${
                          set.completed
                            ? 'gradient-energy border-primary-500/30 text-white shadow-primary'
                            : 'border-border-medium text-txt-tertiary active:border-primary-200 bg-surface'
                        }`}
                      >
                        {set.completed ? (
                          <svg className={`w-5 h-5 ${isJustDone ? 'animate-check-pop' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-[17px]">{setIdx + 1}</span>
                        )}
                      </button>
                      {ex.isMax && (
                        <input
                          type="number" inputMode="numeric" value={set.reps || ''}
                          onChange={(e) => updateReps(exIdx, setIdx, e.target.value)}
                          placeholder="0" dir="ltr"
                          className="w-[52px] text-center bg-base border border-border-light rounded-xl text-[15px] py-1.5 text-txt-secondary placeholder:text-txt-tertiary/50 focus:border-primary-300 focus:outline-none transition-colors"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Finish */}
      <button
        onClick={finishWorkout} disabled={completedSets === 0}
        className={`w-full mt-6 py-4 rounded-3xl text-lg font-extrabold font-heading transition-all active:scale-[0.97] ${
          completedSets > 0
            ? 'gradient-energy text-white shadow-primary'
            : 'bg-base text-txt-tertiary cursor-not-allowed border border-border-light'
        }`}
      >
        {completedSets > 0 ? '🏁 סיים אימון' : 'סמן לפחות סט אחד'}
      </button>
    </div>
  );
}
