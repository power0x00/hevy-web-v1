// Muscle groups
export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'biceps' 
  | 'triceps' 
  | 'forearms'
  | 'abs' 
  | 'quads' 
  | 'hamstrings' 
  | 'glutes' 
  | 'calves'
  | 'cardio'
  | 'full_body'

export type Equipment = 
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell'
  | 'bands'
  | 'other'

// Exercise from library
export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  equipment: Equipment
  isCompound: boolean
  description?: string
  instructions?: string[]
}

// A set within a workout
export interface WorkoutSet {
  id: string
  weight: number | null
  reps: number | null
  duration: number | null // seconds for time-based exercises
  completed: boolean
  isWarmup: boolean
  isDropset: boolean
  isFailure: boolean
  completedAt?: string
}

// An exercise within a workout
export interface WorkoutExercise {
  id: string
  exerciseId: string
  exercise?: Exercise
  notes: string
  supersetId: string | null
  sets: WorkoutSet[]
  restTime: number // seconds
  order: number
}

// A complete workout
export interface Workout {
  id: string
  name: string
  startedAt: string
  completedAt: string | null
  duration: number // seconds
  notes: string
  exercises: WorkoutExercise[]
  bodyweight: number | null
  templateId: string | null
}

// Routine template
export interface Routine {
  id: string
  name: string
  description: string
  exercises: Omit<WorkoutExercise, 'id' | 'supersetId'>[]
  scheduledDays: number[] // 0-6 for days of week
  createdAt: string
  updatedAt: string
}

// Personal record
export interface PersonalRecord {
  id: string
  exerciseId: string
  type: 'weight' | 'reps' | 'volume'
  value: number
  workoutId: string
  date: string
}

// User settings
export interface UserSettings {
  name: string
  units: 'metric' | 'imperial'
  theme: 'light' | 'dark' | 'system'
  defaultRestTime: number // seconds
  showWarmupSets: boolean
  soundEnabled: boolean
  hapticEnabled: boolean
}

// App state
export interface AppState {
  // Current workout
  activeWorkout: Workout | null
  
  // History
  workouts: Workout[]
  
  // Routines
  routines: Routine[]
  
  // PRs
  personalRecords: PersonalRecord[]
  
  // Settings
  settings: UserSettings
  
  // UI state
  isRestTimerActive: boolean
  restTimeRemaining: number
}
