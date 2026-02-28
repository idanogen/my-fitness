import React from 'react';

export default function HeatMap({ history }) {
  const today = new Date();
  const weeks = 13;
  const days = [];

  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const hasWorkout = history.some((h) => h.date === dateStr);
    days.push({ date: dateStr, completed: hasWorkout, dayOfWeek: date.getDay() });
  }

  const weekGroups = [];
  let currentWeek = [];
  for (const day of days) {
    if (day.dayOfWeek === 0 && currentWeek.length > 0) {
      weekGroups.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  }
  if (currentWeek.length > 0) weekGroups.push(currentWeek);

  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="flex gap-[3px] justify-end min-w-fit" dir="ltr">
        {weekGroups.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }, (_, dayIdx) => {
              const day = week.find((d) => d.dayOfWeek === dayIdx);
              if (!day) {
                return <div key={dayIdx} className="w-[13px] h-[13px]" />;
              }
              const isToday = day.date === new Date().toISOString().split('T')[0];
              return (
                <div
                  key={dayIdx}
                  className={`w-[13px] h-[13px] rounded-[3px] transition-all duration-300 ${
                    day.completed
                      ? 'gradient-energy shadow-sm shadow-primary-200/30'
                      : 'bg-base border border-border-light'
                  } ${isToday ? 'ring-1 ring-primary-300 ring-offset-1 ring-offset-surface' : ''}`}
                  title={`${day.date}${day.completed ? ' ✓' : ''}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
