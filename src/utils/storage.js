const KEYS = {
  HISTORY: 'fitness-history',
  CURRENT: 'fitness-current-workout',
};

export function getHistory() {
  try {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveWorkout(workout) {
  const history = getHistory();
  history.push(workout);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
}

export function getCurrentWorkout() {
  try {
    const data = localStorage.getItem(KEYS.CURRENT);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveCurrentWorkout(workout) {
  localStorage.setItem(KEYS.CURRENT, JSON.stringify(workout));
}

export function clearCurrentWorkout() {
  localStorage.removeItem(KEYS.CURRENT);
}

export function exportData() {
  const data = {
    history: getHistory(),
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fitness-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function saveRun(runData) {
  const now = new Date();
  const workout = {
    date: now.toISOString().split('T')[0],
    dayOfWeek: now.getDay(),
    planTitle: 'ריצה',
    exercises: [],
    completedAt: now.toISOString(),
    duration: runData.durationMinutes,
    type: 'run',
    run: {
      distanceKm: runData.distanceKm,
      durationMinutes: runData.durationMinutes,
      paceMinPerKm: runData.paceMinPerKm,
      difficulty: runData.difficulty,
      runType: runData.runType,
      surface: runData.surface,
      heartRateZone: runData.heartRateZone,
      notes: runData.notes,
    },
  };
  const history = getHistory();
  history.push(workout);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
}

export function resetAllData() {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}
