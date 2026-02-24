import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHevyStore } from '../store/useHevyStore'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

function Routines() {
  const navigate = useNavigate()
  const { routines, createRoutine, deleteRoutine, startWorkout } = useHevyStore()
  
  const handleStartRoutine = (routineId: string) => {
    startWorkout(undefined, routineId)
    navigate('/workout')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Routines</h1>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/exercises')}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          New Routine
        </Button>
      </div>
      
      {routines.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No routines yet</h3>
            <p className="text-text-muted text-sm mb-6">
              Create reusable workout templates to save time
            </p>
            <Button onClick={() => navigate('/exercises')}>
              Create Your First Routine
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routines.map(routine => (
            <Card 
              key={routine.id} 
              hover
              className="group"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{routine.name}</h3>
                  <p className="text-sm text-text-muted mb-4">
                    {routine.exercises.length} exercises
                  </p>
                  <div className="text-xs text-text-muted">
                    {routine.exercises.slice(0, 3).map((ex, i) => (
                      <div key={i} className="truncate">• {ex.exerciseId}</div>
                    ))}
                    {routine.exercises.length > 3 && (
                      <div className="text-primary-500">+{routine.exercises.length - 3} more</div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-border-light/50 dark:border-border-dark/50">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => handleStartRoutine(routine.id)}
                  >
                    Start
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRoutine(routine.id)}
                    className="text-accent-red"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Routines
