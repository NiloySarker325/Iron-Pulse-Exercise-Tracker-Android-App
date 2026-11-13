import React from 'react';
import { Calendar, Dumbbell, Plus, RotateCcw, Timer } from 'lucide-react';
import { WorkoutSplit } from '../types/workout';

interface GlobalHeaderProps {
  splits: WorkoutSplit[];
  activeSplitId: string;
  activeDayName: string | null;
  onSelectSplit: (splitId: string) => void;
  onBackToDashboard: () => void;
  onOpenCreateSplit: () => void;
  onOpenHistoryLogbook: () => void;
  onToggleRestTimer: () => void;
  restTimerSeconds: number | null;
  onResetDemoData: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  splits,
  activeSplitId,
  activeDayName,
  onSelectSplit,
  onBackToDashboard,
  onOpenCreateSplit,
  onOpenHistoryLogbook,
  onToggleRestTimer,
  restTimerSeconds,
  onResetDemoData,
}) => {
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <header className="sticky top-0 z-30 bg-[#121212]/95 backdrop-blur-md border-b border-[#262930]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-8">
        {/* Zone 1: Brand Title (One line) */}
        <button
          type="button"
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-left group focus-visible:outline-2 focus-visible:outline-[#FF5500] rounded-lg min-h-[44px] shrink-0 cursor-pointer"
          aria-label="IRON PULSE Home Dashboard"
        >
          <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#1E1E1E] border border-[#2E323B] flex items-center justify-center text-[#FF5500] group-hover:border-[#FF5500] transition-colors">
            <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
          <span className="font-display text-xl sm:text-2xl font-bold tracking-wider text-[#F4F4F6] whitespace-nowrap">
            IRON<span className="text-[#FF5500]">PULSE</span>
          </span>
        </button>

        {/* Zone 2: Concise Navigation Links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-5 text-sm font-medium">
          <button
            type="button"
            onClick={onBackToDashboard}
            className={`min-h-[44px] px-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
              activeDayName === null
                ? 'border-[#FF5500] text-[#F4F4F6]'
                : 'border-transparent text-[#9CA3AF] hover:text-[#F4F4F6]'
            }`}
          >
            Split Dashboard
          </button>
          {activeDayName && (
            <span className="text-[#00FF66] font-semibold whitespace-nowrap shrink-0 border-b-2 border-[#00FF66] min-h-[44px] flex items-center px-1">
              {activeDayName}
            </span>
          )}
          <button
            type="button"
            onClick={onOpenHistoryLogbook}
            className="min-h-[44px] px-2 text-[#9CA3AF] hover:text-[#00FF66] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#00FF66]" />
            <span>History Logbook</span>
          </button>
          <button
            type="button"
            onClick={onToggleRestTimer}
            className="min-h-[44px] px-2 text-[#9CA3AF] hover:text-[#00E5FF] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Timer className="w-4 h-4 text-[#00E5FF]" />
            <span className="font-mono-tabular">
              {restTimerSeconds !== null && restTimerSeconds > 0
                ? `Rest ${formatTime(restTimerSeconds)}`
                : 'Rest Timer'}
            </span>
          </button>
          <button
            type="button"
            onClick={onResetDemoData}
            className="min-h-[44px] px-2 text-[#9CA3AF] hover:text-[#F4F4F6] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            title="Reset all workouts to default template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Template</span>
          </button>
        </nav>

        {/* Zone 3: Active Split Selector & Custom Split Action */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <label
              htmlFor="active-split-select"
              className="hidden lg:inline-block text-xs font-medium text-[#9CA3AF] whitespace-nowrap"
            >
              Active Split:
            </label>
            <select
              id="active-split-select"
              aria-label="Active Split"
              value={activeSplitId}
              onChange={(e) => onSelectSplit(e.target.value)}
              className="min-h-[44px] bg-[#1E1E1E] text-[#F4F4F6] text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-2 rounded-lg border border-[#323640] hover:border-[#FF5500] focus:border-[#FF5500] focus:outline-none transition-colors cursor-pointer max-w-[132px] sm:max-w-[220px] truncate"
            >
              {splits.map((split) => (
                <option key={split.id} value={split.id} className="bg-[#1E1E1E] text-[#F4F4F6]">
                  {split.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onOpenCreateSplit}
            className="min-h-[44px] px-2.5 sm:px-3.5 py-2 rounded-lg bg-[#FF5500] hover:bg-[#FF6B1A] active:scale-[0.98] text-[#121212] font-bold text-xs sm:text-sm flex items-center gap-1 transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Split</span>
          </button>
        </div>
      </div>
    </header>
  );
};
