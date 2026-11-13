import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowUpDown,
  Calendar,
  Check,
  Dumbbell,
  Edit3,
  Flame,
  Plus,
  SkipForward,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react';
import { Exercise, SetStatus, WorkoutDay, WorkoutSet } from '../types/workout';
import { calculateDayMetrics, getOrderedExercises } from '../utils/workoutLogic';

interface WorkoutDayViewProps {
  day: WorkoutDay;
  splitName: string;
  smartSortEnabled: boolean;
  onToggleSmartSort: () => void;
  onBack: () => void;
  onOpenHistoryLogbook: () => void;
  onAddExercise: (name: string, muscleGroup: string, targetNotes: string) => void;
  onRenameExercise: (exerciseId: string, newName: string, newMuscleGroup?: string) => void;
  onDeleteExercise: (exerciseId: string) => void;
  onBoostExerciseUsage: (exerciseId: string) => void;
  onToggleSetStatus: (exerciseId: string, setId: string, status: SetStatus) => void;
  onUpdateSetMetrics: (
    exerciseId: string,
    setId: string,
    patch: Partial<Pick<WorkoutSet, 'weight' | 'reps' | 'rpe'>>
  ) => void;
  onAddSet: (exerciseId: string) => void;
  onRemoveSet: (exerciseId: string, setId: string) => void;
  onTriggerRestTimer: (seconds: number) => void;
}

export const WorkoutDayView: React.FC<WorkoutDayViewProps> = ({
  day,
  splitName,
  smartSortEnabled,
  onToggleSmartSort,
  onBack,
  onOpenHistoryLogbook,
  onAddExercise,
  onRenameExercise,
  onDeleteExercise,
  onBoostExerciseUsage,
  onToggleSetStatus,
  onUpdateSetMetrics,
  onAddSet,
  onRemoveSet,
  onTriggerRestTimer,
}) => {
  const [showAddExerciseForm, setShowAddExerciseForm] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseMuscle, setNewExerciseMuscle] = useState('');
  const [newExerciseNotes, setNewExerciseNotes] = useState('');
  const [addExError, setAddExError] = useState<string | null>(null);

  // Track which exercise is currently being renamed
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState('');

  const metrics = calculateDayMetrics(day);
  const orderedExercises = getOrderedExercises(day.exercises, smartSortEnabled);

  const handleCreateExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newExerciseName.trim();
    if (!trimmed) {
      setAddExError('Please enter an exercise name.');
      return;
    }
    onAddExercise(
      trimmed,
      newExerciseMuscle.trim() || 'Custom Target · Hypertrophy',
      newExerciseNotes.trim()
    );
    setNewExerciseName('');
    setNewExerciseMuscle('');
    setNewExerciseNotes('');
    setAddExError(null);
    setShowAddExerciseForm(false);
  };

  const startEditingExercise = (ex: Exercise) => {
    setEditingExerciseId(ex.id);
    setEditingNameValue(ex.name);
  };

  const commitEditingExercise = (exerciseId: string) => {
    const trimmed = editingNameValue.trim();
    if (trimmed) {
      onRenameExercise(exerciseId, trimmed);
    }
    setEditingExerciseId(null);
    setEditingNameValue('');
  };

  const getRpeColorClass = (rpe: number, isSelected: boolean) => {
    if (!isSelected) {
      return 'bg-zinc-950 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white';
    }
    if (rpe >= 9) {
      return 'bg-[#FF5500] border-[#FF5500] text-zinc-950 font-extrabold';
    }
    if (rpe >= 7) {
      return 'bg-[#00FF66] border-[#00FF66] text-zinc-950 font-extrabold';
    }
    return 'bg-[#00E5FF] border-[#00E5FF] text-zinc-950 font-extrabold';
  };

  // Neon left-border matching current split day accent
  const cardLeftAccentClass =
    day.accentColor === 'orange'
      ? 'border-l-[6px] border-l-[#FF5500]'
      : day.accentColor === 'cyan'
      ? 'border-l-[6px] border-l-cyan-400'
      : 'border-l-[6px] border-l-emerald-500';

  const progressBarFillClass =
    day.accentColor === 'orange'
      ? 'bg-[#FF5500]'
      : day.accentColor === 'cyan'
      ? 'bg-cyan-400'
      : 'bg-emerald-500';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Workout Day Header & Clickable Daily Progress Bar */}
      <section className="bg-zinc-900 border-2 border-zinc-700 rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-zinc-700">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-700 hover:border-[#FF5500] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4 text-[#FF5500]" />
                <span>All {splitName} Days</span>
              </button>
              <div className="text-xs text-zinc-400 hidden sm:flex items-center gap-2">
                <span>{splitName}</span>
                <span aria-hidden="true">/</span>
                <span className="text-emerald-400 font-semibold">{day.name}</span>
              </div>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-wide text-white pt-1">
              {day.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">{day.subtitle}</p>
          </div>

          {/* Action Toolbar: Smart Ordering Toggle & Add Custom Exercise */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onToggleSmartSort}
              aria-pressed={smartSortEnabled}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                smartSortEnabled
                  ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-[#00E5FF]'
                  : 'bg-zinc-950 border-zinc-700 text-zinc-400 hover:text-white'
              }`}
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>
                Smart Order: {smartSortEnabled ? 'Top Frequency First' : 'Creation Order'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddExerciseForm((prev) => !prev)}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#FF6B1A] text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Custom Exercise</span>
            </button>
          </div>
        </div>

        {/* Clickable Main Daily Progress Bar -> Opens Calendar Logbook */}
        <div className="pt-5 pb-5 border-b border-zinc-700">
          <button
            type="button"
            onClick={onOpenHistoryLogbook}
            aria-label="Open History Logbook and Progress Comparison"
            className="w-full text-left group bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 hover:border-emerald-500 rounded-xl p-4 transition-all cursor-pointer space-y-2.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Daily Workout Progress ({metrics.completionPct}%)</span>
                <span className="text-xs font-normal text-zinc-400">
                  — Tap progress bar to open History Logbook & Compare Progress
                </span>
              </div>
              <span className="font-mono-tabular text-xs font-bold text-emerald-400 group-hover:underline">
                View Calendar Logbook ➔
              </span>
            </div>

            <div className="w-full h-3.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-700">
              <div
                className={`h-full ${progressBarFillClass} transition-all duration-300`}
                style={{ width: `${Math.max(4, metrics.completionPct)}%` }}
              />
            </div>
          </button>
        </div>

        {/* Live Workout Day Metrics Strip */}
        <div className="pt-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <div className="text-xs text-zinc-400 font-medium">Session Progress</div>
            <div className="mt-1 font-mono-tabular text-2xl sm:text-3xl font-bold text-[#00FF66]">
              {metrics.completedSets}/{metrics.totalSets}{' '}
              <span className="text-xs font-normal text-zinc-400">sets done</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-zinc-400 font-medium">Active Tonnage</div>
            <div className="mt-1 font-mono-tabular text-2xl sm:text-3xl font-bold text-white">
              {metrics.totalVolumeLbs.toLocaleString()}{' '}
              <span className="text-xs font-normal text-zinc-400">lbs</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-zinc-400 font-medium">Session Fatigue (RPE)</div>
            <div className="mt-1 font-mono-tabular text-2xl sm:text-3xl font-bold text-[#FF5500]">
              {metrics.averageRpe > 0 ? metrics.averageRpe : '—'}{' '}
              <span className="text-xs font-normal text-zinc-400">/ 10 avg</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-zinc-400 font-medium">Skipped & Failed</div>
            <div className="mt-1 font-mono-tabular text-2xl sm:text-3xl font-bold text-[#00E5FF]">
              {metrics.skippedSets} <span className="text-xs font-normal text-zinc-400">skip</span>{' '}
              · <span className="text-[#FF2A54]">{metrics.failedSets}</span>{' '}
              <span className="text-xs font-normal text-zinc-400">fail</span>
            </div>
          </div>
        </div>

        {/* Add Custom Exercise Expandable Form */}
        {showAddExerciseForm && (
          <form
            onSubmit={handleCreateExerciseSubmit}
            className="mt-5 pt-5 border-t border-zinc-700 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-white">
                Add New Movement to {day.name}
              </h2>
              <button
                type="button"
                onClick={() => setShowAddExerciseForm(false)}
                className="text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>

            {addExError && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-[#FF2A54]/15 border border-[#FF2A54] text-xs text-[#FF6B88]"
              >
                {addExError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="new-exercise-name"
                  className="block text-xs font-semibold text-zinc-300 mb-1"
                >
                  Exercise Name *
                </label>
                <input
                  id="new-exercise-name"
                  type="text"
                  value={newExerciseName}
                  onChange={(e) => {
                    setNewExerciseName(e.target.value);
                    if (addExError) setAddExError(null);
                  }}
                  placeholder="e.g., Walking Barbell Lunges"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-white focus:border-[#FF5500] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="new-exercise-muscle"
                  className="block text-xs font-semibold text-zinc-300 mb-1"
                >
                  Target Muscle Group
                </label>
                <input
                  id="new-exercise-muscle"
                  type="text"
                  value={newExerciseMuscle}
                  onChange={(e) => setNewExerciseMuscle(e.target.value)}
                  placeholder="e.g., Quads & Glutes · Unilateral"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-white focus:border-[#FF5500] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="new-exercise-notes"
                  className="block text-xs font-semibold text-zinc-300 mb-1"
                >
                  Execution Cue (Optional)
                </label>
                <input
                  id="new-exercise-notes"
                  type="text"
                  value={newExerciseNotes}
                  onChange={(e) => setNewExerciseNotes(e.target.value)}
                  placeholder="e.g., Controlled knee touch, upright posture"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-white focus:border-[#FF5500] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddExerciseForm(false)}
                className="min-h-[44px] px-4 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-xs font-semibold text-zinc-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2 rounded-lg bg-[#00FF66] hover:bg-[#19FF75] text-zinc-950 font-bold text-xs sm:text-sm cursor-pointer"
              >
                Save Exercise
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Feature 1: High-Contrast Exercise Cards Container */}
      <section aria-label="Exercises List">
        {orderedExercises.length === 0 ? (
          <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-10 text-center space-y-4 shadow-lg">
            <Dumbbell className="w-10 h-10 text-[#FF5500] mx-auto" />
            <h2 className="font-display text-2xl font-bold text-white">
              No Exercises Added Yet
            </h2>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Add your first movement to start logging sets, weight in lbs, reps, and RPE fatigue.
            </p>
            <button
              type="button"
              onClick={() => setShowAddExerciseForm(true)}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#FF5500] text-zinc-950 font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Exercise</span>
            </button>
          </div>
        ) : (
          orderedExercises.map((exercise, exIndex) => {
            const isEditing = editingExerciseId === exercise.id;
            const completedCount = exercise.sets.filter((s) => s.status === 'complete').length;
            const skippedCount = exercise.sets.filter((s) => s.status === 'skip').length;
            const failedCount = exercise.sets.filter((s) => s.status === 'fail').length;

            return (
              <div
                key={exercise.id}
                className="flex flex-col gap-6 mb-8"
              >
                <article
                  className={`bg-zinc-900 border-2 border-zinc-700 ${cardLeftAccentClass} rounded-xl overflow-hidden shadow-lg`}
                >
                  {/* Distinct Exercise Card Header: bg-zinc-800 p-4 border-b border-zinc-700 */}
                  <div className="bg-zinc-800 p-4 border-b border-zinc-700 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300">
                        <span className="font-mono-tabular font-bold text-[#FF5500]">
                          0{exIndex + 1}.
                        </span>
                        <span>{exercise.muscleGroup}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular text-[#00E5FF] flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          Frequency Score: {exercise.usageCount}
                        </span>
                        {exIndex === 0 && smartSortEnabled && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#00FF66] font-semibold">
                              Top Performed Movement
                            </span>
                          </>
                        )}
                      </div>

                      {/* Exercise Title or Inline Rename Form */}
                      {isEditing ? (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <input
                            type="text"
                            aria-label={`Rename ${exercise.name}`}
                            value={editingNameValue}
                            onChange={(e) => setEditingNameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') commitEditingExercise(exercise.id);
                              if (e.key === 'Escape') setEditingExerciseId(null);
                            }}
                            autoFocus
                            className="min-h-[44px] px-3 py-1.5 rounded-lg bg-zinc-950 border border-[#FF5500] text-white font-display text-2xl font-bold tracking-wide focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => commitEditingExercise(exercise.id)}
                            className="min-h-[44px] px-3.5 py-2 rounded-lg bg-[#00FF66] text-zinc-950 font-bold text-xs cursor-pointer"
                          >
                            Save Name
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingExerciseId(null)}
                            className="min-h-[44px] px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between sm:justify-start gap-3 pt-0.5">
                          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-white">
                            {exercise.name}
                          </h2>
                          <button
                            type="button"
                            onClick={() => startEditingExercise(exercise)}
                            aria-label={`Rename ${exercise.name}`}
                            className="min-h-[38px] px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-[#FF5500] text-zinc-300 hover:text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Rename</span>
                          </button>
                        </div>
                      )}

                      {exercise.targetNotes && (
                        <p className="text-xs text-zinc-400">{exercise.targetNotes}</p>
                      )}
                    </div>

                    {/* Header Right Controls: Add Set Button, Boost Frequency & Delete */}
                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-700">
                      <div className="text-xs font-mono-tabular text-zinc-300 mr-1">
                        <span className="text-[#00FF66] font-bold">{completedCount}</span>/
                        {exercise.sets.length} Done
                        {skippedCount > 0 && (
                          <span className="text-[#00E5FF]"> · {skippedCount} Skipped</span>
                        )}
                        {failedCount > 0 && (
                          <span className="text-[#FF2A54]"> · {failedCount} Failed</span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onAddSet(exercise.id)}
                          aria-label={`Add Set to ${exercise.name}`}
                          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-600 hover:border-[#00FF66] text-white hover:text-[#00FF66] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <Plus className="w-4 h-4 text-[#00FF66]" />
                          <span>Add Set ({exercise.sets.length + 1})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onBoostExerciseUsage(exercise.id)}
                          title="Increment completion frequency to prioritize this exercise in Smart Order"
                          className="min-h-[44px] px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-[#00E5FF] text-[#00E5FF] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>+1 Freq ({exercise.usageCount})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteExercise(exercise.id)}
                          aria-label={`Delete exercise ${exercise.name}`}
                          className="min-h-[44px] min-w-[44px] rounded-xl bg-zinc-900 border border-zinc-700 hover:border-[#FF2A54] text-zinc-400 hover:text-[#FF2A54] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Set-by-Set Rows Underneath Header */}
                  <div className="divide-y divide-zinc-800 p-4 sm:p-5">
                    {exercise.sets.map((set, setIdx) => {
                      const setNum = setIdx + 1;
                      const isComplete = set.status === 'complete';
                      const isFail = set.status === 'fail';
                      const isSkip = set.status === 'skip';
                      const lastStatusText = set.lastStatus || 'completed';

                      const rowSurfaceClass = isComplete
                        ? 'bg-[#00FF66]/[0.06]'
                        : isFail
                        ? 'bg-[#FF2A54]/[0.07]'
                        : isSkip
                        ? 'bg-[#00E5FF]/[0.06]'
                        : '';

                      return (
                        <div
                          key={set.id}
                          data-testid={`set-row-${exercise.id}-${setNum}`}
                          className={`py-4 px-2 sm:px-3 transition-colors ${rowSurfaceClass}`}
                        >
                          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-center">
                            {/* Column 1: Set Index + "Last Session" Badge */}
                            <div className="xl:col-span-2 flex items-center justify-between xl:justify-start gap-2">
                              <div className="flex flex-col items-start gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono-tabular text-xs font-bold text-white">
                                    SET 0{setNum}
                                  </span>
                                  <span aria-hidden="true" className="text-zinc-600">
                                    ·
                                  </span>
                                  <span
                                    className={`text-xs font-mono-tabular font-bold ${
                                      isComplete
                                        ? 'text-[#00FF66]'
                                        : isFail
                                        ? 'text-[#FF2A54]'
                                        : isSkip
                                        ? 'text-[#00E5FF]'
                                        : 'text-zinc-400'
                                    }`}
                                  >
                                    {isComplete
                                      ? 'COMPLETED'
                                      : isFail
                                      ? 'FAILED'
                                      : isSkip
                                      ? 'SKIPPED'
                                      : 'TARGET'}
                                  </span>
                                </div>

                                {/* Feature 2: Last Session Badge */}
                                <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-1 rounded font-mono-tabular">
                                  Last: {lastStatusText}
                                </span>
                              </div>

                              {/* Mobile Remove Set Button */}
                              <button
                                type="button"
                                onClick={() => onRemoveSet(exercise.id, set.id)}
                                aria-label={`Remove Set ${setNum} of ${exercise.name}`}
                                className="xl:hidden min-h-[40px] min-w-[40px] rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-400 hover:text-[#FF2A54] flex items-center justify-center cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Column 2: Weight (lbs) & Reps Editable Inputs with Large Steppers */}
                            <div className="xl:col-span-4 grid grid-cols-2 gap-3">
                              {/* Weight (lbs) */}
                              <div>
                                <label
                                  htmlFor={`weight-${set.id}`}
                                  className="block text-[11px] font-semibold text-zinc-400 mb-1"
                                >
                                  Weight (lbs)
                                </label>
                                <div className="flex items-center">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onUpdateSetMetrics(exercise.id, set.id, {
                                        weight: Math.max(0, set.weight - 5),
                                      })
                                    }
                                    aria-label={`Decrease weight Set ${setNum} of ${exercise.name}`}
                                    className="min-h-[44px] px-2.5 rounded-l-lg bg-zinc-800 border border-r-0 border-zinc-700 hover:border-[#FF5500] text-zinc-200 font-mono-tabular text-xs font-bold cursor-pointer"
                                  >
                                    -5
                                  </button>
                                  <input
                                    id={`weight-${set.id}`}
                                    type="number"
                                    inputMode="decimal"
                                    aria-label={`${exercise.name} Set ${setNum} Weight lbs`}
                                    value={set.weight}
                                    onChange={(e) =>
                                      onUpdateSetMetrics(exercise.id, set.id, {
                                        weight: parseFloat(e.target.value) || 0,
                                      })
                                    }
                                    className="w-full min-h-[44px] bg-zinc-950 border-y border-zinc-700 text-center font-mono-tabular text-sm sm:text-base font-bold text-white focus:outline-none focus:border-[#FF5500]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onUpdateSetMetrics(exercise.id, set.id, {
                                        weight: set.weight + 5,
                                      })
                                    }
                                    aria-label={`Increase weight Set ${setNum} of ${exercise.name}`}
                                    className="min-h-[44px] px-2.5 rounded-r-lg bg-zinc-800 border border-l-0 border-zinc-700 hover:border-[#FF5500] text-zinc-200 font-mono-tabular text-xs font-bold cursor-pointer"
                                  >
                                    +5
                                  </button>
                                </div>
                              </div>

                              {/* Reps */}
                              <div>
                                <label
                                  htmlFor={`reps-${set.id}`}
                                  className="block text-[11px] font-semibold text-zinc-400 mb-1"
                                >
                                  Reps
                                </label>
                                <div className="flex items-center">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onUpdateSetMetrics(exercise.id, set.id, {
                                        reps: Math.max(0, set.reps - 1),
                                      })
                                    }
                                    aria-label={`Decrease reps Set ${setNum} of ${exercise.name}`}
                                    className="min-h-[44px] px-2.5 rounded-l-lg bg-zinc-800 border border-r-0 border-zinc-700 hover:border-[#00E5FF] text-zinc-200 font-mono-tabular text-xs font-bold cursor-pointer"
                                  >
                                    -1
                                  </button>
                                  <input
                                    id={`reps-${set.id}`}
                                    type="number"
                                    inputMode="numeric"
                                    aria-label={`${exercise.name} Set ${setNum} Reps`}
                                    value={set.reps}
                                    onChange={(e) =>
                                      onUpdateSetMetrics(exercise.id, set.id, {
                                        reps: parseInt(e.target.value, 10) || 0,
                                      })
                                    }
                                    className="w-full min-h-[44px] bg-zinc-950 border-y border-zinc-700 text-center font-mono-tabular text-sm sm:text-base font-bold text-white focus:outline-none focus:border-[#00E5FF]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onUpdateSetMetrics(exercise.id, set.id, {
                                        reps: set.reps + 1,
                                      })
                                    }
                                    aria-label={`Increase reps Set ${setNum} of ${exercise.name}`}
                                    className="min-h-[44px] px-2.5 rounded-r-lg bg-zinc-800 border border-l-0 border-zinc-700 hover:border-[#00E5FF] text-zinc-200 font-mono-tabular text-xs font-bold cursor-pointer"
                                  >
                                    +1
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Column 3: 1-10 Fatigue Level (RPE) Selector */}
                            <div className="xl:col-span-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
                                  <Flame className="w-3 h-3 text-[#FF5500]" />
                                  Fatigue Level (RPE 1–10)
                                </span>
                                <span className="font-mono-tabular text-xs font-bold text-white">
                                  RPE {set.rpe}
                                </span>
                              </div>
                              <div
                                role="group"
                                aria-label={`${exercise.name} Set ${setNum} Fatigue Level RPE`}
                                className="grid grid-cols-5 sm:grid-cols-10 xl:grid-cols-5 gap-1"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rpeVal) => {
                                  const selected = set.rpe === rpeVal;
                                  return (
                                    <button
                                      key={rpeVal}
                                      type="button"
                                      onClick={() =>
                                        onUpdateSetMetrics(exercise.id, set.id, { rpe: rpeVal })
                                      }
                                      aria-label={`${exercise.name} Set ${setNum} RPE ${rpeVal}`}
                                      aria-pressed={selected}
                                      className={`min-h-[36px] rounded-md border font-mono-tabular text-xs transition-colors cursor-pointer ${getRpeColorClass(
                                        rpeVal,
                                        selected
                                      )}`}
                                    >
                                      {rpeVal}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Column 4: 3 Action States (Complete, Fail, Skip) + Remove */}
                            <div className="xl:col-span-3 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const willComplete = set.status !== 'complete';
                                  onToggleSetStatus(exercise.id, set.id, 'complete');
                                  if (willComplete) {
                                    onTriggerRestTimer(90);
                                  }
                                }}
                                aria-label={`Mark Set ${setNum} of ${exercise.name} Complete`}
                                aria-pressed={isComplete}
                                className={`flex-1 min-h-[44px] px-2.5 py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                                  isComplete
                                    ? 'bg-[#00FF66] border-[#00FF66] text-zinc-950'
                                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-[#00FF66] hover:text-[#00FF66]'
                                }`}
                              >
                                <Check className="w-4 h-4 stroke-[2.5]" />
                                <span>Done</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => onToggleSetStatus(exercise.id, set.id, 'fail')}
                                aria-label={`Mark Set ${setNum} of ${exercise.name} Fail`}
                                aria-pressed={isFail}
                                className={`flex-1 min-h-[44px] px-2.5 py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                                  isFail
                                    ? 'bg-[#FF2A54] border-[#FF2A54] text-white'
                                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-[#FF2A54] hover:text-[#FF2A54]'
                                }`}
                              >
                                <X className="w-4 h-4 stroke-[2.5]" />
                                <span>Fail</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => onToggleSetStatus(exercise.id, set.id, 'skip')}
                                aria-label={`Mark Set ${setNum} of ${exercise.name} Skipped`}
                                aria-pressed={isSkip}
                                className={`flex-1 min-h-[44px] px-2.5 py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                                  isSkip
                                    ? 'bg-[#00E5FF] border-[#00E5FF] text-zinc-950'
                                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-[#00E5FF] hover:text-[#00E5FF]'
                                }`}
                              >
                                <SkipForward className="w-4 h-4 stroke-[2.5]" />
                                <span>Skip</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => onRemoveSet(exercise.id, set.id)}
                                aria-label={`Delete Set ${setNum} of ${exercise.name}`}
                                className="hidden xl:flex min-h-[44px] min-w-[44px] rounded-xl bg-zinc-800 border border-zinc-700 hover:border-[#FF2A54] text-zinc-400 hover:text-[#FF2A54] items-center justify-center transition-colors cursor-pointer shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add Set Row Footer Bar */}
                    <div className="pt-4 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => onAddSet(exercise.id)}
                        aria-label={`Add Set Row to ${exercise.name}`}
                        className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 hover:border-[#00FF66] text-white hover:text-[#00FF66] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Set Row ({exercise.sets.length + 1})</span>
                      </button>

                      <div className="hidden sm:block text-xs text-zinc-400 font-mono-tabular">
                        Exercise Volume:{' '}
                        <strong className="text-white">
                          {exercise.sets
                            .filter((s) => s.status === 'complete')
                            .reduce((sum, s) => sum + s.weight * s.reps, 0)
                            .toLocaleString()}{' '}
                          lbs
                        </strong>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};
