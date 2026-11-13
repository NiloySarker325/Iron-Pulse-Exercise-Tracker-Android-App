import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Flame,
  Layers,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import { WorkoutHistoryMap } from '../types/workout';
import { computeCategorizedProgressComparison } from '../utils/workoutLogic';

interface HistoryLogbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutHistory: WorkoutHistoryMap;
  initialTab?: 'calendar' | 'compare';
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const HistoryLogbookModal: React.FC<HistoryLogbookModalProps> = ({
  isOpen,
  onClose,
  workoutHistory,
  initialTab = 'calendar',
}) => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'compare'>(initialTab);

  // Default calendar view to November 2026 (where sample & current sessions live)
  const [viewYear, setViewYear] = useState<number>(2026);
  const [viewMonth, setViewMonth] = useState<number>(10); // 0-indexed: 10 = November, 9 = October

  // Default selected date to the most recent logged date in workoutHistory
  const sortedDates = useMemo(
    () => Object.keys(workoutHistory).sort((a, b) => b.localeCompare(a)),
    [workoutHistory]
  );

  const [selectedDate, setSelectedDate] = useState<string>(
    sortedDates[0] || '2026-11-05'
  );

  // Date-Range Progress Comparison state (defaults to Oct 5 – Nov 12, 2026)
  const [startDate, setStartDate] = useState<string>('2026-10-05');
  const [endDate, setEndDate] = useState<string>('2026-11-12');

  const categorizedDeltas = useMemo(
    () => computeCategorizedProgressComparison(workoutHistory, startDate, endDate),
    [workoutHistory, startDate, endDate]
  );

  if (!isOpen) return null;

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const getDotColorClass = (accent?: 'orange' | 'green' | 'cyan') => {
    if (accent === 'orange') return 'bg-[#FF5500]';
    if (accent === 'cyan') return 'bg-[#00E5FF]';
    return 'bg-emerald-400';
  };

  const getBadgeColorClass = (accent?: 'orange' | 'green' | 'cyan') => {
    if (accent === 'orange') return 'text-[#FF5500] border-[#FF5500]/40 bg-[#FF5500]/10';
    if (accent === 'cyan') return 'text-[#00E5FF] border-[#00E5FF]/40 bg-[#00E5FF]/10';
    return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
  };

  const selectedEntry = workoutHistory[selectedDate] || null;
  const splitDayCategories = Object.keys(categorizedDeltas);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-logbook-title"
    >
      <div className="w-full max-w-6xl bg-zinc-900 border-2 border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Modal Header */}
        <div className="bg-zinc-800 px-4 sm:px-6 py-4 border-b border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[#00FF66]">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h2
                id="history-logbook-title"
                className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-white"
              >
                History Logbook
              </h2>
              <p className="text-xs text-zinc-400">
                Inspect daily locked-in workouts or compare progressive overload across date ranges.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Tab Switcher */}
            <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-700">
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'calendar'
                    ? 'bg-[#00FF66] text-zinc-950'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Calendar Logbook
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('compare')}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'compare'
                    ? 'bg-[#FF5500] text-zinc-950'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Compare Progress
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close History Logbook"
              className="min-h-[44px] min-w-[44px] rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'calendar' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 7 Columns: Monthly Calendar Grid */}
              <div className="lg:col-span-7 bg-zinc-950/70 border border-zinc-800 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white tracking-wide">
                      {MONTH_NAMES[viewMonth]} {viewYear}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Tap any highlighted workout date to inspect sets, tonnage & RPE.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setViewYear(2026);
                        setViewMonth(9);
                      }}
                      className={`min-h-[38px] px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer ${
                        viewMonth === 9 && viewYear === 2026
                          ? 'bg-zinc-800 border-zinc-500 text-white'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Oct 2026
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setViewYear(2026);
                        setViewMonth(10);
                      }}
                      className={`min-h-[38px] px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer ${
                        viewMonth === 10 && viewYear === 2026
                          ? 'bg-zinc-800 border-zinc-500 text-white'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Nov 2026
                    </button>
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      aria-label="Previous Month"
                      className="min-h-[38px] min-w-[38px] rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      aria-label="Next Month"
                      className="min-h-[38px] min-w-[38px] rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {WEEKDAYS.map((day) => (
                    <div
                      key={day}
                      className="text-xs font-semibold text-zinc-400 py-1.5"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Day Cells */}
                <div className="grid grid-cols-7 gap-1.5">
                  {Array.from({ length: firstDayOfWeek }).map((_, emptyIdx) => (
                    <div
                      key={`empty-${emptyIdx}`}
                      className="h-14 sm:h-16 rounded-lg bg-zinc-900/30 border border-zinc-800/40"
                    />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(
                      2,
                      '0'
                    )}-${String(dayNum).padStart(2, '0')}`;
                    const historyEntry = workoutHistory[dateKey];
                    const isSelected = selectedDate === dateKey;

                    return (
                      <button
                        key={dateKey}
                        type="button"
                        onClick={() => setSelectedDate(dateKey)}
                        aria-label={`Date ${dateKey}${
                          historyEntry ? ` ${historyEntry.summary.dayName}` : ''
                        }`}
                        className={`h-14 sm:h-16 rounded-xl border p-1.5 flex flex-col items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-800 border-[#00FF66] ring-2 ring-[#00FF66]/40'
                            : historyEntry
                            ? 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'
                            : 'bg-zinc-950/60 border-zinc-800/70 text-zinc-500 hover:border-zinc-700'
                        }`}
                      >
                        <span
                          className={`font-mono-tabular text-xs sm:text-sm font-bold ${
                            isSelected
                              ? 'text-white'
                              : historyEntry
                              ? 'text-zinc-100'
                              : 'text-zinc-500'
                          }`}
                        >
                          {dayNum}
                        </span>

                        {historyEntry ? (
                          <div className="flex flex-col items-center gap-0.5 w-full">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${getDotColorClass(
                                historyEntry.summary.accentColor
                              )}`}
                            />
                            <span className="text-[9px] font-semibold text-zinc-300 truncate max-w-full hidden sm:inline">
                              {historyEntry.summary.dayName.replace(' Day', '')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-700">—</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500]" />
                      Push Day
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]" />
                      Pull Day
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      Leg Day
                    </span>
                  </div>
                  <span>{sortedDates.length} total logged sessions</span>
                </div>
              </div>

              {/* Right 5 Columns: Daily Summary Panel */}
              <div className="lg:col-span-5 bg-zinc-950/80 border-2 border-zinc-700 rounded-xl overflow-hidden">
                {selectedEntry ? (
                  <div>
                    <div className="bg-zinc-800 p-4 border-b border-zinc-700 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-mono-tabular text-zinc-400">
                          {selectedEntry.summary.date} · {selectedEntry.summary.splitName}
                        </div>
                        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide mt-0.5">
                          {selectedEntry.summary.dayName}
                        </h3>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg border text-xs font-bold ${getBadgeColorClass(
                          selectedEntry.summary.accentColor
                        )}`}
                      >
                        Logged Session
                      </span>
                    </div>

                    {/* 3 Summary Metrics */}
                    <div className="grid grid-cols-3 gap-2 p-4 bg-zinc-900/90 border-b border-zinc-800">
                      <div>
                        <div className="text-[11px] text-zinc-400">Total Sets</div>
                        <div className="font-mono-tabular text-lg sm:text-xl font-bold text-[#00FF66]">
                          {selectedEntry.summary.totalSets} sets
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-zinc-400">Total Volume</div>
                        <div className="font-mono-tabular text-lg sm:text-xl font-bold text-white">
                          {selectedEntry.summary.totalVolumeLbs.toLocaleString()} lbs
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-zinc-400">Average RPE</div>
                        <div className="font-mono-tabular text-lg sm:text-xl font-bold text-[#FF5500] flex items-center gap-1">
                          <Flame className="w-4 h-4" />
                          {selectedEntry.summary.averageRpe}
                        </div>
                      </div>
                    </div>

                    {/* Compact Exercises List */}
                    <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
                      {selectedEntry.exercises.map((ex, idx) => (
                        <div
                          key={`${ex.exerciseId}-${idx}`}
                          className="bg-zinc-900 border border-zinc-700 rounded-xl p-3.5 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <h4 className="font-display text-lg font-bold text-white tracking-wide">
                                {ex.name}
                              </h4>
                              <p className="text-[11px] text-zinc-400">{ex.muscleGroup}</p>
                            </div>
                            <div className="text-right font-mono-tabular">
                              <div className="text-xs font-bold text-[#00E5FF]">
                                Top: {ex.topWeight} lbs
                              </div>
                              <div className="text-[11px] text-zinc-400">
                                {ex.completedSetsCount} sets · {ex.totalVolumeLbs.toLocaleString()} lbs
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {ex.sets.map((s, sIdx) => (
                              <span
                                key={sIdx}
                                className="font-mono-tabular text-[11px] bg-zinc-800 border border-zinc-700 text-zinc-200 px-2 py-1 rounded"
                              >
                                S{sIdx + 1}: {s.weight} lbs × {s.reps} @ RPE {s.rpe}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-3">
                    <Dumbbell className="w-8 h-8 text-zinc-500 mx-auto" />
                    <h3 className="font-display text-xl font-bold text-white">
                      No Workout Logged on {selectedDate}
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                      Select any date with a colored indicator dot on the calendar to inspect that day&apos;s locked-in sets and tonnage.
                    </p>
                    {sortedDates.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedDate(sortedDates[0])}
                        className="min-h-[40px] px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-xs font-bold text-[#00FF66] hover:border-[#00FF66] cursor-pointer"
                      >
                        Jump to Latest Session ({sortedDates[0]})
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Tab 2: Date-Range Progress Comparison (Categorized by Split Day) */
            <div className="space-y-6">
              {/* Date Range Pickers Bar */}
              <div className="bg-zinc-800/90 border border-zinc-700 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-display text-2xl font-bold text-white tracking-wide">
                    Date-Range Progress Comparison
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Compares your earliest baseline session against your latest session in the selected date window, grouped by Split Day.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
                  <div>
                    <label
                      htmlFor="compare-start-date"
                      className="block text-xs font-semibold text-zinc-300 mb-1"
                    >
                      Start Date (Baseline)
                    </label>
                    <input
                      id="compare-start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-600 text-sm font-mono-tabular text-white focus:border-[#FF5500] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="compare-end-date"
                      className="block text-xs font-semibold text-zinc-300 mb-1"
                    >
                      End Date (Current)
                    </label>
                    <input
                      id="compare-end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-600 text-sm font-mono-tabular text-white focus:border-[#00FF66] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Categorized Delta Groups by Split Day */}
              {splitDayCategories.length === 0 ? (
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-10 text-center space-y-2">
                  <Layers className="w-8 h-8 text-zinc-500 mx-auto" />
                  <h4 className="font-display text-xl font-bold text-white">
                    No Logged Workouts in Selected Range
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Try expanding your Start Date (e.g., 2026-10-05) and End Date (e.g., 2026-11-12).
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {splitDayCategories.map((dayCategory) => {
                    const exercises = categorizedDeltas[dayCategory] || [];
                    const isPush = dayCategory.toLowerCase().includes('push');
                    const isPull = dayCategory.toLowerCase().includes('pull');
                    const borderAccent = isPush
                      ? 'border-l-[6px] border-l-[#FF5500]'
                      : isPull
                      ? 'border-l-[6px] border-l-cyan-400'
                      : 'border-l-[6px] border-l-emerald-500';

                    return (
                      <section
                        key={dayCategory}
                        className="space-y-4"
                        aria-label={`${dayCategory} Progress Comparison`}
                      >
                        <div
                          className={`bg-zinc-800 px-4 py-3 rounded-xl border border-zinc-700 ${borderAccent} flex items-center justify-between`}
                        >
                          <h4 className="font-display text-2xl font-bold text-white tracking-wide">
                            {dayCategory}
                          </h4>
                          <span className="font-mono-tabular text-xs text-zinc-300">
                            {exercises.length} Movements Tracked
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {exercises.map((delta) => {
                            const weightColor =
                              delta.weightDelta > 0
                                ? 'text-green-500'
                                : delta.weightDelta < 0
                                ? 'text-red-500'
                                : 'text-zinc-400';

                            const setsColor =
                              delta.setsDelta > 0
                                ? 'text-green-500'
                                : delta.setsDelta < 0
                                ? 'text-red-500'
                                : 'text-zinc-400';

                            const formattedWeightDelta =
                              delta.weightDelta > 0
                                ? `+${delta.weightDelta} lbs`
                                : `${delta.weightDelta} lbs`;

                            const formattedSetsDelta =
                              delta.setsDelta > 0
                                ? `+${delta.setsDelta} ${
                                    Math.abs(delta.setsDelta) === 1 ? 'set' : 'sets'
                                  }`
                                : `${delta.setsDelta} ${
                                    Math.abs(delta.setsDelta) === 1 ? 'set' : 'sets'
                                  }`;

                            return (
                              <div
                                key={delta.exerciseName}
                                className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-4 shadow-lg space-y-3"
                              >
                                <div className="flex items-start justify-between gap-2 border-b border-zinc-800 pb-2.5">
                                  <div>
                                    <h5 className="font-display text-xl font-bold text-white tracking-wide">
                                      {delta.exerciseName}
                                    </h5>
                                    <p className="text-xs text-zinc-400">{delta.muscleGroup}</p>
                                  </div>
                                  <span className="font-mono-tabular text-[11px] text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded">
                                    {delta.baselineDate} ➔ {delta.currentDate}
                                  </span>
                                </div>

                                <div className="space-y-2 font-mono-tabular text-sm">
                                  {/* Weight Comparison Line */}
                                  <div className="flex items-center justify-between bg-zinc-950/70 px-3 py-2 rounded-lg border border-zinc-800">
                                    <span className="text-xs text-zinc-400 font-sans font-medium">
                                      Weight:
                                    </span>
                                    <div className="flex items-center gap-2 font-bold text-white">
                                      <span>
                                        {delta.baselineWeight} lbs ➔ {delta.currentWeight} lbs
                                      </span>
                                      <span className={`${weightColor} inline-flex items-center gap-0.5`}>
                                        ({formattedWeightDelta})
                                        {delta.weightDelta > 0 && (
                                          <TrendingUp className="w-3.5 h-3.5 inline" />
                                        )}
                                        {delta.weightDelta < 0 && (
                                          <TrendingDown className="w-3.5 h-3.5 inline" />
                                        )}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Sets / Volume Comparison Line */}
                                  <div className="flex items-center justify-between bg-zinc-950/70 px-3 py-2 rounded-lg border border-zinc-800">
                                    <span className="text-xs text-zinc-400 font-sans font-medium">
                                      Sets/Volume:
                                    </span>
                                    <div className="flex items-center gap-2 font-bold text-white">
                                      <span>
                                        {delta.baselineSets} sets ➔ {delta.currentSets} sets
                                      </span>
                                      <span className={setsColor}>({formattedSetsDelta})</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
