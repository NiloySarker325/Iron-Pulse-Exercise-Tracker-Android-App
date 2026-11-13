import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STORAGE_KEY,
  WORKOUT_HISTORY_STORAGE_KEY,
  addSetToExercise,
  applyFreshDayResetToSplits,
  buildCustomSplit,
  calculateDayMetrics,
  computeCategorizedProgressComparison,
  createDefaultState,
  createInitialSampleHistory,
  getOrderedExercises,
  loadWorkoutStateFromPreferences,
  removeSetFromExercise,
  saveWorkoutStateToPreferences,
  syncDayToWorkoutHistory,
  toggleSetStatusInExercise,
  updateSetMetricsInExercise,
} from './workoutLogic';

test('default state initializes Push/Pull/Legs with Push Day, Pull Day, and Leg Day', () => {
  const state = createDefaultState('11/12/2026');
  assert.equal(state.activeSplitId, 'split-ppl');
  const activeSplit = state.splits.find((s) => s.id === state.activeSplitId);
  assert.ok(activeSplit);
  assert.equal(activeSplit.name, 'Push/Pull/Legs');
  assert.deepEqual(
    activeSplit.days.map((d) => d.name),
    ['Push Day', 'Pull Day', 'Leg Day']
  );

  const legDay = activeSplit.days.find((d) => d.name === 'Leg Day');
  assert.ok(legDay);
  const exerciseNames = legDay.exercises.map((e) => e.name);
  assert.ok(exerciseNames.includes('High Bar Back Squat'));
  assert.ok(exerciseNames.includes('Romanian Deadlift'));
  assert.ok(exerciseNames.includes('Leg Press'));
});

test('Fresh Day Reset clears yesterday status to pending while keeping weight/reps/rpe and setting lastStatus', () => {
  const stateYesterday = createDefaultState('11/11/2026');
  const legDay = stateYesterday.splits[0].days.find((d) => d.id === 'day-legs')!;
  const squat = legDay.exercises[0];

  // User completes Set 1 and skips Set 4 on 11/11/2026
  const afterSet1 = toggleSetStatusInExercise(squat, squat.sets[0].id, 'complete', '11/11/2026');
  const afterSet4 = toggleSetStatusInExercise(afterSet1, squat.sets[3].id, 'skip', '11/11/2026');
  assert.equal(afterSet4.sets[0].status, 'complete');
  assert.equal(afterSet4.sets[0].lastCompletedDate, '11/11/2026');
  assert.equal(afterSet4.sets[3].status, 'skip');

  // Now simulate loading the app on a new day (11/12/2026)
  const splitsWithYesterdayData = stateYesterday.splits.map((sp, sIdx) =>
    sIdx === 0
      ? {
          ...sp,
          days: sp.days.map((d) =>
            d.id === 'day-legs' ? { ...d, exercises: [afterSet4] } : d
          ),
        }
      : sp
  );

  const resetForToday = applyFreshDayResetToSplits(splitsWithYesterdayData, '11/12/2026');
  const todaySquat = resetForToday[0].days.find((d) => d.id === 'day-legs')!.exercises[0];

  // Numerical targets remain untouched
  assert.equal(todaySquat.sets[0].weight, 275);
  assert.equal(todaySquat.sets[0].reps, 6);
  assert.equal(todaySquat.sets[0].rpe, 7);

  // Action buttons are reset to neutral ('pending'), while lastStatus preserves yesterday's outcome
  assert.equal(todaySquat.sets[0].status, 'pending');
  assert.equal(todaySquat.sets[0].currentDateStatus, 'pending');
  assert.equal(todaySquat.sets[0].lastStatus, 'completed');
  assert.equal(todaySquat.sets[3].status, 'pending');
  assert.equal(todaySquat.sets[3].lastStatus, 'skipped');
});

test('smart ordering automatically sorts exercises by usageCount descending', () => {
  const state = createDefaultState();
  const legDay = state.splits[0].days.find((d) => d.id === 'day-legs')!;

  const boosted = legDay.exercises.map((ex) =>
    ex.name === 'Leg Press' ? { ...ex, usageCount: 25 } : ex
  );

  const ordered = getOrderedExercises(boosted, true);
  assert.equal(ordered[0].name, 'Leg Press');
  assert.equal(ordered[1].name, 'High Bar Back Squat');

  const chronological = getOrderedExercises(boosted, false);
  assert.equal(chronological[0].name, 'High Bar Back Squat');
});

test('updating weight, reps, and RPE clamps values to valid gym ranges', () => {
  const state = createDefaultState();
  const squat = state.splits[0].days[2].exercises[0];
  const set1Id = squat.sets[0].id;

  const updated = updateSetMetricsInExercise(squat, set1Id, {
    weight: 315,
    reps: 10,
    rpe: 12,
  });

  assert.equal(updated.sets[0].weight, 315);
  assert.equal(updated.sets[0].reps, 10);
  assert.equal(updated.sets[0].rpe, 10);
});

test('adding and removing sets updates volume and metrics cleanly', () => {
  const state = createDefaultState();
  const rdl = state.splits[0].days[2].exercises[1];
  const initialLength = rdl.sets.length;

  const withAdded = addSetToExercise(rdl, 'custom-set-99');
  assert.equal(withAdded.sets.length, initialLength + 1);
  assert.equal(withAdded.sets[withAdded.sets.length - 1].id, 'custom-set-99');

  const withRemoved = removeSetFromExercise(withAdded, 'custom-set-99');
  assert.equal(withRemoved.sets.length, initialLength);
});

test('Date-Range Progress Comparison aggregates by Training Split Day and calculates positive and negative deltas', () => {
  const sampleHistory = createInitialSampleHistory();
  const grouped = computeCategorizedProgressComparison(
    sampleHistory,
    '2026-10-05',
    '2026-11-05'
  );

  assert.ok(grouped['Push Day']);
  assert.ok(grouped['Pull Day']);
  assert.ok(grouped['Leg Day']);

  const benchDelta = grouped['Push Day'].find((e) => e.exerciseName === 'Barbell Bench Press');
  assert.ok(benchDelta);
  assert.equal(benchDelta.baselineWeight, 185);
  assert.equal(benchDelta.currentWeight, 205);
  assert.equal(benchDelta.weightDelta, 20);
  assert.equal(benchDelta.baselineSets, 3);
  assert.equal(benchDelta.currentSets, 4);
  assert.equal(benchDelta.setsDelta, 1);

  // Verify negative progress delta handling (Cable Lateral Raise dropped from 30 lbs to 25 lbs)
  const lateralDelta = grouped['Push Day'].find((e) => e.exerciseName === 'Cable Lateral Raise');
  assert.ok(lateralDelta);
  assert.equal(lateralDelta.baselineWeight, 30);
  assert.equal(lateralDelta.currentWeight, 25);
  assert.equal(lateralDelta.weightDelta, -5);
});

test('asynchronous @capacitor/preferences storage adapter saves and loads same-day state and workoutHistory', async () => {
  const memoryStore = new Map<string, string>();
  const mockPreferences = {
    async get({ key }: { key: string }) {
      return { value: memoryStore.get(key) ?? null };
    },
    async set({ key, value }: { key: string; value: string }) {
      memoryStore.set(key, value);
    },
  };

  const todayStr = '11/12/2026';
  const customSplit = buildCustomSplit(
    'Powerbuilding 4-Day',
    'Heavy compounds + accessories',
    ['Bench Focus', 'Deadlift Focus'],
    'split-custom-test'
  );

  const state = createDefaultState(todayStr);
  const updatedSplits = state.splits.map((sp) => {
    if (sp.id !== 'split-ppl') return sp;
    return {
      ...sp,
      days: sp.days.map((d) => {
        if (d.id !== 'day-legs') return d;
        return {
          ...d,
          exercises: d.exercises.map((ex, idx) =>
            idx === 0 ? toggleSetStatusInExercise(ex, ex.sets[3].id, 'skip', todayStr) : ex
          ),
        };
      }),
    };
  });

  const updatedLegDay = updatedSplits[0].days.find((d) => d.id === 'day-legs')!;
  const updatedHistory = syncDayToWorkoutHistory(
    state.workoutHistory ?? {},
    updatedLegDay,
    'Push/Pull/Legs',
    '2026-11-12'
  );

  const modifiedState = {
    ...state,
    splits: [...updatedSplits, customSplit],
    workoutHistory: updatedHistory,
  };

  await saveWorkoutStateToPreferences(mockPreferences, modifiedState);
  assert.ok(memoryStore.has(STORAGE_KEY));
  assert.ok(memoryStore.has(WORKOUT_HISTORY_STORAGE_KEY));

  // Reloading on the same day preserves Set 4's skipped status and the 2026-11-12 history entry
  const restored = await loadWorkoutStateFromPreferences(mockPreferences, todayStr);
  const restoredLegDay = restored.splits[0].days.find((d) => d.id === 'day-legs')!;
  assert.equal(restoredLegDay.exercises[0].sets[3].status, 'skip');
  assert.equal(restored.splits.length, 4);
  assert.ok(restored.workoutHistory?.['2026-11-12']);

  const metrics = calculateDayMetrics(restoredLegDay);
  assert.equal(metrics.skippedSets, 1);
});
