import React, { useState, useMemo } from 'react';
import { saveRun } from '../utils/storage';

const RUN_TYPES = [
  { key: 'regular', label: 'רגילה', icon: '🏃' },
  { key: 'intervals', label: 'אינטרוולים', icon: '⚡' },
  { key: 'long', label: 'ארוכה', icon: '🛤️' },
  { key: 'tempo', label: 'טמפו', icon: '🔥' },
  { key: 'recovery', label: 'התאוששות', icon: '🚶' },
];

const DIFFICULTIES = [
  { value: 1, icon: '😌', label: 'קלה מאוד' },
  { value: 2, icon: '🙂', label: 'קלה' },
  { value: 3, icon: '😤', label: 'בינונית' },
  { value: 4, icon: '😰', label: 'קשה' },
  { value: 5, icon: '🥵', label: 'קשה מאוד' },
];

const SURFACES = [
  { key: 'road', label: 'כביש' },
  { key: 'trail', label: 'שטח' },
  { key: 'track', label: 'מסלול' },
  { key: 'treadmill', label: 'הליכון' },
];

export default function LogRunModal({ open, onClose, onSaved }) {
  const [runType, setRunType] = useState('regular');
  const [distanceKm, setDistanceKm] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [difficulty, setDifficulty] = useState(3);
  const [showDetails, setShowDetails] = useState(false);
  const [surface, setSurface] = useState('road');
  const [heartRateZone, setHeartRateZone] = useState(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const pace = useMemo(() => {
    if (!distanceKm || distanceKm <= 0) return null;
    const raw = durationMinutes / distanceKm;
    const mins = Math.floor(raw);
    const secs = Math.round((raw - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [distanceKm, durationMinutes]);

  function adjustDistance(delta) {
    setDistanceKm((prev) => Math.max(0.5, +(prev + delta).toFixed(1)));
  }

  function adjustDuration(delta) {
    setDurationMinutes((prev) => Math.max(5, prev + delta));
  }

  function handleSave() {
    setSaving(true);
    const paceMinPerKm = distanceKm > 0 ? +(durationMinutes / distanceKm).toFixed(2) : 0;
    saveRun({
      distanceKm,
      durationMinutes,
      paceMinPerKm,
      difficulty,
      runType,
      surface,
      heartRateZone,
      notes: notes.trim(),
    });
    setTimeout(() => {
      setSaving(false);
      resetForm();
      onSaved();
      onClose();
    }, 300);
  }

  function resetForm() {
    setRunType('regular');
    setDistanceKm(5);
    setDurationMinutes(30);
    setDifficulty(3);
    setShowDetails(false);
    setSurface('road');
    setHeartRateZone(null);
    setNotes('');
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 animate-backdrop-fade"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-lg bg-surface rounded-t-[28px] shadow-2xl animate-slide-up-sheet max-h-[90vh] overflow-y-auto no-scrollbar pb-safe">
        {/* Handle */}
        <div className="sticky top-0 bg-surface rounded-t-[28px] pt-3 pb-2 z-10">
          <div className="w-10 h-1 bg-border-light rounded-full mx-auto" />
          <h2 className="text-center text-xl font-extrabold font-heading text-txt-primary mt-3">
            🏃 רישום ריצה
          </h2>
        </div>

        <div className="px-5 pb-6">
          {/* Run Type Chips */}
          <div className="mb-5">
            <label className="text-[14px] text-txt-tertiary font-bold uppercase tracking-widest font-heading mb-2 block">סוג ריצה</label>
            <div className="flex flex-wrap gap-2">
              {RUN_TYPES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setRunType(t.key)}
                  className={`px-3.5 py-2 rounded-2xl text-[15px] font-semibold transition-all ${
                    runType === t.key
                      ? 'gradient-calm text-white shadow-teal'
                      : 'bg-base text-txt-secondary border border-border-light'
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Distance */}
          <div className="mb-5">
            <label className="text-[14px] text-txt-tertiary font-bold uppercase tracking-widest font-heading mb-2 block">מרחק (ק״מ)</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => adjustDistance(-0.5)}
                className="w-11 h-11 rounded-2xl bg-base border border-border-light text-txt-secondary text-xl font-bold flex items-center justify-center active:scale-95 transition-transform"
              >
                −
              </button>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Math.max(0, +e.target.value))}
                className="flex-1 text-center text-[28px] font-extrabold tabular-nums font-heading text-txt-primary bg-base rounded-2xl border border-border-light py-2 focus:outline-none focus:border-secondary-300 transition-colors"
                dir="ltr"
              />
              <button
                onClick={() => adjustDistance(0.5)}
                className="w-11 h-11 rounded-2xl bg-base border border-border-light text-txt-secondary text-xl font-bold flex items-center justify-center active:scale-95 transition-transform"
              >
                +
              </button>
            </div>
          </div>

          {/* Duration */}
          <div className="mb-5">
            <label className="text-[14px] text-txt-tertiary font-bold uppercase tracking-widest font-heading mb-2 block">משך (דקות)</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => adjustDuration(-5)}
                className="w-11 h-11 rounded-2xl bg-base border border-border-light text-txt-secondary text-xl font-bold flex items-center justify-center active:scale-95 transition-transform"
              >
                −
              </button>
              <input
                type="number"
                inputMode="numeric"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Math.max(1, +e.target.value))}
                className="flex-1 text-center text-[28px] font-extrabold tabular-nums font-heading text-txt-primary bg-base rounded-2xl border border-border-light py-2 focus:outline-none focus:border-secondary-300 transition-colors"
                dir="ltr"
              />
              <button
                onClick={() => adjustDuration(5)}
                className="w-11 h-11 rounded-2xl bg-base border border-border-light text-txt-secondary text-xl font-bold flex items-center justify-center active:scale-95 transition-transform"
              >
                +
              </button>
            </div>
          </div>

          {/* Pace (auto-calculated) */}
          <div className="mb-5 bg-secondary-50 rounded-2xl p-4 border border-secondary-200/50">
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-secondary-500 font-semibold">קצב</span>
              <span className="text-[24px] font-extrabold tabular-nums font-heading text-secondary-500" dir="ltr">
                {pace ? `${pace} דק׳/ק״מ` : '—'}
              </span>
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-5">
            <label className="text-[14px] text-txt-tertiary font-bold uppercase tracking-widest font-heading mb-2 block">רמת קושי</label>
            <div className="flex gap-2 justify-between">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl transition-all ${
                    difficulty === d.value
                      ? 'bg-secondary-50 border-2 border-secondary-300 shadow-sm'
                      : 'bg-base border border-border-light'
                  }`}
                >
                  <span className="text-2xl">{d.icon}</span>
                  <span className={`text-[11px] font-semibold ${difficulty === d.value ? 'text-secondary-500' : 'text-txt-tertiary'}`}>
                    {d.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible Extra Details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between py-3 mb-3 text-txt-secondary"
          >
            <span className="text-[15px] font-semibold">פרטים נוספים</span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDetails && (
            <div className="space-y-4 mb-5 animate-fade-in">
              {/* Surface */}
              <div>
                <label className="text-[13px] text-txt-tertiary font-semibold mb-1.5 block">משטח</label>
                <div className="flex gap-2">
                  {SURFACES.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setSurface(s.key)}
                      className={`flex-1 py-2 rounded-xl text-[14px] font-semibold transition-all ${
                        surface === s.key
                          ? 'gradient-calm text-white shadow-teal'
                          : 'bg-base text-txt-secondary border border-border-light'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Heart Rate Zone */}
              <div>
                <label className="text-[13px] text-txt-tertiary font-semibold mb-1.5 block">אזור דופק (אופציונלי)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((zone) => (
                    <button
                      key={zone}
                      onClick={() => setHeartRateZone(heartRateZone === zone ? null : zone)}
                      className={`flex-1 py-2 rounded-xl text-[15px] font-bold transition-all ${
                        heartRateZone === zone
                          ? 'gradient-energy text-white shadow-primary'
                          : 'bg-base text-txt-secondary border border-border-light'
                      }`}
                    >
                      Z{zone}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[13px] text-txt-tertiary font-semibold mb-1.5 block">הערות</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="איך הרגשת? תנאי מזג אוויר..."
                  rows={3}
                  className="w-full bg-base border border-border-light rounded-2xl p-3 text-[15px] text-txt-primary placeholder:text-txt-tertiary/50 resize-none focus:outline-none focus:border-secondary-300 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full gradient-calm text-white font-extrabold py-4 rounded-3xl text-lg shadow-teal active:scale-[0.97] transition-transform font-heading disabled:opacity-60"
          >
            {saving ? 'שומר...' : '🏃 שמור ריצה'}
          </button>
        </div>
      </div>
    </div>
  );
}
