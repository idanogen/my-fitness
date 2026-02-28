import React from 'react';

const CATEGORY_COLORS = {
  legs:    { bg: '#FFF1ED', ring: '#FF6B4A' },
  upper:   { bg: '#E6FAF5', ring: '#0BB890' },
  stretch: { bg: '#F0ECFF', ring: '#7C5CFC' },
  core:    { bg: '#FFF8EB', ring: '#F59E0B' },
  rest:    { bg: '#F1F3F7', ring: '#8E95A9' },
};

/* ── 20 minimalist stick-figure SVGs (24×24 viewBox, stroke-based) ── */

const EXERCISE_SVGS = {
  squat: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v4" />
      <path d="M8 10h8" />
      <path d="M8 10l-2 6" />
      <path d="M16 10l2 6" />
      <path d="M9 14l-1 4h2" />
      <path d="M15 14l1 4h-2" />
    </g>
  ),
  lunge: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="12" cy="3.5" r="2" />
      <path d="M12 5.5v4.5" />
      <path d="M9 7l6 0" />
      <path d="M12 10l-4 5.5" />
      <path d="M8 15.5l-1.5 4" />
      <path d="M12 10l3 3" />
      <path d="M15 13l1.5 6" />
    </g>
  ),
  bridge: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="6" cy="14" r="1.5" />
      <path d="M7.5 14h3" />
      <path d="M10.5 14c0-3 3-5 6-5" />
      <path d="M16.5 9v5" />
      <path d="M10.5 14l1.5 4" />
      <path d="M14 14l1.5 4" />
    </g>
  ),
  deadlift: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7l0 3" />
      <path d="M12 10l-3.5-3" />
      <path d="M12 10l3.5-3" />
      <path d="M12 10l-2 5" />
      <path d="M10 15l-1 4" />
      <path d="M12 10l2 5" />
      <path d="M14 15l1 4" />
    </g>
  ),
  pullup: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M4 3h16" />
      <circle cx="12" cy="6.5" r="2" />
      <path d="M10 4.5l-2-1.5" />
      <path d="M14 4.5l2-1.5" />
      <path d="M12 8.5v5" />
      <path d="M12 13.5l-2.5 5" />
      <path d="M12 13.5l2.5 5" />
    </g>
  ),
  chinup: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M4 3h16" />
      <circle cx="12" cy="6.5" r="2" />
      <path d="M10.5 5l-1.5-2" />
      <path d="M13.5 5l1.5-2" />
      <path d="M12 8.5v5" />
      <path d="M12 13.5l-2 5.5" />
      <path d="M12 13.5l2 5.5" />
    </g>
  ),
  pushup: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="18" cy="10" r="1.5" />
      <path d="M16.5 10l-8 2" />
      <path d="M8.5 12l-2.5 5" />
      <path d="M6 17h2.5" />
      <path d="M12 11.5l1 5" />
      <path d="M13 16.5h2" />
      <path d="M16.5 11.5l1 2.5" />
    </g>
  ),
  abwheel: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="7" cy="18" r="2.5" />
      <circle cx="14" cy="8" r="2" />
      <path d="M14 10l-2 3" />
      <path d="M12 13l-5 5" />
      <path d="M12 13l5 2" />
      <path d="M17 15l2 3" />
    </g>
  ),
  plank: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="19" cy="12" r="1.5" />
      <path d="M17.5 12l-12 2" />
      <path d="M5.5 14l-1 5" />
      <path d="M11 13l0 6" />
      <path d="M17.5 13.5l1 3" />
    </g>
  ),
  stepup: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="10" cy="4" r="2" />
      <path d="M10 6v4" />
      <path d="M7 8l6 0" />
      <path d="M10 10l-3 4h8" />
      <path d="M7 14v5" />
      <path d="M15 14l2 5" />
      <rect x="4" y="14" width="10" height="6" rx="1" fill="none" />
    </g>
  ),
  wallsit: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M18 2v20" />
      <circle cx="14" cy="6" r="2" />
      <path d="M14 8v3" />
      <path d="M14 11h-4" />
      <path d="M10 11v4" />
      <path d="M14 11l-1 4" />
      <path d="M10 15l-2 4" />
      <path d="M13 15l1 4" />
    </g>
  ),
  sidelunge: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="12" cy="3.5" r="2" />
      <path d="M12 5.5v4.5" />
      <path d="M9 8h6" />
      <path d="M12 10l-5 4" />
      <path d="M7 14l-1 5" />
      <path d="M12 10l4 1.5" />
      <path d="M16 11.5l2 7.5" />
    </g>
  ),
  calfraise: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v6" />
      <path d="M9 8h6" />
      <path d="M12 12l-1.5 4" />
      <path d="M12 12l1.5 4" />
      <path d="M10.5 16l-0.5 2" />
      <path d="M13.5 16l0.5 2" />
      <path d="M9 20h6" />
      <path d="M10 18v2" />
      <path d="M14 18v2" />
    </g>
  ),
  stretch_full: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v5" />
      <path d="M8 7l4 1" />
      <path d="M16 7l-4 1" />
      <path d="M12 11l-3 8" />
      <path d="M12 11l3 8" />
    </g>
  ),
  hipflexor: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v5" />
      <path d="M9 8h6" />
      <path d="M12 11l-4 3" />
      <path d="M8 14v5" />
      <path d="M12 11l3 3" />
      <path d="M15 14l3 3" />
    </g>
  ),
  hamstring_stretch: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="8" cy="10" r="2" />
      <path d="M10 10l5-1" />
      <path d="M15 9l4 0" />
      <path d="M8 12l-2 5" />
      <path d="M6 17l6 0" />
      <path d="M12 17l3-5" />
    </g>
  ),
  itband: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v4" />
      <path d="M12 10c-3 1-5 3-5 6" />
      <path d="M12 10l4 4" />
      <path d="M16 14l1 5" />
      <path d="M7 16l-1 3" />
      <path d="M9 8l-3-1" />
      <path d="M15 8l3-1" />
    </g>
  ),
  childpose: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="7" cy="14" r="1.8" />
      <path d="M8.8 14.5l4.2 1" />
      <path d="M13 15.5l3 1" />
      <path d="M16 16.5l3 0" />
      <path d="M8 16l1 4" />
      <path d="M11 16l-1 4" />
    </g>
  ),
  pigeon: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="8" cy="11" r="2" />
      <path d="M10 12l3 2" />
      <path d="M13 14l5 1" />
      <path d="M8 13l-2 4" />
      <path d="M6 17l5 0" />
      <path d="M11 17l4-3" />
      <path d="M7 10l-2-3" />
      <path d="M9 10l2-3" />
    </g>
  ),
  rest_icon: (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="12" cy="12" r="6" />
      <path d="M9 10c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5" />
      <path d="M10.5 14.5c0.5 0.5 1 0.7 1.5 0.7s1-0.2 1.5-0.7" />
      <circle cx="10" cy="11.5" r="0.5" fill="currentColor" />
      <circle cx="14" cy="11.5" r="0.5" fill="currentColor" />
    </g>
  ),
};

/* ── Map exercise names to SVG keys ── */

const EXERCISE_MAP = {
  'squat with resistance band': 'squat',
  'walking lunge': 'lunge',
  'glute bridge with band': 'bridge',
  'romanian deadlift with band': 'deadlift',
  'wide pull-up (bar)': 'pullup',
  'chin-up (bar)': 'chinup',
  'push-up': 'pushup',
  'ab wheel / ab machine': 'abwheel',
  'plank': 'plank',
  'step-up on chair': 'stepup',
  'wall sit': 'wallsit',
  'side lunge with band': 'sidelunge',
  'calf raise': 'calfraise',
  'stretch (quad, hamstring, hip flexor)': 'stretch_full',
  'full body stretch': 'stretch_full',
  'hip flexor stretch': 'hipflexor',
  'hamstring stretch': 'hamstring_stretch',
  'it band stretch': 'itband',
  "child's pose": 'childpose',
  'deep stretch (pigeon, forward fold, figure-4)': 'pigeon',
};

function getSvgForExercise(name) {
  const key = EXERCISE_MAP[name.toLowerCase()];
  return EXERCISE_SVGS[key] || EXERCISE_SVGS.rest_icon;
}

/** Determine category from exercise data and plan category */
export function getExerciseCategory(exercise, planCategory) {
  if (exercise.isStretch) return 'stretch';
  if (planCategory === 'rest') return 'rest';
  if (planCategory === 'stretch') return 'stretch';
  // Infer from muscles
  const muscles = (exercise.muscles || '').toLowerCase();
  if (muscles.includes('בטן') || muscles.includes('core')) return 'core';
  if (muscles.includes('ירכ') || muscles.includes('ישבן') || muscles.includes('שוק') || muscles.includes('המסטרינג') || muscles.includes('מקרב')) return 'legs';
  if (muscles.includes('חזה') || muscles.includes('גב') || muscles.includes('כתפ') || muscles.includes('בייספס') || muscles.includes('טרייספס')) return 'upper';
  // Fallback to plan category
  if (planCategory === 'legs') return 'legs';
  if (planCategory === 'upper') return 'upper';
  return 'legs';
}

function ExerciseIcon({ exerciseName, size = 64, category = 'legs' }) {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.legs;
  const svgContent = getSvgForExercise(exerciseName);
  const iconSize = Math.round(size * 0.5);

  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: colors.bg,
        border: `2px solid ${colors.ring}20`,
      }}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        style={{ color: colors.ring }}
      >
        {svgContent}
      </svg>
    </div>
  );
}

export default React.memo(ExerciseIcon);
