import { create } from 'zustand'
import type { Workout, WorkoutExercise, WorkoutSet, Exercise, Routine, UserSettings, PersonalRecord } from '../types'

// Local storage key
const STORAGE_KEY = 'hevy_state'

// Initial settings
const defaultSettings: UserSettings = {
  name: 'Guest',
  units: 'metric',
  theme: 'system',
  defaultRestTime: 90,
  showWarmupSets: true,
  soundEnabled: true,
  hapticEnabled: false,
}

// Simple store type
interface HevyState {
  activeWorkout: Workout | null
  workouts: Workout[]
  routines: Routine[]
  personalRecords: PersonalRecord[]
  settings: UserSettings
  isRestTimerActive: boolean
  restTimeRemaining: number
}

export const useHevyStore = create<HevyState>()({
  activeWorkout: null,
  workouts: [],
  routines: [],
  personalRecords: [],
  settings: defaultSettings,
  isRestTimerActive: false,
  restTimeRemaining: 0,
})

// Actions
export const startWorkout = (name = 'Quick Workout', templateId = '') => {
  useHevyStore.setState(state => {
    const routine = templateId ? state.routines.find(r => r.id === templateId) : null
    
    const exercises = routine ? routine.exercises.map((re, idx) => ({
      id: crypto.randomUUID(),
      exerciseId: re.exerciseId,
      notes: '',
      supersetId: null,
      sets: re.sets.length > 0 ? re.sets.map(s => ({
        id: s.id,
        weight: s.weight,
        reps: s.reps,
        duration: s.duration,
        completed: s.completed,
        isWarmup: s.isWarmup,
        isDropset: s.isDropset,
        isFailure: s.isFailure,
      })) : [{
        id: crypto.randomUUID(),
        weight: null,
        reps: 8,
        duration: null,
        completed: false,
        isWarmup: false,
        isDropset: false,
        isFailure: false,
      }],
      order: idx,
    }))
    
    const newWorkout: Workout = {
      id: crypto.randomUUID(),
      name,
      startedAt: new Date().toISOString(),
      completedAt: null,
      duration: 0,
      notes: '',
      exercises,
      bodyweight: null,
      templateId: templateId || null,
    }
    
    useHevyStore.setState({ activeWorkout: newWorkout })
  })
}

export const addExercise = (exercise: Exercise) => {
  const state = useHevyStore.getState()
  
  if (!state.activeWorkout) {
    return
  }
  
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
    order: state.activeWorkout?.exercises.length || 0,
  }
  
  useHevyStore.setState(state => ({
    activeWorkout: {
      ...state.activeWorkout,
      exercises: [...(state.activeWorkout?.exercises || []), newExercise],
    }
  }))
}

export const removeExercise = (exerciseId: string) => {
  const state = useHevyStore.getState()
  
  if (!state.activeWorkout) {
    return
  }
  
  useHevyStore.setState(state => ({
    activeWorkout: {
      ...state.activeWorkout,
      exercises: state.activeWorkout.exercises.filter(e => e.id !== exerciseId),
    }
  }))
}

export const addSet = (exerciseId: string) => {
  const state = useHevyStore.getState()
  
  if (!state.activeWorkout) {
    return
  }
  
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
  
  useHevyStore.setState(state => ({
    activeWorkout: {
      ...state.activeWorkout,
      exercises: state.activeWorkout.exercises.map(e => {
        if (e.exerciseId === exerciseId) {
          return {
            ...e,
            sets: [...e.sets, newSet]
          }
        }
        return e
      }),
    }
  }))
}

export const removeSet = (exerciseId: string, setId: string) => {
  const state = useHevyStore.getState()
  
  if (!state.activeWorkout) {
    return
  }
  
  useHevyStore.setState(state => ({
    activeWorkout: {
      ...state.activeWorkout,
      exercises: state.activeWorkout.exercises.map(e => {
        if (e.exerciseId === exerciseId) {
          return {
            ...e,
            sets: e.sets.filter(s => s.id !== setId)
          }
        }
        return e
      }),
    }
  }))
}

export const completeSet = (exerciseId: string, setId: string) => {
  const state = useHevyStore.getState()
  
  if (!state.activeWorkout) {
    return
  }
  
  const exercise = state.activeWorkout.exercises.find(e => e.exerciseId === exerciseId)
  if (!exercise) {
    return
  }
  
  useHevyStore.setState(state => {
    activeWorkout: {
      ...state.activeWorkout,
      exercises: state.activeWorkout.exercises.map(e => {
        if (e.exerciseId !== exerciseId) return e
        return {
          ...e,
          sets: e.sets.map(s => {
            if (s.id === setId) {
              return {
                ...s,
                completed: true,
                completedAt: new Date().toISOString()
              }
            }
            return s
          })
        }
      })
    })
  
  const exercise = state.activeWorkout.exercises.find(e => e.exerciseId === exerciseId)
  if (exercise && exercise.restTime) {
    useHevyStore.setState({ isRestTimerActive: true, restTimeRemaining: exercise.restTime })
  }
}

export const completeWorkout = () => {
  const state = useHevyStore.getState()
  
  if (!state.activeWorkout) {
    return
  }
  
  const completedWorkout: Workout = {
    ...state.activeWorkout,
    completedAt: new Date().toISOString(),
    duration: Math.floor((Date.now() - new Date(state.activeWorkout.startedAt).getTime()) / 1000),
  }
  
  const workouts = [completedWorkout, ...state.workouts]
  
  useHevyStore.setState({
    activeWorkout: null,
    workouts,
  })
}

export const cancelWorkout = () => {
  useHevyStore.setState({ activeWorkout: null })
}

// Routine actions
export const createRoutine = (routineData) => {
  const routine = {
    ...routineData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  useHevyStore.setState(state => ({
    routines: [...state.routines, routine]
  }))
}

export const deleteRoutine = (id: string) => {
  useHevyStore.setState(state => ({
    routines: state.routines.filter(r => r.id !== id)
  }))
}

// Settings actions
export const updateSettings = (updates) => {
  useHevyStore.setState(state => ({
    settings: { ...state.settings, ...updates }
  }))
}

// Timer actions
export const startRestTimer = (seconds: number) => {
  useHevyStore.setState({
    isRestTimerActive: true,
    restTimeRemaining: seconds
  })
}

export const stopRestTimer = () => {
  useHevyStore.setState({
    isRestTimerActive: false,
    restTimeRemaining: 0
  })
}

export const tickRestTimer = () => {
  const state = useHevyStore.getState()
  
  if (state.restTimeRemaining <= 1) {
    useHevyStore.setState({
      isRestTimerActive: false,
      restTimeRemaining: 0
    })
  } else {
    useHevyStore.setState({
      restTimeRemaining: state.restTimeRemaining - 1
    })
  }
}

// Selectors
export const selectActiveWorkout = (state: HevyState) => state.activeWorkout
export const selectWorkouts = (state: HevyState) => state.workouts
export const selectRoutines = (state: HevyState) => state.routines
export const selectPersonalRecords = (state: HevyState) => state.personalRecords
export const selectSettings = (state: HevyState) => state.settings
export const selectIsRestTimerActive = (state: HevyState) => state.isRestTimerActive
export const selectRestTimeRemaining = (state: HevyState) => state.restTimeRemaining
