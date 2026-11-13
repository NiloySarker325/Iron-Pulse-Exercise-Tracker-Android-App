export type SetStatus = 'pending' | 'complete' | 'fail' | 'skip';

export type LastSessionStatus = 'completed' | 'failed' | 'skipped';

export interface WorkoutSet {
  id: string;
  weight: number; // in lbs
  reps: number;
  rpe: number; // 1 to 10 Fatigue Level
  status: SetStatus;
  // Extended fields for "Fresh Day" Reset & "Last Session" Badge
  lastCompletedDate?: string;
  lastStatus?: LastSessionStatus;
  currentDateStatus?: SetStatus;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  targetNotes?: string;
  usageCount: number; // Internal usage/completion counter for Smart Ordering
  createdAtOrder: number;
  sets: WorkoutSet[];
}

export interface WorkoutDay {
  id: string;
  name: string;
  subtitle: string;
  accentColor: 'orange' | 'green' | 'cyan';
  lastTrained?: string;
  exercises: Exercise[];
}

export interface WorkoutSplit {
  id: string;
  name: string;
  description: string;
  isCustom?: boolean;
  days: WorkoutDay[];
}

export interface LoggedHistorySet {
  weight: number;
  reps: number;
  rpe: number;
  status: 'completed' | 'failed' | 'skipped';
}

export interface LoggedHistoryExercise {
  exerciseId: string;
  name: string;
  muscleGroup: string;
  dayName: string;
  topWeight: number;
  completedSetsCount: number;
  totalVolumeLbs: number;
  sets: LoggedHistorySet[];
}

export interface WorkoutHistorySummary {
  date: string; // YYYY-MM-DD
  dayId: string;
  dayName: string;
  splitName: string;
  accentColor: 'orange' | 'green' | 'cyan';
  totalSets: number;
  totalVolumeLbs: number;
  averageRpe: number;
}

export interface WorkoutHistoryEntry {
  summary: WorkoutHistorySummary;
  exercises: LoggedHistoryExercise[];
}

export type WorkoutHistoryMap = Record<string, WorkoutHistoryEntry>;

export interface ExerciseProgressDelta {
  exerciseName: string;
  muscleGroup: string;
  dayName: string;
  baselineDate: string;
  currentDate: string;
  baselineWeight: number;
  currentWeight: number;
  weightDelta: number;
  baselineSets: number;
  currentSets: number;
  setsDelta: number;
  baselineVolume: number;
  currentVolume: number;
  volumeDelta: number;
}

export interface AppWorkoutState {
  activeSplitId: string;
  activeDayId: string | null; // null means Main Dashboard view
  smartSortEnabled: boolean;
  splits: WorkoutSplit[];
  workoutHistory?: WorkoutHistoryMap;
}
