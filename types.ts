
export type MuscleGroup = '胸' | '肩' | '背' | '腿' | '胳膊' | '核心' | '有氧';

export interface Exercise {
  id: string;
  name: string;
  group: MuscleGroup;
  isCustom: boolean;
}

export interface SetRecord {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  group: MuscleGroup;
  sets: SetRecord[];
}

export interface DailyLog {
  id: string;
  date: string; // ISO string
  exercises: WorkoutExercise[];
  mood: string;
  notes: string;
  weight?: number;
  bodyFat?: number;
}

export interface PRRecord {
  type: 'Squat' | 'Bench' | 'Deadlift';
  weight: number;
  date: string;
}

export interface AppState {
  logs: DailyLog[];
  customExercises: Exercise[];
  remindersEnabled: boolean;
  reminderTime: string;
}
