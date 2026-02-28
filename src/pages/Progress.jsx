import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LineChart, Line, Tooltip } from 'recharts';
import { getHistory } from '../utils/storage';
import { workoutPlan } from '../data/workoutPlan';
import { formatDate } from '../utils/dateUtils';
import HeatMap from '../components/HeatMap';

export default function Progress() {
  const history = getHistory();

  const weeklyData = useMemo(() => {
    const weeks = [];
    const today = new Date();

    for (let w = 7; w >= 0; w--) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() - w * 7);

      let completed = 0;
      let total = 0;

      for (let d = 0; d < 7; d++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + d);
        const dayOfWeek = date.getDay();
        const plan = workoutPlan[dayOfWeek];
        if (plan.type !== 'rest') {
          total++;
          const dateStr = date.toISOString().split('T')[0];
          if (history.some((h) => h.date === dateStr)) {
            completed++;
          }
        }
      }

      weeks.push({
        name: `${weekStart.getDate()}/${weekStart.getMonth() + 1}`,
        completed,
        total,
        pct: total > 0 ? Math.round((completed / total) * 100) : 0,
      });
    }

    return weeks;
  }, [history]);

  const records = useMemo(() => {
    const recordMap = {};

    history.forEach((workout) => {
      workout.exercises?.forEach((ex) => {
        ex.sets?.forEach((set) => {
          if (set.completed && set.reps > 0) {
            if (!recordMap[ex.name] || set.reps > recordMap[ex.name].reps) {
              recordMap[ex.name] = {
                reps: set.reps,
                date: workout.date,
              };
            }
          }
        });
      });
    });

    return Object.entries(recordMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.reps - a.reps);
  }, [history]);

  const totalWorkouts = history.length;
  const totalThisMonth = useMemo(() => {
    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return history.filter((h) => h.date.startsWith(monthStr)).length;
  }, [history]);

  const avgDuration = useMemo(() => {
    if (history.length === 0) return 0;
    const total = history.reduce((sum, h) => sum + (h.duration || 0), 0);
    return Math.round(total / history.length);
  }, [history]);

  const runs = useMemo(() => history.filter((h) => h.type === 'run' && h.run), [history]);

  const runStats = useMemo(() => {
    if (runs.length === 0) return null;
    const totalKm = runs.reduce((sum, h) => sum + (h.run.distanceKm || 0), 0);
    const avgPace = runs.reduce((sum, h) => sum + (h.run.paceMinPerKm || 0), 0) / runs.length;
    const maxKm = Math.max(...runs.map((h) => h.run.distanceKm || 0));
    const paceMin = Math.floor(avgPace);
    const paceSec = Math.round((avgPace - paceMin) * 60);
    return {
      totalKm: totalKm.toFixed(1),
      avgPace: `${paceMin}:${String(paceSec).padStart(2, '0')}`,
      count: runs.length,
      longestKm: maxKm.toFixed(1),
    };
  }, [runs]);

  const weeklyKmData = useMemo(() => {
    if (runs.length === 0) return [];
    const weeks = [];
    const today = new Date();
    for (let w = 7; w >= 0; w--) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() - w * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      let km = 0;
      runs.forEach((h) => {
        const d = new Date(h.date);
        if (d >= weekStart && d <= weekEnd) {
          km += h.run.distanceKm || 0;
        }
      });
      weeks.push({
        name: `${weekStart.getDate()}/${weekStart.getMonth() + 1}`,
        km: Math.round(km * 10) / 10,
      });
    }
    return weeks;
  }, [runs]);

  const paceTrendData = useMemo(() => {
    if (runs.length === 0) return [];
    return [...runs]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-20)
      .map((h) => {
        const [y, m, d] = h.date.split('-');
        return {
          name: `${d}/${m}`,
          pace: Math.round(h.run.paceMinPerKm * 100) / 100,
        };
      });
  }, [runs]);

  return (
    <div className="px-5 pt-12 pb-28 min-h-screen">
      {/* Header */}
      <div className="mb-6 animate-fade-in">
        <p className="text-[14px] text-txt-tertiary font-bold uppercase tracking-widest mb-1 font-heading">סטטיסטיקות</p>
        <h1 className="text-[28px] font-extrabold tracking-tight font-heading text-txt-primary">התקדמות</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="bg-surface rounded-3xl p-4 border border-border-light shadow-card animate-fade-in">
          <div className="w-8 h-8 rounded-xl gradient-energy flex items-center justify-center mb-2 shadow-sm shadow-primary-200/30">
            <span className="text-[17px]">🔥</span>
          </div>
          <p className="text-[28px] font-extrabold text-primary-400 tabular-nums font-heading">{totalWorkouts}</p>
          <p className="text-[14px] text-txt-tertiary mt-0.5 font-semibold">סה״כ אימונים</p>
        </div>
        <div className="bg-surface rounded-3xl p-4 border border-border-light shadow-card animate-fade-in stagger-1 opacity-0">
          <div className="w-8 h-8 rounded-xl gradient-calm flex items-center justify-center mb-2 shadow-sm shadow-secondary-200/30">
            <span className="text-[17px]">📅</span>
          </div>
          <p className="text-[28px] font-extrabold text-secondary-400 tabular-nums font-heading">{totalThisMonth}</p>
          <p className="text-[14px] text-txt-tertiary mt-0.5 font-semibold">החודש</p>
        </div>
        <div className="bg-surface rounded-3xl p-4 border border-border-light shadow-card animate-fade-in stagger-2 opacity-0">
          <div className="w-8 h-8 rounded-xl bg-tertiary-100 flex items-center justify-center mb-2">
            <span className="text-[17px]">⏱</span>
          </div>
          <p className="text-[28px] font-extrabold text-tertiary-400 tabular-nums font-heading">{avgDuration}<span className="text-[17px] text-txt-tertiary">׳</span></p>
          <p className="text-[14px] text-txt-tertiary mt-0.5 font-semibold">דק׳ ממוצע</p>
        </div>
      </div>

      {/* Weekly Bar Chart */}
      <div className="bg-surface rounded-3xl p-5 mb-4 border border-border-light shadow-card animate-fade-in stagger-3 opacity-0">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[14px] text-txt-tertiary font-bold uppercase tracking-widest font-heading">אימונים לפי שבוע</h3>
          <span className="text-[14px] text-txt-tertiary font-semibold">8 שבועות</span>
        </div>
        <div className="h-44" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} barCategoryGap="20%">
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8E95A9', fontSize: 10, fontWeight: 600 }}
              />
              <YAxis hide domain={[0, 5]} />
              <Bar dataKey="completed" radius={[8, 8, 0, 0]}>
                {weeklyData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.pct >= 80 ? '#FF6B4A' : entry.pct >= 50 ? '#F59E0B' : '#D1D5DE'}
                    fillOpacity={index === weeklyData.length - 1 ? 1 : 0.7}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-surface rounded-3xl p-5 mb-4 border border-border-light shadow-card animate-fade-in stagger-4 opacity-0">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[14px] text-txt-tertiary font-bold uppercase tracking-widest font-heading">מפת פעילות</h3>
          <span className="text-[14px] text-txt-tertiary font-semibold">3 חודשים</span>
        </div>
        <HeatMap history={history} />
      </div>

      {/* Run Analytics */}
      {runs.length > 0 && (
        <>
          {/* Run Section Header */}
          <div className="flex items-center gap-2 mb-3 mt-2 animate-fade-in">
            <span className="text-lg">🏃</span>
            <h2 className="text-[14px] text-txt-tertiary font-bold uppercase tracking-widest font-heading">ריצה</h2>
          </div>

          {/* Run Summary Cards */}
          <div className="grid grid-cols-2 gap-2.5 mb-4 animate-fade-in">
            <div className="bg-surface rounded-3xl p-4 border border-border-light shadow-card">
              <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center mb-2">
                <span className="text-[17px]">🛣️</span>
              </div>
              <p className="text-[28px] font-extrabold text-teal-500 tabular-nums font-heading">{runStats.totalKm}</p>
              <p className="text-[14px] text-txt-tertiary mt-0.5 font-semibold">סה״כ ק״מ</p>
            </div>
            <div className="bg-surface rounded-3xl p-4 border border-border-light shadow-card">
              <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center mb-2">
                <span className="text-[17px]">⏱</span>
              </div>
              <p className="text-[28px] font-extrabold text-teal-500 tabular-nums font-heading">{runStats.avgPace}</p>
              <p className="text-[14px] text-txt-tertiary mt-0.5 font-semibold">קצב ממוצע</p>
            </div>
            <div className="bg-surface rounded-3xl p-4 border border-border-light shadow-card">
              <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center mb-2">
                <span className="text-[17px]">🏃</span>
              </div>
              <p className="text-[28px] font-extrabold text-teal-500 tabular-nums font-heading">{runStats.count}</p>
              <p className="text-[14px] text-txt-tertiary mt-0.5 font-semibold">מספר ריצות</p>
            </div>
            <div className="bg-surface rounded-3xl p-4 border border-border-light shadow-card">
              <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center mb-2">
                <span className="text-[17px]">🏅</span>
              </div>
              <p className="text-[28px] font-extrabold text-teal-500 tabular-nums font-heading">{runStats.longestKm}<span className="text-[14px] text-txt-tertiary"> ק״מ</span></p>
              <p className="text-[14px] text-txt-tertiary mt-0.5 font-semibold">ריצה ארוכה</p>
            </div>
          </div>

          {/* Weekly Km Bar Chart */}
          <div className="bg-surface rounded-3xl p-5 mb-4 border border-border-light shadow-card animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[14px] text-txt-tertiary font-bold uppercase tracking-widest font-heading">ק״מ לפי שבוע</h3>
              <span className="text-[14px] text-txt-tertiary font-semibold">8 שבועות</span>
            </div>
            <div className="h-44" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyKmData} barCategoryGap="20%">
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8E95A9', fontSize: 10, fontWeight: 600 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    formatter={(value) => [`${value} ק״מ`, '']}
                    contentStyle={{ borderRadius: 12, border: 'none', fontSize: 13 }}
                  />
                  <Bar dataKey="km" radius={[8, 8, 0, 0]}>
                    {weeklyKmData.map((_, index) => (
                      <Cell
                        key={index}
                        fill="#0BB890"
                        fillOpacity={index === weeklyKmData.length - 1 ? 1 : 0.7}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pace Trend Line Chart */}
          {paceTrendData.length >= 2 && (
            <div className="bg-surface rounded-3xl p-5 mb-4 border border-border-light shadow-card animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[14px] text-txt-tertiary font-bold uppercase tracking-widest font-heading">מגמת קצב</h3>
                <span className="text-[14px] text-txt-tertiary font-semibold">{paceTrendData.length} ריצות</span>
              </div>
              <div className="h-44" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={paceTrendData}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#8E95A9', fontSize: 10, fontWeight: 600 }}
                    />
                    <YAxis
                      hide
                      reversed
                      domain={['dataMin - 0.5', 'dataMax + 0.5']}
                    />
                    <Tooltip
                      formatter={(value) => {
                        const m = Math.floor(value);
                        const s = Math.round((value - m) * 60);
                        return [`${m}:${String(s).padStart(2, '0')} /ק״מ`, 'קצב'];
                      }}
                      contentStyle={{ borderRadius: 12, border: 'none', fontSize: 13 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pace"
                      stroke="#0BB890"
                      strokeWidth={2.5}
                      dot={{ fill: '#0BB890', r: 4 }}
                      activeDot={{ r: 6, fill: '#0BB890' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}

      {/* Personal Records */}
      {records.length > 0 && (
        <div className="bg-surface rounded-3xl p-5 border border-border-light shadow-card animate-fade-in stagger-5 opacity-0">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🏆</span>
            <h3 className="text-[14px] text-txt-tertiary font-bold uppercase tracking-widest font-heading">שיאים אישיים</h3>
          </div>
          <div className="space-y-2">
            {records.map((record, i) => (
              <div key={i} className="flex justify-between items-center py-2.5 px-3 rounded-2xl bg-base border border-border-light/50">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[14px] font-extrabold tabular-nums w-6 h-6 rounded-lg flex items-center justify-center font-heading ${
                    i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-gray-100 text-gray-500' : i === 2 ? 'bg-orange-100 text-orange-500' : 'bg-base text-txt-tertiary'
                  }`}>{i + 1}</span>
                  <span className="text-[16px] text-txt-primary font-medium">{record.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[17px] font-extrabold text-primary-400 tabular-nums font-heading">{record.reps}</span>
                  <span className="text-[14px] text-txt-tertiary font-medium">{formatDate(record.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {history.length === 0 && (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center">
            <span className="text-4xl">📊</span>
          </div>
          <p className="text-txt-primary font-bold text-[18px] font-heading">עוד אין נתונים</p>
          <p className="text-txt-tertiary text-[17px] mt-2 max-w-[200px] mx-auto leading-relaxed">תתחיל להתאמן ותראה את ההתקדמות כאן</p>
        </div>
      )}
    </div>
  );
}
