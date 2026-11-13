import React from 'react';
import { Pause, Play, RotateCcw, Timer, X } from 'lucide-react';

interface RestTimerBannerProps {
  isOpen: boolean;
  secondsLeft: number;
  isRunning: boolean;
  onSelectPreset: (seconds: number) => void;
  onToggleRun: () => void;
  onReset: () => void;
  onClose: () => void;
}

export const RestTimerBanner: React.FC<RestTimerBannerProps> = ({
  isOpen,
  secondsLeft,
  isRunning,
  onSelectPreset,
  onToggleRun,
  onReset,
  onClose,
}) => {
  if (!isOpen) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <div className="bg-[#181A20] border-b border-[#2E323B] px-4 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#00E5FF]">
            <Timer className="w-4 h-4" />
            <span>Recovery Timer</span>
          </div>
          <span className="font-mono-tabular text-lg font-extrabold text-[#F4F4F6] bg-[#121212] px-3 py-1 rounded-lg border border-[#323640]">
            {formatted}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleRun}
              aria-label={isRunning ? 'Pause Rest Timer' : 'Start Rest Timer'}
              className="min-h-[38px] px-3 py-1 rounded-lg bg-[#00E5FF] text-[#121212] font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Pause' : 'Resume'}</span>
            </button>
            <button
              type="button"
              onClick={onReset}
              aria-label="Reset Rest Timer"
              className="min-h-[38px] px-2.5 py-1 rounded-lg bg-[#121212] border border-[#323640] text-[#9CA3AF] hover:text-white text-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9CA3AF] hidden sm:inline">Presets:</span>
          {[60, 90, 120, 180].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="min-h-[36px] px-2.5 py-1 rounded-lg bg-[#121212] border border-[#323640] hover:border-[#00E5FF] font-mono-tabular text-xs font-semibold text-[#D1D5DB] hover:text-[#00E5FF] cursor-pointer"
            >
              {preset}s
            </button>
          ))}
          <button
            type="button"
            onClick={onClose}
            aria-label="Hide Rest Timer"
            className="min-h-[36px] min-w-[36px] rounded-lg bg-[#121212] border border-[#323640] text-[#9CA3AF] hover:text-white flex items-center justify-center cursor-pointer ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
