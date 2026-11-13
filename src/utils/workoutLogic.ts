import {
  AppWorkoutState,
  Exercise,
  ExerciseProgressDelta,
  LastSessionStatus,
  LoggedHistoryExercise,
  SetStatus,
  WorkoutDay,
  WorkoutHistoryMap,
  WorkoutSet,
  WorkoutSplit,
} from '../types/workout';

export const STORAGE_KEY = 'iron_pulse_workout_tracker_v1';
export const WORKOUT_HISTORY_STORAGE_KEY = 'iron_pulse_workout_history_v1';

export function getTodayLocaleDateString(): string {
  return new Date().toLocaleDateString();
}

export function getTodayIsoDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function mapSetStatusToLastStatus(
  status: SetStatus,
  fallback: LastSessionStatus = 'completed'
): LastSessionStatus {
  if (status === 'complete') return 'completed';
  if (status === 'fail') return 'failed';
  if (status === 'skip') return 'skipped';
  return fallback;
}

export function createInitialSplits(): WorkoutSplit[] {
  const yesterdayDate = '2026-11-08';
  return [
    {
      id: 'split-ppl',
      name: 'Push/Pull/Legs',
      description: 'Classic 3-day hypertrophy & strength rotation targeting movement patterns.',
      isCustom: false,
      days: [
        {
          id: 'day-push',
          name: 'Push Day',
          subtitle: 'Pectorals · Anterior & Lateral Delts · Triceps',
          accentColor: 'orange',
          lastTrained: '2 days ago',
          exercises: [
            {
              id: 'ex-push-1',
              name: 'Barbell Bench Press',
              muscleGroup: 'Chest · Compound',
              targetNotes: 'Pause 1s on chest, explosive drive',
              usageCount: 14,
              createdAtOrder: 1,
              sets: [
                {
                  id: 'set-p1-1',
                  weight: 185,
                  reps: 8,
                  rpe: 7,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-p1-2',
                  weight: 195,
                  reps: 6,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-p1-3',
                  weight: 205,
                  reps: 5,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-p1-4',
                  weight: 205,
                  reps: 5,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'failed',
                },
              ],
            },
            {
              id: 'ex-push-2',
              name: 'Incline Dumbbell Press',
              muscleGroup: 'Upper Chest · Hypertrophy',
              targetNotes: '30-degree bench angle, deep stretch',
              usageCount: 11,
              createdAtOrder: 2,
              sets: [
                {
                  id: 'set-p2-1',
                  weight: 75,
                  reps: 10,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-p2-2',
                  weight: 75,
                  reps: 10,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-p2-3',
                  weight: 75,
                  reps: 8,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
              ],
            },
            {
              id: 'ex-push-3',
              name: 'Standing Overhead Press',
              muscleGroup: 'Shoulders · Compound',
              targetNotes: 'Strict brace, glutes locked',
              usageCount: 9,
              createdAtOrder: 3,
              sets: [
                {
                  id: 'set-p3-1',
                  weight: 115,
                  reps: 8,
                  rpe: 7,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-p3-2',
                  weight: 120,
                  reps: 6,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-p3-3',
                  weight: 120,
                  reps: 6,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'skipped',
                },
              ],
            },
            {
              id: 'ex-push-4',
              name: 'Cable Lateral Raise',
              muscleGroup: 'Medial Delts · Isolation',
              targetNotes: 'Cuff at wrist, controlled eccentric',
              usageCount: 7,
              createdAtOrder: 4,
              sets: [
                {
                  id: 'set-p4-1',
                  weight: 25,
                  reps: 15,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-p4-2',
                  weight: 25,
                  reps: 15,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-p4-3',
                  weight: 25,
                  reps: 12,
                  rpe: 10,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'failed',
                },
              ],
            },
          ],
        },
        {
          id: 'day-pull',
          name: 'Pull Day',
          subtitle: 'Latissimus Dorsi · Upper Back · Rear Delts · Biceps',
          accentColor: 'cyan',
          lastTrained: 'Yesterday',
          exercises: [
            {
              id: 'ex-pull-1',
              name: 'Weighted Pull-Ups',
              muscleGroup: 'Lats · Vertical Pull',
              targetNotes: 'Dead hang to chin over bar',
              usageCount: 16,
              createdAtOrder: 1,
              sets: [
                {
                  id: 'set-pl1-1',
                  weight: 45,
                  reps: 8,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-pl1-2',
                  weight: 45,
                  reps: 7,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-pl1-3',
                  weight: 45,
                  reps: 6,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
              ],
            },
            {
              id: 'ex-pull-2',
              name: 'Barbell Pendlay Row',
              muscleGroup: 'Mid Back · Explosive',
              targetNotes: 'Reset on floor every rep',
              usageCount: 12,
              createdAtOrder: 2,
              sets: [
                {
                  id: 'set-pl2-1',
                  weight: 185,
                  reps: 8,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-pl2-2',
                  weight: 185,
                  reps: 8,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-pl2-3',
                  weight: 195,
                  reps: 6,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
              ],
            },
            {
              id: 'ex-pull-3',
              name: 'Chest-Supported T-Bar Row',
              muscleGroup: 'Upper Back & Rhomboids',
              targetNotes: '2s squeeze at peak contraction',
              usageCount: 8,
              createdAtOrder: 3,
              sets: [
                {
                  id: 'set-pl3-1',
                  weight: 135,
                  reps: 10,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-pl3-2',
                  weight: 135,
                  reps: 10,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-pl3-3',
                  weight: 135,
                  reps: 9,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'skipped',
                },
              ],
            },
            {
              id: 'ex-pull-4',
              name: 'Incline Dumbbell Curl',
              muscleGroup: 'Biceps Long Head · Isolation',
              targetNotes: 'Keep elbows pinned back',
              usageCount: 6,
              createdAtOrder: 4,
              sets: [
                {
                  id: 'set-pl4-1',
                  weight: 35,
                  reps: 12,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-pl4-2',
                  weight: 35,
                  reps: 10,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-pl4-3',
                  weight: 30,
                  reps: 12,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'failed',
                },
              ],
            },
          ],
        },
        {
          id: 'day-legs',
          name: 'Leg Day',
          subtitle: 'Quadriceps · Hamstrings · Glutes · Calves',
          accentColor: 'green',
          lastTrained: '3 days ago',
          exercises: [
            {
              id: 'ex-leg-1',
              name: 'High Bar Back Squat',
              muscleGroup: 'Quadriceps & Glutes · Compound',
              targetNotes: 'Below parallel, upright torso',
              usageCount: 18,
              createdAtOrder: 1,
              sets: [
                {
                  id: 'set-l1-1',
                  weight: 275,
                  reps: 6,
                  rpe: 7,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-l1-2',
                  weight: 295,
                  reps: 5,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-l1-3',
                  weight: 315,
                  reps: 5,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-l1-4',
                  weight: 315,
                  reps: 5,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'skipped',
                },
              ],
            },
            {
              id: 'ex-leg-2',
              name: 'Romanian Deadlift',
              muscleGroup: 'Hamstrings & Glutes · Hinge',
              targetNotes: 'Push hips back, shave the shins',
              usageCount: 15,
              createdAtOrder: 2,
              sets: [
                {
                  id: 'set-l2-1',
                  weight: 245,
                  reps: 8,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-l2-2',
                  weight: 265,
                  reps: 8,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-l2-3',
                  weight: 265,
                  reps: 8,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-l2-4',
                  weight: 245,
                  reps: 10,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'failed',
                },
              ],
            },
            {
              id: 'ex-leg-3',
              name: 'Leg Press',
              muscleGroup: 'Quadriceps · Machine Volume',
              targetNotes: 'Feet low and shoulder-width, no knee lock',
              usageCount: 11,
              createdAtOrder: 3,
              sets: [
                {
                  id: 'set-l3-1',
                  weight: 450,
                  reps: 12,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-l3-2',
                  weight: 500,
                  reps: 10,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-l3-3',
                  weight: 540,
                  reps: 10,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-l3-4',
                  weight: 540,
                  reps: 8,
                  rpe: 10,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'skipped',
                },
              ],
            },
            {
              id: 'ex-leg-4',
              name: 'Seated Hamstring Curl',
              muscleGroup: 'Hamstrings · Isolation',
              targetNotes: 'Lean slightly forward for max stretch',
              usageCount: 8,
              createdAtOrder: 4,
              sets: [
                {
                  id: 'set-l4-1',
                  weight: 140,
                  reps: 12,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-l4-2',
                  weight: 150,
                  reps: 12,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-l4-3',
                  weight: 150,
                  reps: 10,
                  rpe: 10,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'split-upper-lower',
      name: 'Upper / Lower',
      description: '4-day athletic power-building split balancing heavy compounds and hypertrophy.',
      isCustom: false,
      days: [
        {
          id: 'day-ul-upper-a',
          name: 'Upper Power A',
          subtitle: 'Heavy Horizontal Push & Pull · Overhead Strength',
          accentColor: 'orange',
          lastTrained: '3 days ago',
          exercises: [
            {
              id: 'ex-ul-1',
              name: 'Flat Barbell Bench Press',
              muscleGroup: 'Chest · Power',
              usageCount: 12,
              createdAtOrder: 1,
              sets: [
                {
                  id: 'set-ul1-1',
                  weight: 205,
                  reps: 5,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-ul1-2',
                  weight: 215,
                  reps: 5,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-ul1-3',
                  weight: 225,
                  reps: 4,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
              ],
            },
            {
              id: 'ex-ul-2',
              name: 'Chest-Supported Barbell Row',
              muscleGroup: 'Upper Back · Power',
              usageCount: 10,
              createdAtOrder: 2,
              sets: [
                {
                  id: 'set-ul2-1',
                  weight: 185,
                  reps: 6,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-ul2-2',
                  weight: 195,
                  reps: 6,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-ul2-3',
                  weight: 195,
                  reps: 6,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'skipped',
                },
              ],
            },
          ],
        },
        {
          id: 'day-ul-lower-a',
          name: 'Lower Power A',
          subtitle: 'Heavy Squat · Posterior Chain · Core Stability',
          accentColor: 'green',
          lastTrained: '4 days ago',
          exercises: [
            {
              id: 'ex-ul-3',
              name: 'Low Bar Back Squat',
              muscleGroup: 'Quads & Posterior · Power',
              usageCount: 15,
              createdAtOrder: 1,
              sets: [
                {
                  id: 'set-ul3-1',
                  weight: 315,
                  reps: 5,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-ul3-2',
                  weight: 325,
                  reps: 5,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-ul3-3',
                  weight: 335,
                  reps: 3,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'failed',
                },
              ],
            },
            {
              id: 'ex-ul-4',
              name: 'Conventional Deadlift',
              muscleGroup: 'Posterior Chain · Power',
              usageCount: 13,
              createdAtOrder: 2,
              sets: [
                {
                  id: 'set-ul4-1',
                  weight: 365,
                  reps: 5,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-ul4-2',
                  weight: 385,
                  reps: 3,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
              ],
            },
          ],
        },
        {
          id: 'day-ul-upper-b',
          name: 'Upper Hypertrophy B',
          subtitle: 'Incline Press · Vertical Pull · Arm Volume',
          accentColor: 'cyan',
          lastTrained: '5 days ago',
          exercises: [
            {
              id: 'ex-ul-5',
              name: 'Incline Dumbbell Press',
              muscleGroup: 'Upper Chest · Volume',
              usageCount: 9,
              createdAtOrder: 1,
              sets: [
                {
                  id: 'set-ul5-1',
                  weight: 80,
                  reps: 10,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-ul5-2',
                  weight: 80,
                  reps: 10,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-ul5-3',
                  weight: 80,
                  reps: 9,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
              ],
            },
            {
              id: 'ex-ul-6',
              name: 'Neutral Grip Lat Pulldown',
              muscleGroup: 'Lats · Hypertrophy',
              usageCount: 8,
              createdAtOrder: 2,
              sets: [
                {
                  id: 'set-ul6-1',
                  weight: 160,
                  reps: 12,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-ul6-2',
                  weight: 170,
                  reps: 10,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-ul6-3',
                  weight: 170,
                  reps: 10,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'skipped',
                },
              ],
            },
          ],
        },
        {
          id: 'day-ul-lower-b',
          name: 'Lower Hypertrophy B',
          subtitle: 'Hack Squat · Romanian Deadlift · Unilateral Legs',
          accentColor: 'orange',
          lastTrained: '6 days ago',
          exercises: [
            {
              id: 'ex-ul-7',
              name: 'Hack Squat',
              muscleGroup: 'Quads · Hypertrophy',
              usageCount: 11,
              createdAtOrder: 1,
              sets: [
                {
                  id: 'set-ul7-1',
                  weight: 360,
                  reps: 10,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-ul7-2',
                  weight: 380,
                  reps: 10,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-ul7-3',
                  weight: 380,
                  reps: 8,
                  rpe: 10,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
              ],
            },
            {
              id: 'ex-ul-8',
              name: 'Bulgarian Split Squat',
              muscleGroup: 'Quads & Glutes · Unilateral',
              usageCount: 7,
              createdAtOrder: 2,
              sets: [
                {
                  id: 'set-ul8-1',
                  weight: 65,
                  reps: 10,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-ul8-2',
                  weight: 65,
                  reps: 10,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-ul8-3',
                  weight: 65,
                  reps: 10,
                  rpe: 10,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'skipped',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'split-arnold',
      name: 'Arnold Antagonist Split',
      description: 'High-volume antagonist pairing: Chest & Back, Shoulders & Arms, Legs.',
      isCustom: false,
      days: [
        {
          id: 'day-arn-cb',
          name: 'Chest & Back',
          subtitle: 'Antagonist Superset Pump · Upper Torso Density',
          accentColor: 'orange',
          lastTrained: '4 days ago',
          exercises: [
            {
              id: 'ex-arn-1',
              name: 'Incline Barbell Bench Press',
              muscleGroup: 'Upper Chest',
              usageCount: 10,
              createdAtOrder: 1,
              sets: [
                {
                  id: 'set-a1-1',
                  weight: 175,
                  reps: 10,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-a1-2',
                  weight: 185,
                  reps: 8,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-a1-3',
                  weight: 185,
                  reps: 8,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
              ],
            },
            {
              id: 'ex-arn-2',
              name: 'Wide-Grip Chin-Ups',
              muscleGroup: 'Lats & Teres Major',
              usageCount: 12,
              createdAtOrder: 2,
              sets: [
                {
                  id: 'set-a2-1',
                  weight: 25,
                  reps: 10,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-a2-2',
                  weight: 25,
                  reps: 8,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-a2-3',
                  weight: 25,
                  reps: 8,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'skipped',
                },
              ],
            },
          ],
        },
        {
          id: 'day-arn-sa',
          name: 'Shoulders & Arms',
          subtitle: '3D Deltoids · Biceps & Triceps Superset Volume',
          accentColor: 'cyan',
          lastTrained: '2 days ago',
          exercises: [
            {
              id: 'ex-arn-3',
              name: 'Seated Dumbbell Arnold Press',
              muscleGroup: 'Anterior & Medial Delts',
              usageCount: 11,
              createdAtOrder: 1,
              sets: [
                {
                  id: 'set-a3-1',
                  weight: 65,
                  reps: 10,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-a3-2',
                  weight: 70,
                  reps: 8,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-a3-3',
                  weight: 70,
                  reps: 8,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
              ],
            },
            {
              id: 'ex-arn-4',
              name: 'EZ-Bar Skullcrushers',
              muscleGroup: 'Triceps Long Head',
              usageCount: 9,
              createdAtOrder: 2,
              sets: [
                {
                  id: 'set-a4-1',
                  weight: 85,
                  reps: 12,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-a4-2',
                  weight: 95,
                  reps: 10,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-a4-3',
                  weight: 95,
                  reps: 10,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'failed',
                },
              ],
            },
          ],
        },
        {
          id: 'day-arn-legs',
          name: 'Legs & Abs',
          subtitle: 'High-Volume Squats · Stiff-Leg Deadlifts · Calves',
          accentColor: 'green',
          lastTrained: '1 day ago',
          exercises: [
            {
              id: 'ex-arn-5',
              name: 'High Bar Back Squat',
              muscleGroup: 'Quadriceps & Glutes',
              usageCount: 14,
              createdAtOrder: 1,
              sets: [
                {
                  id: 'set-a5-1',
                  weight: 275,
                  reps: 8,
                  rpe: 8,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-a5-2',
                  weight: 295,
                  reps: 8,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
                {
                  id: 'set-a5-3',
                  weight: 295,
                  reps: 6,
                  rpe: 9,
                  status: 'pending',
                  currentDateStatus: 'pending',
                  lastCompletedDate: yesterdayDate,
                  lastStatus: 'completed',
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}

/**
 * Generates realistic workout history spanning early October to early November 2026
 * so the Calendar Logbook and Date-Range Progress Comparison work immediately on first launch.
 */
export function createInitialSampleHistory(): WorkoutHistoryMap {
  return {
    '2026-10-05': {
      summary: {
        date: '2026-10-05',
        dayId: 'day-push',
        dayName: 'Push Day',
        splitName: 'Push/Pull/Legs',
        accentColor: 'orange',
        totalSets: 11,
        totalVolumeLbs: 9840,
        averageRpe: 7.8,
      },
      exercises: [
        {
          exerciseId: 'ex-push-1',
          name: 'Barbell Bench Press',
          muscleGroup: 'Chest · Compound',
          dayName: 'Push Day',
          topWeight: 185,
          completedSetsCount: 3,
          totalVolumeLbs: 4290,
          sets: [
            { weight: 175, reps: 8, rpe: 7, status: 'completed' },
            { weight: 180, reps: 8, rpe: 8, status: 'completed' },
            { weight: 185, reps: 8, rpe: 8, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-push-2',
          name: 'Incline Dumbbell Press',
          muscleGroup: 'Upper Chest · Hypertrophy',
          dayName: 'Push Day',
          topWeight: 65,
          completedSetsCount: 3,
          totalVolumeLbs: 1950,
          sets: [
            { weight: 65, reps: 10, rpe: 7, status: 'completed' },
            { weight: 65, reps: 10, rpe: 8, status: 'completed' },
            { weight: 65, reps: 10, rpe: 8, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-push-3',
          name: 'Standing Overhead Press',
          muscleGroup: 'Shoulders · Compound',
          dayName: 'Push Day',
          topWeight: 105,
          completedSetsCount: 2,
          totalVolumeLbs: 1680,
          sets: [
            { weight: 105, reps: 8, rpe: 8, status: 'completed' },
            { weight: 105, reps: 8, rpe: 8, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-push-4',
          name: 'Cable Lateral Raise',
          muscleGroup: 'Medial Delts · Isolation',
          dayName: 'Push Day',
          topWeight: 30,
          completedSetsCount: 3,
          totalVolumeLbs: 1920,
          sets: [
            { weight: 30, reps: 14, rpe: 8, status: 'completed' },
            { weight: 30, reps: 12, rpe: 9, status: 'completed' },
            { weight: 30, reps: 12, rpe: 9, status: 'completed' },
          ],
        },
      ],
    },
    '2026-10-07': {
      summary: {
        date: '2026-10-07',
        dayId: 'day-pull',
        dayName: 'Pull Day',
        splitName: 'Push/Pull/Legs',
        accentColor: 'cyan',
        totalSets: 10,
        totalVolumeLbs: 9120,
        averageRpe: 8.0,
      },
      exercises: [
        {
          exerciseId: 'ex-pull-1',
          name: 'Weighted Pull-Ups',
          muscleGroup: 'Lats · Vertical Pull',
          dayName: 'Pull Day',
          topWeight: 35,
          completedSetsCount: 3,
          totalVolumeLbs: 840,
          sets: [
            { weight: 35, reps: 8, rpe: 8, status: 'completed' },
            { weight: 35, reps: 8, rpe: 8, status: 'completed' },
            { weight: 35, reps: 8, rpe: 9, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-pull-2',
          name: 'Barbell Pendlay Row',
          muscleGroup: 'Mid Back · Explosive',
          dayName: 'Pull Day',
          topWeight: 175,
          completedSetsCount: 3,
          totalVolumeLbs: 4200,
          sets: [
            { weight: 175, reps: 8, rpe: 8, status: 'completed' },
            { weight: 175, reps: 8, rpe: 8, status: 'completed' },
            { weight: 175, reps: 8, rpe: 9, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-pull-3',
          name: 'Chest-Supported T-Bar Row',
          muscleGroup: 'Upper Back & Rhomboids',
          dayName: 'Pull Day',
          topWeight: 125,
          completedSetsCount: 2,
          totalVolumeLbs: 2500,
          sets: [
            { weight: 125, reps: 10, rpe: 8, status: 'completed' },
            { weight: 125, reps: 10, rpe: 8, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-pull-4',
          name: 'Incline Dumbbell Curl',
          muscleGroup: 'Biceps Long Head · Isolation',
          dayName: 'Pull Day',
          topWeight: 40,
          completedSetsCount: 2,
          totalVolumeLbs: 1580,
          sets: [
            { weight: 40, reps: 10, rpe: 9, status: 'completed' },
            { weight: 40, reps: 10, rpe: 9, status: 'completed' },
          ],
        },
      ],
    },
    '2026-10-09': {
      summary: {
        date: '2026-10-09',
        dayId: 'day-legs',
        dayName: 'Leg Day',
        splitName: 'Push/Pull/Legs',
        accentColor: 'green',
        totalSets: 11,
        totalVolumeLbs: 23450,
        averageRpe: 8.1,
      },
      exercises: [
        {
          exerciseId: 'ex-leg-1',
          name: 'High Bar Back Squat',
          muscleGroup: 'Quadriceps & Glutes · Compound',
          dayName: 'Leg Day',
          topWeight: 275,
          completedSetsCount: 3,
          totalVolumeLbs: 4830,
          sets: [
            { weight: 265, reps: 6, rpe: 7, status: 'completed' },
            { weight: 270, reps: 6, rpe: 8, status: 'completed' },
            { weight: 275, reps: 6, rpe: 8, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-leg-2',
          name: 'Romanian Deadlift',
          muscleGroup: 'Hamstrings & Glutes · Hinge',
          dayName: 'Leg Day',
          topWeight: 235,
          completedSetsCount: 3,
          totalVolumeLbs: 5640,
          sets: [
            { weight: 235, reps: 8, rpe: 8, status: 'completed' },
            { weight: 235, reps: 8, rpe: 8, status: 'completed' },
            { weight: 235, reps: 8, rpe: 9, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-leg-3',
          name: 'Leg Press',
          muscleGroup: 'Quadriceps · Machine Volume',
          dayName: 'Leg Day',
          topWeight: 480,
          completedSetsCount: 3,
          totalVolumeLbs: 14100,
          sets: [
            { weight: 450, reps: 10, rpe: 8, status: 'completed' },
            { weight: 480, reps: 10, rpe: 8, status: 'completed' },
            { weight: 480, reps: 10, rpe: 9, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-leg-4',
          name: 'Seated Hamstring Curl',
          muscleGroup: 'Hamstrings · Isolation',
          dayName: 'Leg Day',
          topWeight: 135,
          completedSetsCount: 2,
          totalVolumeLbs: 3240,
          sets: [
            { weight: 135, reps: 12, rpe: 8, status: 'completed' },
            { weight: 135, reps: 12, rpe: 9, status: 'completed' },
          ],
        },
      ],
    },
    '2026-10-18': {
      summary: {
        date: '2026-10-18',
        dayId: 'day-push',
        dayName: 'Push Day',
        splitName: 'Push/Pull/Legs',
        accentColor: 'orange',
        totalSets: 12,
        totalVolumeLbs: 11210,
        averageRpe: 8.3,
      },
      exercises: [
        {
          exerciseId: 'ex-push-1',
          name: 'Barbell Bench Press',
          muscleGroup: 'Chest · Compound',
          dayName: 'Push Day',
          topWeight: 195,
          completedSetsCount: 4,
          totalVolumeLbs: 5190,
          sets: [
            { weight: 185, reps: 8, rpe: 8, status: 'completed' },
            { weight: 190, reps: 7, rpe: 8, status: 'completed' },
            { weight: 195, reps: 6, rpe: 8, status: 'completed' },
            { weight: 195, reps: 6, rpe: 9, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-push-2',
          name: 'Incline Dumbbell Press',
          muscleGroup: 'Upper Chest · Hypertrophy',
          dayName: 'Push Day',
          topWeight: 70,
          completedSetsCount: 3,
          totalVolumeLbs: 2100,
          sets: [
            { weight: 70, reps: 10, rpe: 8, status: 'completed' },
            { weight: 70, reps: 10, rpe: 8, status: 'completed' },
            { weight: 70, reps: 10, rpe: 9, status: 'completed' },
          ],
        },
      ],
    },
    '2026-10-25': {
      summary: {
        date: '2026-10-25',
        dayId: 'day-legs',
        dayName: 'Leg Day',
        splitName: 'Push/Pull/Legs',
        accentColor: 'green',
        totalSets: 12,
        totalVolumeLbs: 26820,
        averageRpe: 8.5,
      },
      exercises: [
        {
          exerciseId: 'ex-leg-1',
          name: 'High Bar Back Squat',
          muscleGroup: 'Quadriceps & Glutes · Compound',
          dayName: 'Leg Day',
          topWeight: 295,
          completedSetsCount: 4,
          totalVolumeLbs: 6260,
          sets: [
            { weight: 275, reps: 6, rpe: 8, status: 'completed' },
            { weight: 285, reps: 6, rpe: 8, status: 'completed' },
            { weight: 295, reps: 5, rpe: 9, status: 'completed' },
            { weight: 295, reps: 5, rpe: 9, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-leg-2',
          name: 'Romanian Deadlift',
          muscleGroup: 'Hamstrings & Glutes · Hinge',
          dayName: 'Leg Day',
          topWeight: 250,
          completedSetsCount: 4,
          totalVolumeLbs: 7800,
          sets: [
            { weight: 245, reps: 8, rpe: 8, status: 'completed' },
            { weight: 245, reps: 8, rpe: 8, status: 'completed' },
            { weight: 250, reps: 8, rpe: 9, status: 'completed' },
            { weight: 250, reps: 8, rpe: 9, status: 'completed' },
          ],
        },
      ],
    },
    '2026-11-02': {
      summary: {
        date: '2026-11-02',
        dayId: 'day-push',
        dayName: 'Push Day',
        splitName: 'Push/Pull/Legs',
        accentColor: 'orange',
        totalSets: 13,
        totalVolumeLbs: 11850,
        averageRpe: 8.4,
      },
      exercises: [
        {
          exerciseId: 'ex-push-1',
          name: 'Barbell Bench Press',
          muscleGroup: 'Chest · Compound',
          dayName: 'Push Day',
          topWeight: 205,
          completedSetsCount: 4,
          totalVolumeLbs: 5000,
          sets: [
            { weight: 185, reps: 8, rpe: 7, status: 'completed' },
            { weight: 195, reps: 6, rpe: 8, status: 'completed' },
            { weight: 205, reps: 5, rpe: 9, status: 'completed' },
            { weight: 205, reps: 5, rpe: 9, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-push-2',
          name: 'Incline Dumbbell Press',
          muscleGroup: 'Upper Chest · Hypertrophy',
          dayName: 'Push Day',
          topWeight: 75,
          completedSetsCount: 3,
          totalVolumeLbs: 2100,
          sets: [
            { weight: 75, reps: 10, rpe: 8, status: 'completed' },
            { weight: 75, reps: 10, rpe: 8, status: 'completed' },
            { weight: 75, reps: 8, rpe: 9, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-push-3',
          name: 'Standing Overhead Press',
          muscleGroup: 'Shoulders · Compound',
          dayName: 'Push Day',
          topWeight: 120,
          completedSetsCount: 3,
          totalVolumeLbs: 2360,
          sets: [
            { weight: 115, reps: 8, rpe: 7, status: 'completed' },
            { weight: 120, reps: 6, rpe: 8, status: 'completed' },
            { weight: 120, reps: 6, rpe: 9, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-push-4',
          name: 'Cable Lateral Raise',
          muscleGroup: 'Medial Delts · Isolation',
          dayName: 'Push Day',
          topWeight: 25,
          completedSetsCount: 3,
          totalVolumeLbs: 1050,
          sets: [
            { weight: 25, reps: 15, rpe: 8, status: 'completed' },
            { weight: 25, reps: 15, rpe: 9, status: 'completed' },
            { weight: 25, reps: 12, rpe: 9, status: 'completed' },
          ],
        },
      ],
    },
    '2026-11-04': {
      summary: {
        date: '2026-11-04',
        dayId: 'day-pull',
        dayName: 'Pull Day',
        splitName: 'Push/Pull/Legs',
        accentColor: 'cyan',
        totalSets: 13,
        totalVolumeLbs: 11420,
        averageRpe: 8.5,
      },
      exercises: [
        {
          exerciseId: 'ex-pull-1',
          name: 'Weighted Pull-Ups',
          muscleGroup: 'Lats · Vertical Pull',
          dayName: 'Pull Day',
          topWeight: 45,
          completedSetsCount: 4,
          totalVolumeLbs: 1215,
          sets: [
            { weight: 45, reps: 8, rpe: 8, status: 'completed' },
            { weight: 45, reps: 7, rpe: 8, status: 'completed' },
            { weight: 45, reps: 6, rpe: 9, status: 'completed' },
            { weight: 45, reps: 6, rpe: 9, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-pull-2',
          name: 'Barbell Pendlay Row',
          muscleGroup: 'Mid Back · Explosive',
          dayName: 'Pull Day',
          topWeight: 195,
          completedSetsCount: 4,
          totalVolumeLbs: 5300,
          sets: [
            { weight: 185, reps: 8, rpe: 8, status: 'completed' },
            { weight: 185, reps: 8, rpe: 8, status: 'completed' },
            { weight: 195, reps: 6, rpe: 9, status: 'completed' },
            { weight: 195, reps: 6, rpe: 9, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-pull-3',
          name: 'Chest-Supported T-Bar Row',
          muscleGroup: 'Upper Back & Rhomboids',
          dayName: 'Pull Day',
          topWeight: 135,
          completedSetsCount: 3,
          totalVolumeLbs: 3915,
          sets: [
            { weight: 135, reps: 10, rpe: 8, status: 'completed' },
            { weight: 135, reps: 10, rpe: 9, status: 'completed' },
            { weight: 135, reps: 9, rpe: 9, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-pull-4',
          name: 'Incline Dumbbell Curl',
          muscleGroup: 'Biceps Long Head · Isolation',
          dayName: 'Pull Day',
          topWeight: 35,
          completedSetsCount: 2,
          totalVolumeLbs: 770,
          sets: [
            { weight: 35, reps: 12, rpe: 8, status: 'completed' },
            { weight: 35, reps: 10, rpe: 9, status: 'completed' },
          ],
        },
      ],
    },
    '2026-11-05': {
      summary: {
        date: '2026-11-05',
        dayId: 'day-legs',
        dayName: 'Leg Day',
        splitName: 'Push/Pull/Legs',
        accentColor: 'green',
        totalSets: 14,
        totalVolumeLbs: 31290,
        averageRpe: 8.6,
      },
      exercises: [
        {
          exerciseId: 'ex-leg-1',
          name: 'High Bar Back Squat',
          muscleGroup: 'Quadriceps & Glutes · Compound',
          dayName: 'Leg Day',
          topWeight: 315,
          completedSetsCount: 4,
          totalVolumeLbs: 6275,
          sets: [
            { weight: 275, reps: 6, rpe: 7, status: 'completed' },
            { weight: 295, reps: 5, rpe: 8, status: 'completed' },
            { weight: 315, reps: 5, rpe: 9, status: 'completed' },
            { weight: 315, reps: 5, rpe: 9, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-leg-2',
          name: 'Romanian Deadlift',
          muscleGroup: 'Hamstrings & Glutes · Hinge',
          dayName: 'Leg Day',
          topWeight: 265,
          completedSetsCount: 4,
          totalVolumeLbs: 8650,
          sets: [
            { weight: 245, reps: 8, rpe: 8, status: 'completed' },
            { weight: 265, reps: 8, rpe: 8, status: 'completed' },
            { weight: 265, reps: 8, rpe: 9, status: 'completed' },
            { weight: 245, reps: 10, rpe: 9, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-leg-3',
          name: 'Leg Press',
          muscleGroup: 'Quadriceps · Machine Volume',
          dayName: 'Leg Day',
          topWeight: 540,
          completedSetsCount: 4,
          totalVolumeLbs: 20120,
          sets: [
            { weight: 450, reps: 12, rpe: 8, status: 'completed' },
            { weight: 500, reps: 10, rpe: 8, status: 'completed' },
            { weight: 540, reps: 10, rpe: 9, status: 'completed' },
            { weight: 540, reps: 8, rpe: 10, status: 'completed' },
          ],
        },
        {
          exerciseId: 'ex-leg-4',
          name: 'Seated Hamstring Curl',
          muscleGroup: 'Hamstrings · Isolation',
          dayName: 'Leg Day',
          topWeight: 150,
          completedSetsCount: 3,
          totalVolumeLbs: 4980,
          sets: [
            { weight: 140, reps: 12, rpe: 8, status: 'completed' },
            { weight: 150, reps: 12, rpe: 9, status: 'completed' },
            { weight: 150, reps: 10, rpe: 10, status: 'completed' },
          ],
        },
      ],
    },
  };
}

/**
 * Applies the "Fresh Day" Reset logic across all splits:
 * For every set where set.lastCompletedDate !== currentDate:
 * - Preserves weight, reps, and rpe as today's target.
 * - Preserves or derives lastStatus ('completed' | 'failed' | 'skipped').
 * - Resets status & currentDateStatus to 'pending' so Done/Fail/Skip buttons are neutral today.
 */
export function applyFreshDayResetToSplits(
  splits: WorkoutSplit[],
  currentDate: string = getTodayLocaleDateString()
): WorkoutSplit[] {
  return splits.map((split) => ({
    ...split,
    days: split.days.map((day) => ({
      ...day,
      exercises: day.exercises.map((ex) => ({
        ...ex,
        sets: ex.sets.map((s) => {
          const isSameDay = s.lastCompletedDate === currentDate;
          if (isSameDay) {
            const activeStatus = s.currentDateStatus ?? s.status;
            return {
              ...s,
              status: activeStatus,
              currentDateStatus: activeStatus,
              lastStatus: s.lastStatus ?? mapSetStatusToLastStatus(activeStatus, 'completed'),
            };
          }

          // New Day Reset: preserve weight, reps, rpe, record previous status in lastStatus, reset active buttons
          const previousResult: LastSessionStatus =
            s.status !== 'pending'
              ? mapSetStatusToLastStatus(s.status)
              : s.lastStatus ?? 'completed';

          return {
            ...s,
            status: 'pending',
            currentDateStatus: 'pending',
            lastStatus: previousResult,
            lastCompletedDate: s.lastCompletedDate ?? 'Previous Session',
          };
        }),
      })),
    })),
  }));
}

export function createDefaultState(
  currentDate: string = getTodayLocaleDateString()
): AppWorkoutState {
  const splits = applyFreshDayResetToSplits(createInitialSplits(), currentDate);
  return {
    activeSplitId: splits[0].id, // Defaults to "Push/Pull/Legs"
    activeDayId: null,
    smartSortEnabled: true,
    splits,
    workoutHistory: createInitialSampleHistory(),
  };
}

/**
 * Sorts exercises by usageCount descending (Smart Ordering) with tie-breaking by createdAtOrder.
 * When smartSort is disabled, preserves createdAtOrder.
 */
export function getOrderedExercises(exercises: Exercise[], smartSortEnabled = true): Exercise[] {
  const copy = [...exercises];
  if (!smartSortEnabled) {
    return copy.sort((a, b) => a.createdAtOrder - b.createdAtOrder);
  }
  return copy.sort((a, b) => {
    if (b.usageCount !== a.usageCount) {
      return b.usageCount - a.usageCount;
    }
    return a.createdAtOrder - b.createdAtOrder;
  });
}

/**
 * Updates a set's status (Complete, Fail, Skip, or Pending).
 * Clicking the already-active status toggles it back to 'pending'.
 * Updates lastCompletedDate, lastStatus, and currentDateStatus for the Fresh Day Reset architecture.
 */
export function toggleSetStatusInExercise(
  exercise: Exercise,
  setId: string,
  targetStatus: SetStatus,
  currentDate: string = getTodayLocaleDateString()
): Exercise {
  let usageDelta = 0;

  const updatedSets = exercise.sets.map((s) => {
    if (s.id !== setId) return s;
    const nextStatus: SetStatus = s.status === targetStatus ? 'pending' : targetStatus;

    if (s.status !== 'complete' && nextStatus === 'complete') {
      usageDelta += 1;
    } else if (s.status === 'complete' && nextStatus !== 'complete') {
      usageDelta -= 1;
    }

    const updatedLastStatus: LastSessionStatus =
      nextStatus !== 'pending'
        ? mapSetStatusToLastStatus(nextStatus)
        : s.lastStatus ?? 'completed';

    return {
      ...s,
      status: nextStatus,
      currentDateStatus: nextStatus,
      lastCompletedDate: nextStatus !== 'pending' ? currentDate : s.lastCompletedDate,
      lastStatus: updatedLastStatus,
    };
  });

  return {
    ...exercise,
    usageCount: Math.max(0, exercise.usageCount + usageDelta),
    sets: updatedSets,
  };
}

/**
 * Updates weight, reps, or RPE on a specific set row with bounds clamping.
 */
export function updateSetMetricsInExercise(
  exercise: Exercise,
  setId: string,
  patch: Partial<Pick<WorkoutSet, 'weight' | 'reps' | 'rpe'>>
): Exercise {
  return {
    ...exercise,
    sets: exercise.sets.map((s) => {
      if (s.id !== setId) return s;
      const nextWeight =
        patch.weight !== undefined
          ? Math.max(0, Math.min(2500, Number.isFinite(patch.weight) ? patch.weight : 0))
          : s.weight;
      const nextReps =
        patch.reps !== undefined
          ? Math.max(0, Math.min(500, Number.isFinite(patch.reps) ? Math.round(patch.reps) : 0))
          : s.reps;
      const nextRpe =
        patch.rpe !== undefined
          ? Math.max(1, Math.min(10, Number.isFinite(patch.rpe) ? Math.round(patch.rpe) : 8))
          : s.rpe;
      return {
        ...s,
        weight: nextWeight,
        reps: nextReps,
        rpe: nextRpe,
      };
    }),
  };
}

/**
 * Adds a new set row to an exercise, inheriting the last set's weight/reps/rpe for convenience.
 */
export function addSetToExercise(exercise: Exercise, newSetId: string): Exercise {
  const lastSet = exercise.sets[exercise.sets.length - 1];
  const newSet: WorkoutSet = {
    id: newSetId,
    weight: lastSet ? lastSet.weight : 135,
    reps: lastSet ? lastSet.reps : 8,
    rpe: lastSet ? lastSet.rpe : 8,
    status: 'pending',
    currentDateStatus: 'pending',
    lastStatus: lastSet?.lastStatus ?? 'completed',
    lastCompletedDate: 'Previous Session',
  };
  return {
    ...exercise,
    sets: [...exercise.sets, newSet],
  };
}

/**
 * Removes a set row from an exercise by setId.
 */
export function removeSetFromExercise(exercise: Exercise, setId: string): Exercise {
  const target = exercise.sets.find((s) => s.id === setId);
  const usageDelta = target?.status === 'complete' ? -1 : 0;
  return {
    ...exercise,
    usageCount: Math.max(0, exercise.usageCount + usageDelta),
    sets: exercise.sets.filter((s) => s.id !== setId),
  };
}

/**
 * Calculates aggregate metrics for a WorkoutDay.
 */
export interface DayMetrics {
  totalSets: number;
  completedSets: number;
  failedSets: number;
  skippedSets: number;
  pendingSets: number;
  totalVolumeLbs: number; // Sum of weight * reps for completed sets
  plannedVolumeLbs: number; // Sum of weight * reps for all non-skipped sets
  averageRpe: number;
  completionPct: number;
}

export function calculateDayMetrics(day: WorkoutDay): DayMetrics {
  let totalSets = 0;
  let completedSets = 0;
  let failedSets = 0;
  let skippedSets = 0;
  let pendingSets = 0;
  let totalVolumeLbs = 0;
  let plannedVolumeLbs = 0;
  let rpeSum = 0;
  let rpeCount = 0;

  for (const ex of day.exercises) {
    for (const s of ex.sets) {
      totalSets += 1;
      if (s.status !== 'skip') {
        plannedVolumeLbs += s.weight * s.reps;
      }
      if (s.status === 'complete') {
        completedSets += 1;
        totalVolumeLbs += s.weight * s.reps;
        rpeSum += s.rpe;
        rpeCount += 1;
      } else if (s.status === 'fail') {
        failedSets += 1;
        rpeSum += s.rpe;
        rpeCount += 1;
      } else if (s.status === 'skip') {
        skippedSets += 1;
      } else {
        pendingSets += 1;
      }
    }
  }

  const actionableSets = totalSets - skippedSets;
  const resolvedSets = completedSets + failedSets + skippedSets;
  const completionPct =
    totalSets > 0 ? Math.round((resolvedSets / totalSets) * 100) : 0;

  return {
    totalSets,
    completedSets,
    failedSets,
    skippedSets,
    pendingSets: Math.max(0, actionableSets - completedSets - failedSets),
    totalVolumeLbs,
    plannedVolumeLbs,
    averageRpe: rpeCount > 0 ? Number((rpeSum / rpeCount).toFixed(1)) : 0,
    completionPct,
  };
}

/**
 * Syncs an active WorkoutDay's logged sets into the date-indexed workoutHistory map.
 */
export function syncDayToWorkoutHistory(
  workoutHistory: WorkoutHistoryMap,
  day: WorkoutDay,
  splitName: string,
  isoDateKey: string = getTodayIsoDateString()
): WorkoutHistoryMap {
  const loggedExercises: LoggedHistoryExercise[] = [];
  let totalCompletedOrAttemptedSets = 0;
  let totalVolumeLbs = 0;
  let rpeSum = 0;
  let rpeCount = 0;

  for (const ex of day.exercises) {
    const activeSets = ex.sets.filter((s) => s.status !== 'pending');
    if (activeSets.length === 0) continue;

    let exTopWeight = 0;
    let exCompletedSets = 0;
    let exVolume = 0;

    const mappedSets = activeSets.map((s) => {
      totalCompletedOrAttemptedSets += 1;
      if (s.status === 'complete') {
        exCompletedSets += 1;
        exVolume += s.weight * s.reps;
        totalVolumeLbs += s.weight * s.reps;
        if (s.weight > exTopWeight) exTopWeight = s.weight;
      } else if (s.weight > exTopWeight) {
        exTopWeight = s.weight;
      }
      if (s.status === 'complete' || s.status === 'fail') {
        rpeSum += s.rpe;
        rpeCount += 1;
      }
      return {
        weight: s.weight,
        reps: s.reps,
        rpe: s.rpe,
        status: mapSetStatusToLastStatus(s.status),
      };
    });

    loggedExercises.push({
      exerciseId: ex.id,
      name: ex.name,
      muscleGroup: ex.muscleGroup,
      dayName: day.name,
      topWeight: exTopWeight,
      completedSetsCount: exCompletedSets > 0 ? exCompletedSets : mappedSets.length,
      totalVolumeLbs: exVolume,
      sets: mappedSets,
    });
  }

  if (loggedExercises.length === 0) {
    return workoutHistory;
  }

  return {
    ...workoutHistory,
    [isoDateKey]: {
      summary: {
        date: isoDateKey,
        dayId: day.id,
        dayName: day.name,
        splitName,
        accentColor: day.accentColor,
        totalSets: totalCompletedOrAttemptedSets,
        totalVolumeLbs,
        averageRpe: rpeCount > 0 ? Number((rpeSum / rpeCount).toFixed(1)) : 8.0,
      },
      exercises: loggedExercises,
    },
  };
}

/**
 * Scans workoutHistory between startDate and endDate (inclusive, YYYY-MM-DD),
 * computes Baseline (earliest) vs Current (latest) deltas for every unique exercise,
 * and groups them by their assigned Training Split Day (e.g. "Push Day", "Pull Day", "Leg Day").
 */
export function computeCategorizedProgressComparison(
  workoutHistory: WorkoutHistoryMap,
  startDate: string,
  endDate: string
): Record<string, ExerciseProgressDelta[]> {
  const matchingDates = Object.keys(workoutHistory)
    .filter((dateKey) => dateKey >= startDate && dateKey <= endDate)
    .sort((a, b) => a.localeCompare(b));

  interface ExerciseSnapshot {
    date: string;
    dayName: string;
    muscleGroup: string;
    topWeight: number;
    setsCount: number;
    volumeLbs: number;
  }

  const timelineByExercise = new Map<string, ExerciseSnapshot[]>();

  for (const dateKey of matchingDates) {
    const entry = workoutHistory[dateKey];
    if (!entry || !Array.isArray(entry.exercises)) continue;

    for (const ex of entry.exercises) {
      const key = `${entry.summary.dayName}::${ex.name.trim().toLowerCase()}`;
      const list = timelineByExercise.get(key) ?? [];
      list.push({
        date: dateKey,
        dayName: ex.dayName || entry.summary.dayName,
        muscleGroup: ex.muscleGroup,
        topWeight: ex.topWeight,
        setsCount: ex.completedSetsCount,
        volumeLbs: ex.totalVolumeLbs,
      });
      timelineByExercise.set(key, list);
    }
  }

  const groupedByDay: Record<string, ExerciseProgressDelta[]> = {};

  for (const [compositeKey, snapshots] of timelineByExercise.entries()) {
    if (snapshots.length === 0) continue;
    const baseline = snapshots[0];
    const current = snapshots[snapshots.length - 1];
    // Recover display name from workoutHistory
    const dayName = current.dayName;
    const rawName = compositeKey.split('::')[1];
    const matchingEntry = workoutHistory[current.date]?.exercises.find(
      (e) => e.name.trim().toLowerCase() === rawName
    );
    const displayName = matchingEntry ? matchingEntry.name : rawName;

    const delta: ExerciseProgressDelta = {
      exerciseName: displayName,
      muscleGroup: current.muscleGroup,
      dayName,
      baselineDate: baseline.date,
      currentDate: current.date,
      baselineWeight: baseline.topWeight,
      currentWeight: current.topWeight,
      weightDelta: current.topWeight - baseline.topWeight,
      baselineSets: baseline.setsCount,
      currentSets: current.setsCount,
      setsDelta: current.setsCount - baseline.setsCount,
      baselineVolume: baseline.volumeLbs,
      currentVolume: current.volumeLbs,
      volumeDelta: current.volumeLbs - baseline.volumeLbs,
    };

    if (!groupedByDay[dayName]) {
      groupedByDay[dayName] = [];
    }
    groupedByDay[dayName].push(delta);
  }

  return groupedByDay;
}

/**
 * Creates a new custom WorkoutSplit with provided name, description, and day names.
 */
export function buildCustomSplit(
  splitName: string,
  description: string,
  dayNames: string[],
  idPrefix = `split-${Date.now()}`
): WorkoutSplit {
  const accents: Array<'orange' | 'green' | 'cyan'> = ['orange', 'cyan', 'green'];
  const cleanDays = dayNames
    .map((d) => d.trim())
    .filter(Boolean);

  const finalDays = cleanDays.length > 0 ? cleanDays : ['Day 1 — Full Body'];

  return {
    id: idPrefix,
    name: splitName.trim() || 'Custom Split',
    description: description.trim() || 'Custom training split configured for personal volume goals.',
    isCustom: true,
    days: finalDays.map((dName, idx) => ({
      id: `${idPrefix}-day-${idx + 1}`,
      name: dName,
      subtitle: 'Custom Hypertrophy & Strength Session',
      accentColor: accents[idx % accents.length],
      lastTrained: 'Not started',
      exercises: [
        {
          id: `${idPrefix}-ex-${idx + 1}-1`,
          name: idx === 0 ? 'Barbell Compound Lift' : 'Primary Movement',
          muscleGroup: 'Primary Target · Compound',
          targetNotes: 'Focus on progressive overload and strict form',
          usageCount: 1,
          createdAtOrder: 1,
          sets: [
            {
              id: `${idPrefix}-s-${idx + 1}-1`,
              weight: 135,
              reps: 8,
              rpe: 8,
              status: 'pending',
              currentDateStatus: 'pending',
              lastStatus: 'completed',
              lastCompletedDate: 'Previous Session',
            },
            {
              id: `${idPrefix}-s-${idx + 1}-2`,
              weight: 135,
              reps: 8,
              rpe: 8,
              status: 'pending',
              currentDateStatus: 'pending',
              lastStatus: 'completed',
              lastCompletedDate: 'Previous Session',
            },
            {
              id: `${idPrefix}-s-${idx + 1}-3`,
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
    })),
  };
}

/**
 * Loads and validates state from serialized JSON string, applying the Fresh Day Reset
 * and injecting sample workoutHistory if history is empty.
 */
export function parseStoredWorkoutState(
  rawJson: string | null,
  currentDate: string = getTodayLocaleDateString()
): AppWorkoutState {
  const fallback = createDefaultState(currentDate);
  if (!rawJson) return fallback;

  try {
    const parsed = JSON.parse(rawJson) as Partial<AppWorkoutState>;
    if (!parsed || !Array.isArray(parsed.splits) || parsed.splits.length === 0) {
      return fallback;
    }

    const activeSplitExists = parsed.splits.some((s) => s.id === parsed.activeSplitId);
    const activeSplitId = activeSplitExists ? parsed.activeSplitId! : parsed.splits[0].id;

    const resetSplits = applyFreshDayResetToSplits(parsed.splits, currentDate);
    const hasHistory =
      parsed.workoutHistory && Object.keys(parsed.workoutHistory).length > 0;

    return {
      activeSplitId,
      activeDayId: typeof parsed.activeDayId === 'string' ? parsed.activeDayId : null,
      smartSortEnabled:
        typeof parsed.smartSortEnabled === 'boolean' ? parsed.smartSortEnabled : true,
      splits: resetSplits,
      workoutHistory: hasHistory
        ? { ...createInitialSampleHistory(), ...parsed.workoutHistory }
        : createInitialSampleHistory(),
    };
  } catch {
    return fallback;
  }
}

export interface PreferencesStorageAdapter {
  get(options: { key: string }): Promise<{ value: string | null }>;
  set(options: { key: string; value: string }): Promise<void>;
}

/**
 * Asynchronously loads workout state and workoutHistory from @capacitor/preferences.
 */
export async function loadWorkoutStateFromPreferences(
  storage: PreferencesStorageAdapter,
  currentDate: string = getTodayLocaleDateString()
): Promise<AppWorkoutState> {
  try {
    const [{ value: rawState }, { value: rawHistory }] = await Promise.all([
      storage.get({ key: STORAGE_KEY }),
      storage.get({ key: WORKOUT_HISTORY_STORAGE_KEY }),
    ]);

    const baseState = parseStoredWorkoutState(rawState, currentDate);

    if (rawHistory) {
      try {
        const parsedHistory = JSON.parse(rawHistory) as WorkoutHistoryMap;
        if (parsedHistory && typeof parsedHistory === 'object') {
          baseState.workoutHistory = {
            ...createInitialSampleHistory(),
            ...baseState.workoutHistory,
            ...parsedHistory,
          };
        }
      } catch {
        // Keep baseState.workoutHistory
      }
    }

    return baseState;
  } catch {
    return createDefaultState(currentDate);
  }
}

/**
 * Asynchronously saves workout state and workoutHistory to @capacitor/preferences.
 */
export async function saveWorkoutStateToPreferences(
  storage: PreferencesStorageAdapter,
  state: AppWorkoutState
): Promise<void> {
  try {
    await Promise.all([
      storage.set({
        key: STORAGE_KEY,
        value: JSON.stringify(state),
      }),
      storage.set({
        key: WORKOUT_HISTORY_STORAGE_KEY,
        value: JSON.stringify(state.workoutHistory ?? {}),
      }),
    ]);
  } catch {
    // Ignore storage errors in restricted environments
  }
}
