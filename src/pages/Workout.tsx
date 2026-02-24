import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHevyStore } from '../store/useHevyStore'
import { exercises } from '../data/exercises'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

function Workout() {
  const navigate = useNavigate()
  const {
    activeWorkout,
    addExercise,
    removeExercise,
    addSet,
    removeSet,
    updateSet,
    completeSet,
    completeWorkout,
    cancelWorkout,
    startWorkout,
    isRestTimerActive,
    restTimeRemaining,
    tickRestTimer,
    stopRestTimer,
    settings,
  } = useHevyStore()
  
  const [showExercisePicker, setShowExercisePicker] = useState(false)
  const [search, setSearch] = useState('')
  const [elapsedTime, setElapsedTime] = useState(0)
  
  // Timer for rest timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRestTimerActive && restTimeRemaining > 0) {
      interval = setInterval(() => {
        tickRestTimer()
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRestTimerActive, restTimeRemaining, tickRestTimer])
  
  // Timer for workout duration
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeWorkout) {
      interval = setInterval(() => {
        const start = new Date(activeWorkout.startedAt).getTime()
        const now = Date.now()
        setElapsedTime(Math.floor((now - start) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeWorkout])
  
  // Filter exercises
  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 20)
  
  const handleAddExercise = (exerciseId: string) => {
    const exercise = exercises.find(e => e.id === exerciseId)
    if (exercise) {
      addExercise(exercise)
      setShowExercisePicker(false)
      setSearch('')
    }
  }
  
  const handleCompleteWorkout = () => {
    completeWorkout()
    navigate('/history')
  }
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  if (!activeWorkout) {
    return (
      <div className="max-w-lg mx-auto space-y-6 text-center py-20">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-primary-500/25">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Start Your Workout</h1>
          <p className="text-text-muted mt-2">
            Begin tracking your exercises, sets, and progress
          </p>
        </div>
        <div className="space-y-3">
          <Button
            size="lg"
            fullWidth
            onClick={() => {
              startWorkout()
              navigate('/workout')
            }}
          >
            Quick Workout
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => navigate('/routines')}
          >
            Use Routine
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{activeWorkout.name}</h1>
          <p className="text-sm text-text-muted">
            {formatTime(elapsedTime)} • {activeWorkout.exercises.length} exercises
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={cancelWorkout}
            className="text-accent-red"
          >
            Cancel
          </Button>
        </div>
      </div>
      
      {/* Rest Timer */}
      {isRestTimerActive && (
        <Card className="bg-gradient-to-r from-accent-orange to-orange-500 border-none text-white">
          <div className="text-center">
            <div className="text-4xl font-bold">{formatTime(restTimeRemaining)}</div>
            <p className="text-orange-100 text-sm mt-1">Rest Time</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={stopRestTimer}
              className="mt-3 bg-white/20 text-white hover:bg-white/30"
            >
              Skip
            </Button>
          </div>
        </Card>
      )}
      
      {/* Exercises */}
      <div className="space-y-4">
        {activeWorkout.exercises.map((workoutExercise, exIndex) => {
          const exercise = exercises.find(e => e.id === workoutExercise.exerciseId)
          if (!exercise) return null
          
          const completedSets = workoutExercise.sets.filter(s => s.completed).length
          
          return (
            <Card key={workoutExercise.id} padding="none">
              {/* Exercise Header */}
              <div className="p-4 border-b border-border-light/50 dark:border-border-dark/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <span className="text-primary-500 font-bold">{exIndex + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{exercise.name}</h3>
                    <p className="text-sm text-text-muted">
                      {completedSets}/{workoutExercise.sets.length} sets
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeExercise(workoutExercise.id)}
                  className="p-2 text-text-muted hover:text-accent-red transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              {/* Sets */}
              <div className="divide-y divide-border-light/50 dark:divide-border-dark/50">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs text-text-muted font-medium">
                  <div className="col-span-1">Set</div>
                  <div className="col-span-4 text-center">Weight</div>
                  <div className="col-span-4 text-center">Reps</div>
                  <div className="col-span-3 text-center">Done</div>
                </div>
                
                {/* Set Rows */}
                {workoutExercise.sets.map((set, setIndex) => (
                  <div
                    key={set.id}
                    className={`grid grid-cols-12 gap-2 px-4 py-3 items-center ${
                      set.completed ? 'bg-accent-green/5' : ''
                    }`}
                  >
                    <div className="col-span-1 text-sm font-medium text-text-muted">
                      {setIndex + 1}
                      {set.isWarmup && <span className="text-2xs text-primary-500 block">warm</span>}
                    </div>
                    <div className="col-span-4">
                      <input
                        type="number"
                        value={set.weight || ''}
                        onChange={(e) => updateSet(workoutExercise.id, set.id, { weight: parseFloat(e.target.value) || null })}
                        placeholder="0"
                        disabled={set.completed}
                        className="w-full text-center bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-2 text-sm"
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        type="number"
                        value={set.reps || ''}
                        onChange={(e) => updateSet(workoutExercise.id, set.id, { reps: parseInt(e.target.value) || null })}
                        placeholder="0"
                        disabled={set.completed}
                        className="w-full text-center bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-2 text-sm"
                      />
                    </div>
                    <div className="col-span-3 flex justify-center">
                      <button
                        onClick={() => {
                          if (!set.completed) {
                            completeSet(workoutExercise.id, set.id)
                          }
                        }}
                        disabled={set.completed}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          set.completed
                            ? 'bg-accent-green text-white'
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-primary-500 hover:text-white'
                        }`}
                      >
                        {set.completed ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-sm">{setIndex + 1}</span>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add Set Button */}
              <div className="p-3 border-t border-border-light/50 dark:border-border-dark/50">
                <button
                  onClick={() => addSet(workoutExercise.id)}
                  className="w-full text-center text-sm text-primary-500 font-medium py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  + Add Set
                </button>
              </div>
            </Card>
          )
        })}
      </div>
      
      {/* Add Exercise Button */}
      <Button
        variant="secondary"
        fullWidth
        size="lg"
        onClick={() => setShowExercisePicker(true)}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }
      >
        Add Exercise
      </Button>
      
      {/* Exercise Picker Modal */}
      {showExercisePicker && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-border-light/50 dark:border-border-dark/50 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Add Exercise</h2>
              <button
                onClick={() => setShowExercisePicker(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <Input
                placeholder="Search exercises..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="overflow-y-auto max-h-96 divide-y divide-border-light/50 dark:divide-border-dark/50">
              {filteredExercises.map(exercise => (
                <button
                  key={exercise.id}
                  onClick={() => handleAddExercise(exercise.id)}
                  className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="font-medium">{exercise.name}</div>
                  <div className="text-sm text-text-muted">
                    {exercise.muscleGroup} • {exercise.equipment}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
      
      {/* Complete Workout Button */}
      <div className="fixed bottom-20 md:bottom-8 left-0 right-0 px-4 md:px-0 md:max-w-7xl md:mx-auto">
        <Button
          size="lg"
          fullWidth
          onClick={handleCompleteWorkout}
          disabled={activeWorkout.exercises.length === 0}
        >
          Complete Workout
        </Button>
      </div>
    </div>
  )
}

export default Workout
