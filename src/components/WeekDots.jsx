import React from 'react';
import { hebrewDays } from '../utils/dateUtils';

export default function WeekDots({ completedDays, restDays, today }) {
  return (
    <div className="flex justify-between items-center gap-1">
      {[0, 1, 2, 3, 4, 5, 6].map((day) => {
        const isToday = day === today;
        const isCompleted = completedDays.includes(day);
        const isRest = restDays.includes(day);
        const isPast = day < today;

        let dotClass = 'bg-dark-border';
        if (isCompleted) dotClass = 'bg-accent-green';
        else if (isRest && isPast) dotClass = 'bg-gray-700';
        else if (isRest) dotClass = 'bg-gray-800';
        else if (isPast) dotClass = 'bg-red-900/40';

        return (
          <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-[14px] text-gray-600 font-medium">{hebrewDays[day]}</span>
            <div
              className={`w-9 h-9 rounded-full ${dotClass} flex items-center justify-center transition-all duration-300 ${
                isToday ? 'ring-[2.5px] ring-accent-green/70 ring-offset-2 ring-offset-dark-card' : ''
              }`}
            >
              {isCompleted && (
                <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {isRest && !isCompleted && (
                <span className="text-[14px] text-gray-500">—</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
