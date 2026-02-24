import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AppState, Workout, WorkoutExercise, WorkoutSet, Exercise, Routine, UserSettings } from '../types'

// Local storage key
const STORAGE_KEY = 'hevy_state'

// Initial state
const initialState: AppState = {
  // Current workout
  activeWorkout: null,
  
  // History
  workouts: [],
  
  // Routines
  routines: [],
  
  // PRs
  personalRecords: [],
  
  // Settings
  settings: {
    name: 'Guest',
    units: 'metric',
    theme: 'system',
    defaultRestTime: 90,
    showWarmupSets: true,
    soundEnabled: true,
    hapticEnabled: false,
  },
  
  // UI state
  isRestTimerActive: false,
  restTimeRemaining: 0,
}

// Create store with persistence
export const useHevyStore = create<AppState>()(
  persist(
    (state) => ({
      activeWorkout: state.activeWorkout,
      workouts: state.workouts,
      routines: state.routines,
      personalRecords: state.personalRecords,
      settings: state.settings,
      isRestTimerActive: state.isRestTimerActive,
      restTimeRemaining: state.restTimeRemaining,
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'),
    }
  )
)

// Actions
export const workoutActions = {
  setActiveWorkout: (workout: Workout | null) => 
    set({ activeWorkout: workout }),
  
  completeWorkout: () => 
    set(state => {
      if (!state.activeWorkout) return
      const workout = { ...state.activeWorkout, completedAt: new Date().toISOString() }
      set({ activeWorkout: null })
      set(state => ({
        ...state,
        workouts: [workout, ...state.workouts],
        personalRecords: updatePersonalRecords(state, workout),
      }))
    }),
  
  addExerciseToWorkout: (exercise: Exercise) => 
    set(state => {
      if (!state.activeWorkout) return
      
      const newExercise: WorkoutExercise = {
        id: crypto.randomUUID(),
        exerciseId: exercise.id,
        exercise,
        sets: [{
          id: crypto.randomUUID(),
          weight: null,
          reps: 8,
          duration: null,
          completed: false,
          isWarmup: false,
          isDropset: false,
          isFailure: false,
        }],
        restTime: state.settings.defaultRestTime,
        order: state.activeWorkout?.exercises.length || 0,
      }
      
      set({ activeWorkout: {
        ...state.activeWorkout!,
        exercises: [...(state.activeWorkout?.exercises || []), newExercise],
      } as Workout })
    }),
  
  startNewWorkout: (templateId?: string) =>
    set(state => {
      const templateWorkout = state.routines.find(r => r.id === templateId)
      const newWorkout: Workout = templateWorkout ? {
        id: crypto.randomUUID(),
        name: templateWorkout.name,
        startedAt: new Date().toISOString(),
        exercises: templateWorkout.exercises.map((re, idx) => ({
          id: crypto.randomUUID(),
          exerciseId: re.exerciseId,
          order: idx,
          sets: [{
            id: crypto.randomUUID(),
            weight: null,
            reps: re.reps || 8,
            duration: re.duration || null,
            completed: false,
            isWarmup: re.isWarmup || false,
            isDropset: false,
            isFailure: false,
          }],
        })),
        templateId,
      } : {
        id: crypto.randomUUID(),
        name: 'Quick Workout',
        startedAt: new Date().toISOString(),
        exercises: [],
        notes: '',
      }
      
      set({ activeWorkout: newWorkout })
    }),
  
  completeSet: (exerciseId: string, setId: string) =>
    set(state => {
      if (!state.activeWorkout) return
      
      set(state => {
        activeWorkout: {
          ...state.activeWorkout!,
          exercises: state.activeWorkout!.exercises.map(exercise => {
            if (exercise.exerciseId === exerciseId) {
              return {
                ...exercise,
                sets: exercise.sets.map(set => 
                  set.id === setId ? { ...set, completed: true } : set
                ),
              }
            }
            return exercise
          }),
        } as Workout
      })
    }),
  
  updateSet: (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) =>
    set(state => {
      if (!state.activeWorkout) return
      
      set(state => {
        activeWorkout: {
          ...state.activeWorkout!,
          exercises: state.activeWorkout!.exercises.map(exercise => {
            if (exercise.exerciseId === exerciseId) {
              return {
                ...exercise,
                sets: exercise.sets.map(set => 
                  set.id === setId ? { ...set, ...updates } : set
                ),
              }
            }
            return exercise
          }),
        } as Workout
      })
    }),
}

// Helper to update personal records
function updatePersonalRecords(state: AppState, workout: Workout): AppState {
  if (!workout.completedAt) return state
  
  const workoutVolume = workout.exercises.reduce((total, exercise) => {
    const exerciseVolume = exercise.sets.reduce((exerciseTotal, set) => {
      if (set.weight && set.reps) {
        return exerciseTotal + (set.weight * set.reps)
      }
      if (set.duration) {
        return exerciseTotal + set.duration
      }
      return exerciseTotal
    }, 0)
    
    return {
      ...state,
      personalRecords: state.personalRecords.map(record => {
        // Keep the best record for each exercise
        if (record.workoutId === workout.id && record.value < workoutVolume) {
          return {
            ...record,
            value: workoutVolume,
            workoutId: workout.id,
            date: workout.startedAt.split('T')[0],
          }
        }
        return record
      })
    }
}

// Settings actions
export const settingsActions = {
  updateSettings: (settings: Partial<UserSettings>) =>
    set(state => ({ settings: { ...state.settings, ...settings } })),
  
  updateTheme: (theme: 'light' | 'dark' | 'system') =>
    set(state => ({ 
      settings: { ...state.settings, theme } 
    })),
  
  toggleRestTimer: () =>
    set(state => ({ isRestTimerActive: !state.isRestTimerActive })),
  
  setRestTimer: (active: boolean, timeRemaining: number = 0) =>
    set({ isRestTimerActive: active, restTimeRemaining: timeRemaining }),
}

// Selectors
export const selectActiveWorkout = (state: AppState) => state.activeWorkout
export const selectWorkouts = (state: AppState) => state.workouts
export const selectRoutines = (state: AppState) => state.routines
export const selectPersonalRecords = (state: AppState) => state.personalRecords
export const selectSettings = (state: AppState) => state.settings
export const selectIsRestTimerActive = (state: AppState) => state.isRestTimerActive
export const selectRestTimeRemaining = (state: AppState) => state.restTimeRemaining
