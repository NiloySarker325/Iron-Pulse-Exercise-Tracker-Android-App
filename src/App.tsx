/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { CreateSplitModal } from './components/CreateSplitModal';
import { DashboardView } from './components/DashboardView';
import { GlobalHeader } from './components/GlobalHeader';
import { HistoryLogbookModal } from './components/HistoryLogbookModal';
import { RestTimerBanner } from './components/RestTimerBanner';
import { WorkoutDayView } from './components/WorkoutDayView';
import { AppWorkoutState, Exercise, SetStatus, WorkoutDay, WorkoutSet } from './types/workout';
import {
  addSetToExercise,
  buildCustomSplit,
  createDefaultState,
  createInitialSampleHistory,
  getTodayIsoDateString,
  getTodayLocaleDateString,
  loadWorkoutStateFromPreferences,
  removeSetFromExercise,
  saveWorkoutStateToPreferences,
  syncDayToWorkoutHistory,
  toggleSetStatusInExercise,
  updateSetMetricsInExercise,
} from './utils/workoutLogic';

export default function App() {
  const [state, setState] = useState<AppWorkoutState>(() => createDefaultState());
  const [isStorageHydrated, setIsStorageHydrated] = useState(false);

  const [isCreateSplitOpen, setIsCreateSplitOpen] = useState(false);
  const [isHistoryLogbookOpen, setIsHistoryLogbookOpen] = useState(false);

  // Rest timer state
  const [isRestTimerOpen, setIsRestTimerOpen] = useState(false);
  const [restSeconds, setRestSeconds] = useState<number>(90);
  const [isRestRunning, setIsRestRunning] = useState(false);

  // Asynchronously load persisted workout state & workoutHistory from @capacitor/preferences on mount
  useEffect(() => {
    let isMounted = true;

    const loadPersistedState = async () => {
      const loadedState = await loadWorkoutStateFromPreferences(
        Preferences,
        getTodayLocaleDateString()
      );
      if (isMounted) {
        setState(loadedState);
        setIsStorageHydrated(true);
      }
    };

    void loadPersistedState();

    return () => {
      isMounted = false;
    };
  }, []);

  // Asynchronously save workout state & workoutHistory to @capacitor/preferences whenever state changes after initial hydration
  useEffect(() => {
    if (!isStorageHydrated) return;

    const persistState = async () => {
      await saveWorkoutStateToPreferences(Preferences, state);
    };

    void persistState();
  }, [state, isStorageHydrated]);

  // Countdown tick for rest timer
  useEffect(() => {
    if (!isRestRunning || restSeconds <= 0) {
      if (restSeconds <= 0) setIsRestRunning(false);
      return;
    }
    const timer = window.setInterval(() => {
      setRestSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRestRunning, restSeconds]);

  const activeSplit =
    state.splits.find((s) => s.id === state.activeSplitId) || state.splits[0];

  const activeDay = activeSplit.days.find((d) => d.id === state.activeDayId) || null;
  const workoutHistory = state.workoutHistory ?? createInitialSampleHistory();

  // Helper to update the currently active WorkoutDay and sync workoutHistory for today
  const updateActiveDay = (updater: (day: WorkoutDay) => WorkoutDay) => {
    if (!activeDay) return;
    setState((prev) => {
      let updatedDaySnapshot: WorkoutDay | null = null;
      const nextSplits = prev.splits.map((split) => {
        if (split.id !== activeSplit.id) return split;
        return {
          ...split,
          days: split.days.map((day) => {
            if (day.id !== activeDay.id) return day;
            updatedDaySnapshot = updater(day);
            return updatedDaySnapshot;
          }),
        };
      });

      const nextHistory = updatedDaySnapshot
        ? syncDayToWorkoutHistory(
            prev.workoutHistory ?? createInitialSampleHistory(),
            updatedDaySnapshot,
            activeSplit.name,
            getTodayIsoDateString()
          )
        : prev.workoutHistory;

      return {
        ...prev,
        splits: nextSplits,
        workoutHistory: nextHistory,
      };
    });
  };

  // Helper to update a specific Exercise inside the active WorkoutDay
  const updateExerciseInActiveDay = (
    exerciseId: string,
    updater: (ex: Exercise) => Exercise
  ) => {
    updateActiveDay((day) => ({
      ...day,
      lastTrained: 'Today',
      exercises: day.exercises.map((ex) => (ex.id === exerciseId ? updater(ex) : ex)),
    }));
  };

  // Handlers for Split management
  const handleSelectSplit = (splitId: string) => {
    setState((prev) => ({
      ...prev,
      activeSplitId: splitId,
      activeDayId: null, // Return to dashboard to display the newly selected split's day cards
    }));
  };

  const handleSaveCustomSplit = (name: string, description: string, dayNames: string[]) => {
    const newSplit = buildCustomSplit(name, description, dayNames);
    setState((prev) => ({
      ...prev,
      splits: [...prev.splits, newSplit],
      activeSplitId: newSplit.id,
      activeDayId: null,
    }));
  };

  const handleDeleteCustomSplit = (splitId: string) => {
    setState((prev) => {
      const remaining = prev.splits.filter((s) => s.id !== splitId);
      const nextSplits = remaining.length > 0 ? remaining : createDefaultState().splits;
      return {
        ...prev,
        splits: nextSplits,
        activeSplitId: nextSplits[0].id,
        activeDayId: null,
      };
    });
  };

  const handleAddDayToActiveSplit = (dayName: string, subtitle: string) => {
    const accents: Array<'orange' | 'green' | 'cyan'> = ['orange', 'cyan', 'green'];
    setState((prev) => ({
      ...prev,
      splits: prev.splits.map((split) => {
        if (split.id !== activeSplit.id) return split;
        const nextIndex = split.days.length + 1;
        const newDay: WorkoutDay = {
          id: `${split.id}-day-${Date.now()}`,
          name: dayName,
          subtitle,
          accentColor: accents[(nextIndex - 1) % accents.length],
          lastTrained: 'Today',
          exercises: [
            {
              id: `ex-${Date.now()}-1`,
              name: 'Primary Compound Lift',
              muscleGroup: `${dayName} · Compound`,
              targetNotes: 'Progressive overload focus',
              usageCount: 1,
              createdAtOrder: 1,
              sets: [
                {
                  id: `set-${Date.now()}-1`,
                  weight: 135,
                  reps: 8,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastStatus: 'completed',
                  lastCompletedDate: 'Previous Session',
                },
                {
                  id: `set-${Date.now()}-2`,
                  weight: 135,
                  reps: 8,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastStatus: 'completed',
                  lastCompletedDate: 'Previous Session',
                },
                {
                  id: `set-${Date.now()}-3`,
                  weight: 135,
                  reps: 8,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastStatus: 'completed',
                  lastCompletedDate: 'Previous Session',
                },
              ],
            },
          ],
        };
        return {
          ...split,
          days: [...split.days, newDay],
        };
      }),
    }));
  };

  // Handlers for Exercise & Set Logging
  const handleAddExercise = (name: string, muscleGroup: string, targetNotes: string) => {
    updateActiveDay((day) => {
      const nextOrder =
        day.exercises.reduce((max, ex) => Math.max(max, ex.createdAtOrder), 0) + 1;
      const now = Date.now();
      const newEx: Exercise = {
        id: `ex-${now}`,
        name,
        muscleGroup,
        targetNotes: targetNotes || undefined,
        usageCount: 1,
        createdAtOrder: nextOrder,
        sets: [
          {
            id: `set-${now}-1`,
            weight: 135,
            reps: 10,
            rpe: 8,
            status: 'pending',
            currentDateStatus: 'pending',
            lastStatus: 'completed',
            lastCompletedDate: 'Previous Session',
          },
          {
            id: `set-${now}-2`,
            weight: 135,
            reps: 10,
            rpe: 8,
            status: 'pending',
            currentDateStatus: 'pending',
            lastStatus: 'completed',
            lastCompletedDate: 'Previous Session',
          },
          {
            id: `set-${now}-3`,
            weight: 135,
            reps: 10,
            rpe: 9,
            status: 'pending',
            currentDateStatus: 'pending',
            lastStatus: 'completed',
            lastCompletedDate: 'Previous Session',
          },
        ],
      };
      return {
        ...day,
        exercises: [...day.exercises, newEx],
      };
    });
  };

  const handleRenameExercise = (exerciseId: string, newName: string) => {
    updateExerciseInActiveDay(exerciseId, (ex) => ({
      ...ex,
      name: newName,
    }));
  };

  const handleDeleteExercise = (exerciseId: string) => {
    updateActiveDay((day) => ({
      ...day,
      exercises: day.exercises.filter((ex) => ex.id !== exerciseId),
    }));
  };

  const handleBoostExerciseUsage = (exerciseId: string) => {
    updateExerciseInActiveDay(exerciseId, (ex) => ({
      ...ex,
      usageCount: ex.usageCount + 1,
    }));
  };

  const handleToggleSetStatus = (exerciseId: string, setId: string, status: SetStatus) => {
    updateExerciseInActiveDay(exerciseId, (ex) =>
      toggleSetStatusInExercise(ex, setId, status, getTodayLocaleDateString())
    );
  };

  const handleUpdateSetMetrics = (
    exerciseId: string,
    setId: string,
    patch: Partial<Pick<WorkoutSet, 'weight' | 'reps' | 'rpe'>>
  ) => {
    updateExerciseInActiveDay(exerciseId, (ex) =>
      updateSetMetricsInExercise(ex, setId, patch)
    );
  };

  const handleAddSet = (exerciseId: string) => {
    updateExerciseInActiveDay(exerciseId, (ex) =>
      addSetToExercise(ex, `set-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`)
    );
  };

  const handleRemoveSet = (exerciseId: string, setId: string) => {
    updateExerciseInActiveDay(exerciseId, (ex) => removeSetFromExercise(ex, setId));
  };

  const handleResetDemoData = () => {
    const fresh = createDefaultState(getTodayLocaleDateString());
    setState(fresh);
    void saveWorkoutStateToPreferences(Preferences, fresh);
  };

  const triggerRestTimer = (seconds: number) => {
    setRestSeconds(seconds);
    setIsRestTimerOpen(true);
    setIsRestRunning(true);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#F4F4F6] flex flex-col">
      <GlobalHeader
        splits={state.splits}
        activeSplitId={activeSplit.id}
        activeDayName={activeDay ? activeDay.name : null}
        onSelectSplit={handleSelectSplit}
        onBackToDashboard={() => setState((prev) => ({ ...prev, activeDayId: null }))}
        onOpenCreateSplit={() => setIsCreateSplitOpen(true)}
        onOpenHistoryLogbook={() => setIsHistoryLogbookOpen(true)}
        onToggleRestTimer={() => setIsRestTimerOpen((prev) => !prev)}
        restTimerSeconds={isRestRunning ? restSeconds : null}
        onResetDemoData={handleResetDemoData}
      />

      <RestTimerBanner
        isOpen={isRestTimerOpen}
        secondsLeft={restSeconds}
        isRunning={isRestRunning}
        onSelectPreset={(sec) => {
          setRestSeconds(sec);
          setIsRestRunning(true);
        }}
        onToggleRun={() => setIsRestRunning((prev) => !prev)}
        onReset={() => {
          setIsRestRunning(false);
          setRestSeconds(90);
        }}
        onClose={() => setIsRestTimerOpen(false)}
      />

      <main className="flex-1 pb-16">
        {activeDay ? (
          <WorkoutDayView
            day={activeDay}
            splitName={activeSplit.name}
            smartSortEnabled={state.smartSortEnabled}
            onToggleSmartSort={() =>
              setState((prev) => ({ ...prev, smartSortEnabled: !prev.smartSortEnabled }))
            }
            onBack={() => setState((prev) => ({ ...prev, activeDayId: null }))}
            onOpenHistoryLogbook={() => setIsHistoryLogbookOpen(true)}
            onAddExercise={handleAddExercise}
            onRenameExercise={handleRenameExercise}
            onDeleteExercise={handleDeleteExercise}
            onBoostExerciseUsage={handleBoostExerciseUsage}
            onToggleSetStatus={handleToggleSetStatus}
            onUpdateSetMetrics={handleUpdateSetMetrics}
            onAddSet={handleAddSet}
            onRemoveSet={handleRemoveSet}
            onTriggerRestTimer={triggerRestTimer}
          />
        ) : (
          <DashboardView
            activeSplit={activeSplit}
            smartSortEnabled={state.smartSortEnabled}
            totalHistorySessions={Object.keys(workoutHistory).length}
            onSelectDay={(dayId) => setState((prev) => ({ ...prev, activeDayId: dayId }))}
            onOpenHistoryLogbook={() => setIsHistoryLogbookOpen(true)}
            onAddDayToSplit={handleAddDayToActiveSplit}
            onDeleteCustomSplit={handleDeleteCustomSplit}
            onOpenCreateSplit={() => setIsCreateSplitOpen(true)}
          />
        )}
      </main>

      <footer className="border-t border-[#262930] bg-[#121212] py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF]">
          <div>
            IRON PULSE — Split & Set-by-Set RPE Tracker · Capacitor Preferences Storage
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setState((prev) => ({ ...prev, activeDayId: null }))}
              className="hover:text-[#F4F4F6] transition-colors cursor-pointer"
            >
              Split Dashboard
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsHistoryLogbookOpen(true)}
              className="hover:text-[#00FF66] transition-colors cursor-pointer"
            >
              History Logbook
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsCreateSplitOpen(true)}
              className="hover:text-[#FF5500] transition-colors cursor-pointer"
            >
              Create Custom Split
            </button>
          </div>
        </div>
      </footer>

      <CreateSplitModal
        isOpen={isCreateSplitOpen}
        onClose={() => setIsCreateSplitOpen(false)}
        onSaveSplit={handleSaveCustomSplit}
      />

      <HistoryLogbookModal
        isOpen={isHistoryLogbookOpen}
        onClose={() => setIsHistoryLogbookOpen(false)}
        workoutHistory={workoutHistory}
      />
    </div>
  );
}
