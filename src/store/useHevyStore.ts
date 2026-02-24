import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Workout, WorkoutExercise, WorkoutSet, Exercise, Routine, PersonalRecord, UserSettings } from '../types'

interface HevyState {
  // Data
  activeWorkout: Workout | null
  workouts: Workout[]
  routines: Routine[]
  personalRecords: PersonalRecord[]
  settings: UserSettings
  
  // UI State
  isRestTimerActive: boolean
  restTimeRemaining: number
  
  // Workout Actions
  startWorkout: (name?: string, templateId?: string) => void
  addExercise: (exercise: Exercise) => void
  removeExercise: (exerciseId: string) => void
  addSet: (exerciseId: string) => void
  removeSet: (exerciseId: string, setId: string) => void
  updateSet: (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => void
  completeSet: (exerciseId: string, setId: string) => void
  completeWorkout: () => void
  cancelWorkout: () => void
  
  // Routine Actions
  createRoutine: (routine: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>) => void
  deleteRoutine: (id: string) => void
  
  // Settings Actions
  updateSettings: (settings: Partial<UserSettings>) => void
  
  // Timer Actions
  startRestTimer: (seconds: number) => void
  stopRestTimer: () => void
  tickRestTimer: () => void
}

const defaultSettings: UserSettings = {
  name: 'Athlete',
  units: 'metric',
  theme: 'system',
  defaultRestTime: 90,
  showWarmupSets: true,
  soundEnabled: true,
  hapticEnabled: false,
}

export const useHevyStore = create<HevyState>()(
  persist(
    (set, get) => ({
      // Initial state
      activeWorkout: null,
      workouts: [],
      routines: [],
      personalRecords: [],
      settings: defaultSettings,
      isRestTimerActive: false,
      restTimeRemaining: 0,
      
      // Workout Actions
      startWorkout: (name = 'Quick Workout', templateId) => {
        const state = get()
        const routine = templateId ? state.routines.find(r => r.id === templateId) : null
        
        const workout: Workout = {
          id: crypto.randomUUID(),
          name,
          startedAt: new Date().toISOString(),
          completedAt: null,
          duration: 0,
          notes: '',
          exercises: routine ? routine.exercises.map((re, idx) => ({
            id: crypto.randomUUID(),
            exerciseId: re.exerciseId,
            notes: re.notes || '',
            supersetId: null,
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
            order: idx,
          })) : [],
          bodyweight: null,
          templateId: templateId || null,
        }
        
        set({ activeWorkout: workout })
      },
      
      addExercise: (exercise: Exercise) => {
        const state = get()
        if (!state.activeWorkout) return
        
        const newExercise: WorkoutExercise = {
          id: crypto.randomUUID(),
          exerciseId: exercise.id,
          notes: '',
          supersetId: null,
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
          order: state.activeWorkout.exercises.length,
        }
        
        set({
          activeWorkout: {
            ...state.activeWorkout,
            exercises: [...state.activeWorkout.exercises, newExercise],
          }
        })
      },
      
      removeExercise: (exerciseId: string) => {
        const state = get()
        if (!state.activeWorkout) return
        
        set({
          activeWorkout: {
            ...state.activeWorkout,
            exercises: state.activeWorkout.exercises.filter(e => e.id !== exerciseId),
          }
        })
      },
      
      addSet: (exerciseId: string) => {
        const state = get()
        if (!state.activeWorkout) return
        
        const newSet: WorkoutSet = {
          id: crypto.randomUUID(),
          weight: null,
          reps: 8,
          duration: null,
          completed: false,
          isWarmup: false,
          isDropset: false,
          isFailure: false,
        }
        
        set({
          activeWorkout: {
            ...state.activeWorkout,
            exercises: state.activeWorkout.exercises.map(e => 
              e.id === exerciseId 
                ? { ...e, sets: [...e.sets, newSet] }
                : e
            ),
          }
        })
      },
      
      removeSet: (exerciseId: string, setId: string) => {
        const state = get()
        if (!state.activeWorkout) return
        
        set({
          activeWorkout: {
            ...state.activeWorkout,
            exercises: state.activeWorkout.exercises.map(e => 
              e.id === exerciseId 
                ? { ...e, sets: e.sets.filter(s => s.id !== setId) }
                : e
            ),
          }
        })
      },
      
      updateSet: (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => {
        const state = get()
        if (!state.activeWorkout) return
        
        set({
          activeWorkout: {
            ...state.activeWorkout,
            exercises: state.activeWorkout.exercises.map(e => 
              e.id === exerciseId 
                ? { ...e, sets: e.sets.map(s => s.id === setId ? { ...s, ...updates } : s) }
                : e
            ),
          }
        })
      },
      
      completeSet: (exerciseId: string, setId: string) => {
        const state = get()
        if (!state.activeWorkout) return
        
        set({
          activeWorkout: {
            ...state.activeWorkout,
            exercises: state.activeWorkout.exercises.map(e => 
              e.id === exerciseId 
                ? { 
                    ...e, 
                    sets: e.sets.map(s => 
                      s.id === setId 
                        ? { ...s, completed: true, completedAt: new Date().toISOString() } 
                        : s
                    ) 
                  }
                : e
            ),
          }
        })
        
        // Start rest timer
        const exercise = state.activeWorkout.exercises.find(e => e.id === exerciseId)
        if (exercise) {
          get().startRestTimer(exercise.restTime)
        }
      },
      
      completeWorkout: () => {
        const state = get()
        if (!state.activeWorkout) return
        
        const completedWorkout: Workout = {
          ...state.activeWorkout,
          completedAt: new Date().toISOString(),
          duration: Math.floor(
            (Date.now() - new Date(state.activeWorkout.startedAt).getTime()) / 1000
          ),
        }
        
        set({
          activeWorkout: null,
          workouts: [completedWorkout, ...state.workouts],
        })
      },
      
      cancelWorkout: () => {
        set({ activeWorkout: null })
      },
      
      // Routine Actions
      createRoutine: (routineData) => {
        const routine: Routine = {
          ...routineData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        
        set(state => ({
          routines: [...state.routines, routine]
        }))
      },
      
      deleteRoutine: (id: string) => {
        set(state => ({
          routines: state.routines.filter(r => r.id !== id)
        }))
      },
      
      // Settings Actions
      updateSettings: (updates) => {
        set(state => ({
          settings: { ...state.settings, ...updates }
        }))
      },
      
      // Timer Actions
      startRestTimer: (seconds: number) => {
        set({ isRestTimerActive: true, restTimeRemaining: seconds })
      },
      
      stopRestTimer: () => {
        set({ isRestTimerActive: false, restTimeRemaining: 0 })
      },
      
      tickRestTimer: () => {
        const state = get()
        if (state.restTimeRemaining <= 1) {
          set({ isRestTimerActive: false, restTimeRemaining: 0 })
        } else {
          set({ restTimeRemaining: state.restTimeRemaining - 1 })
        }
      },
    }),
    {
      name: 'hevy-storage',
      partialize: (state) => ({
        workouts: state.workouts,
        routines: state.routines,
        personalRecords: state.personalRecords,
        settings: state.settings,
      }),
    }
  )
)

export default useHevyStore
