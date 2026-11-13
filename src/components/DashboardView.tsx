import React, { useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Dumbbell,
  Flame,
  Layers,
  Plus,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { WorkoutDay, WorkoutSplit } from '../types/workout';
import { calculateDayMetrics, getOrderedExercises } from '../utils/workoutLogic';

interface DashboardViewProps {
  activeSplit: WorkoutSplit;
  smartSortEnabled: boolean;
  totalHistorySessions: number;
  onSelectDay: (dayId: string) => void;
  onOpenHistoryLogbook: () => void;
  onAddDayToSplit: (dayName: string, subtitle: string) => void;
  onDeleteCustomSplit?: (splitId: string) => void;
  onOpenCreateSplit: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  activeSplit,
  smartSortEnabled,
  totalHistorySessions,
  onSelectDay,
  onOpenHistoryLogbook,
  onAddDayToSplit,
  onDeleteCustomSplit,
  onOpenCreateSplit,
}) => {
  const [showAddDayForm, setShowAddDayForm] = useState(false);
  const [newDayName, setNewDayName] = useState('');
  const [newDaySubtitle, setNewDaySubtitle] = useState('');

  // Compute split-wide metrics
  const splitMetrics = activeSplit.days.reduce(
    (acc, day) => {
      const m = calculateDayMetrics(day);
      acc.totalSets += m.totalSets;
      acc.completedSets += m.completedSets;
      acc.skippedSets += m.skippedSets;
      acc.failedSets += m.failedSets;
      acc.totalVolumeLbs += m.totalVolumeLbs;
      acc.plannedVolumeLbs += m.plannedVolumeLbs;
      acc.totalExercises += day.exercises.length;
      return acc;
    },
    {
      totalSets: 0,
      completedSets: 0,
      skippedSets: 0,
      failedSets: 0,
      totalVolumeLbs: 0,
      plannedVolumeLbs: 0,
      totalExercises: 0,
    }
  );

  const overallCompletionPct =
    splitMetrics.totalSets > 0
      ? Math.round(
          ((splitMetrics.completedSets +
            splitMetrics.skippedSets +
            splitMetrics.failedSets) /
            splitMetrics.totalSets) *
            100
        )
      : 0;

  const handleAddDaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDayName.trim()) return;
    onAddDayToSplit(
      newDayName.trim(),
      newDaySubtitle.trim() || 'Hypertrophy & Progressive Overload'
    );
    setNewDayName('');
    setNewDaySubtitle('');
    setShowAddDayForm(false);
  };

  const getAccentStyles = (accent: WorkoutDay['accentColor']) => {
    switch (accent) {
      case 'orange':
        return {
          text: 'text-[#FF5500]',
          borderHover: 'hover:border-[#FF5500]',
          barBg: 'bg-[#FF5500]',
          ctaBg: 'bg-[#FF5500] text-[#121212] hover:bg-[#FF6B1A]',
        };
      case 'green':
        return {
          text: 'text-[#00FF66]',
          borderHover: 'hover:border-[#00FF66]',
          barBg: 'bg-[#00FF66]',
          ctaBg: 'bg-[#00FF66] text-[#121212] hover:bg-[#26FF7D]',
        };
      case 'cyan':
        return {
          text: 'text-[#00E5FF]',
          borderHover: 'hover:border-[#00E5FF]',
          barBg: 'bg-[#00E5FF]',
          ctaBg: 'bg-[#00E5FF] text-[#121212] hover:bg-[#29EAFF]',
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Split Overview Header Section */}
      <section className="bg-[#1E1E1E] border border-[#2C303A] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-[#9CA3AF]">
              <span className="text-[#FF5500] font-semibold">Active Training Split</span>
              <span aria-hidden="true">·</span>
              <span>{activeSplit.days.length} Training Days</span>
              <span aria-hidden="true">·</span>
              <span>{splitMetrics.totalExercises} Total Movements</span>
              {activeSplit.isCustom && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#00E5FF]">Custom Split</span>
                </>
              )}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-wide text-[#F4F4F6] text-balance">
              {activeSplit.name}
            </h1>
            <p className="text-sm sm:text-base text-[#A1A7B3] leading-relaxed">
              {activeSplit.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenHistoryLogbook}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-zinc-900 border border-emerald-500/60 hover:border-emerald-400 text-[#00FF66] text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              <span>History Logbook ({totalHistorySessions})</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddDayForm((prev) => !prev)}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#121212] border border-[#323640] hover:border-[#00E5FF] text-[#F4F4F6] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-[#00E5FF]" />
              <span>Add Day to Split</span>
            </button>
            <button
              type="button"
              onClick={onOpenCreateSplit}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#121212] border border-[#323640] hover:border-[#FF5500] text-[#F4F4F6] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Layers className="w-4 h-4 text-[#FF5500]" />
              <span>Create Custom Split</span>
            </button>
            {activeSplit.isCustom && onDeleteCustomSplit && (
              <button
                type="button"
                onClick={() => onDeleteCustomSplit(activeSplit.id)}
                className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#323640] hover:border-[#FF2A54] text-[#9CA3AF] hover:text-[#FF2A54] text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Split</span>
              </button>
            )}
          </div>
        </div>

        {/* Clickable Main Daily Progress Bar -> Opens Calendar Logbook */}
        <div className="mt-6 pt-6 border-t border-[#2A2E37]">
          <button
            type="button"
            onClick={onOpenHistoryLogbook}
            aria-label="Open History Logbook from Main Progress Bar"
            className="w-full text-left group bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-700 hover:border-emerald-500 rounded-xl p-4 transition-all cursor-pointer space-y-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
                <Calendar className="w-4 h-4 text-[#00FF66]" />
                <span>Today&apos;s Split Progress ({overallCompletionPct}%)</span>
                <span className="text-xs font-normal text-zinc-400">
                  — Click progress bar to open History Logbook & Date-Range Comparison
                </span>
              </div>
              <span className="font-mono-tabular text-xs font-bold text-[#00FF66] group-hover:underline">
                Open Calendar & Compare Progress ➔
              </span>
            </div>
            <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-[#FF5500] via-[#00E5FF] to-[#00FF66] transition-all duration-300"
                style={{ width: `${Math.max(4, overallCompletionPct)}%` }}
              />
            </div>
          </button>
        </div>

        {/* Inline Add Workout Day Form */}
        {showAddDayForm && (
          <form
            onSubmit={handleAddDaySubmit}
            className="mt-6 pt-6 border-t border-[#2A2E37] grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
          >
            <div className="sm:col-span-5">
              <label
                htmlFor="new-day-title-input"
                className="block text-xs font-semibold text-[#D1D5DB] mb-1.5"
              >
                Workout Day Title *
              </label>
              <input
                id="new-day-title-input"
                type="text"
                value={newDayName}
                onChange={(e) => setNewDayName(e.target.value)}
                placeholder="e.g., Arms & Conditioning Day"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#121212] border border-[#323640] text-sm text-[#F4F4F6] focus:border-[#00E5FF] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-5">
              <label
                htmlFor="new-day-sub-input"
                className="block text-xs font-semibold text-[#D1D5DB] mb-1.5"
              >
                Target Muscle Groups
              </label>
              <input
                id="new-day-sub-input"
                type="text"
                value={newDaySubtitle}
                onChange={(e) => setNewDaySubtitle(e.target.value)}
                placeholder="e.g., Biceps · Triceps · Forearms · Core"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#121212] border border-[#323640] text-sm text-[#F4F4F6] focus:border-[#00E5FF] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-2">
              <button
                type="submit"
                className="w-full min-h-[44px] px-4 py-2 rounded-lg bg-[#00E5FF] hover:bg-[#29EAFF] text-[#121212] font-bold text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                Save Day
              </button>
            </div>
          </form>
        )}

        {/* 4-Column Split Telemetry Bar */}
        <div className="mt-6 pt-6 border-t border-[#2A2E37] grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="text-xs text-[#9CA3AF] font-medium">Completed Volume</div>
            <div className="mt-1 font-mono-tabular text-2xl sm:text-3xl font-bold text-[#F4F4F6]">
              {splitMetrics.totalVolumeLbs.toLocaleString()}{' '}
              <span className="text-sm font-normal text-[#9CA3AF]">lbs</span>
            </div>
            <div className="mt-0.5 text-xs text-[#9CA3AF] font-mono-tabular">
              of {splitMetrics.plannedVolumeLbs.toLocaleString()} lbs target
            </div>
          </div>

          <div>
            <div className="text-xs text-[#9CA3AF] font-medium">Sets Completed Today</div>
            <div className="mt-1 font-mono-tabular text-2xl sm:text-3xl font-bold text-[#00FF66]">
              {splitMetrics.completedSets}{' '}
              <span className="text-sm font-normal text-[#9CA3AF]">/ {splitMetrics.totalSets}</span>
            </div>
            <div className="mt-0.5 text-xs text-[#9CA3AF] font-mono-tabular">
              Fresh Day Reset active
            </div>
          </div>

          <div>
            <div className="text-xs text-[#9CA3AF] font-medium">Exercise Ordering</div>
            <div className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#00E5FF] tracking-wide">
              {smartSortEnabled ? 'Smart Frequency' : 'Default Order'}
            </div>
            <div className="mt-0.5 text-xs text-[#9CA3AF]">
              Top movements auto-rise by completion
            </div>
          </div>

          <div>
            <div className="text-xs text-[#9CA3AF] font-medium">Capacitor Storage</div>
            <div className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#FF5500] tracking-wide">
              Preferences Synced
            </div>
            <div className="mt-0.5 text-xs text-[#9CA3AF]">
              {totalHistorySessions} logged dates in Logbook
            </div>
          </div>
        </div>
      </section>

      {/* Main Category Day Cards Grid */}
      <section aria-labelledby="split-days-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2
              id="split-days-heading"
              className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-[#F4F4F6]"
            >
              Select Training Day
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF]">
              Tap any category card to log sets, or click a progress bar to view the History Logbook.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSplit.days.map((day, idx) => {
            const metrics = calculateDayMetrics(day);
            const orderedExercises = getOrderedExercises(day.exercises, smartSortEnabled);
            const styles = getAccentStyles(day.accentColor);

            return (
              <article
                key={day.id}
                onClick={() => onSelectDay(day.id)}
                className={`group bg-[#1E1E1E] border border-[#2C303A] ${styles.borderHover} rounded-2xl p-6 flex flex-col justify-between transition-all duration-150 cursor-pointer hover:bg-[#22252D]`}
              >
                <div>
                  {/* Card Top Metadata Line */}
                  <div className="flex items-center justify-between gap-2 text-xs text-[#9CA3AF] mb-3">
                    <div className="flex items-center gap-1.5 font-mono-tabular">
                      <span className={`font-bold ${styles.text}`}>DAY 0{idx + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span>{day.exercises.length} Exercises</span>
                      <span aria-hidden="true">·</span>
                      <span>{metrics.totalSets} Sets</span>
                    </div>
                    {metrics.averageRpe > 0 && (
                      <span className="font-mono-tabular text-[#D1D5DB] flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-[#FF5500]" />
                        Avg RPE {metrics.averageRpe}
                      </span>
                    )}
                  </div>

                  {/* Primary Title & Subtitle */}
                  <h3 className="font-display text-3xl font-bold tracking-wide text-[#F4F4F6] group-hover:text-white">
                    {day.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1 line-clamp-1">
                    {day.subtitle}
                  </p>

                  {/* Clickable Progress Bar & Volume Summary */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Open History Logbook from ${day.name} progress bar`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenHistoryLogbook();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                        onOpenHistoryLogbook();
                      }
                    }}
                    className="mt-5 pt-4 border-t border-[#2A2E37] space-y-2 hover:opacity-90"
                    title="Click progress bar to open History Logbook"
                  >
                    <div className="flex items-center justify-between text-xs font-mono-tabular">
                      <span className="text-[#D1D5DB]">
                        <strong className="text-[#00FF66]">{metrics.completedSets}</strong> Done
                        {metrics.skippedSets > 0 && (
                          <span className="text-[#00E5FF]"> · {metrics.skippedSets} Skipped</span>
                        )}
                        {metrics.failedSets > 0 && (
                          <span className="text-[#FF2A54]"> · {metrics.failedSets} Failed</span>
                        )}
                      </span>
                      <span className="text-[#9CA3AF] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#00FF66]" />
                        Logbook
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[#121212] rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className={`h-full ${styles.barBg} transition-all duration-200`}
                        style={{ width: `${Math.max(4, metrics.completionPct)}%` }}
                      />
                    </div>
                  </div>

                  {/* Top Smart-Ordered Exercises Preview */}
                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#9CA3AF]">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-[#00E5FF]" />
                        Top Movements (Smart Order)
                      </span>
                      <span>Logged</span>
                    </div>
                    <ul className="space-y-1.5">
                      {orderedExercises.slice(0, 3).map((ex, exIdx) => {
                        const exCompleted = ex.sets.filter((s) => s.status === 'complete').length;
                        const exSkipped = ex.sets.filter((s) => s.status === 'skip').length;
                        return (
                          <li
                            key={ex.id}
                            className="flex items-center justify-between text-xs py-1 border-b border-[#262932] last:border-none"
                          >
                            <div className="flex items-center gap-2 truncate pr-2">
                              <span className="font-mono-tabular text-[#6B7280]">
                                {exIdx + 1}.
                              </span>
                              <span className="text-[#E5E7EB] font-medium truncate">
                                {ex.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 font-mono-tabular text-[11px]">
                              {exSkipped > 0 && (
                                <span className="text-[#00E5FF]">{exSkipped} skip</span>
                              )}
                              <span className="text-[#9CA3AF]">
                                {exCompleted}/{ex.sets.length} sets
                              </span>
                              <span className="text-[#00FF66] font-semibold">
                                {ex.usageCount}x
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Large Sweaty-Hands Tap CTA Button */}
                <div className="mt-6 pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDay(day.id);
                    }}
                    aria-label={`Open ${day.name} Workout`}
                    className={`w-full min-h-[48px] px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-between transition-all cursor-pointer ${styles.ctaBg}`}
                  >
                    <span className="flex items-center gap-2">
                      <Dumbbell className="w-4 h-4" />
                      <span>Start {day.name}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono-tabular text-xs font-extrabold">
                      <span>{metrics.completionPct}%</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
