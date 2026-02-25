import { motion } from 'framer-motion'
import { Workout } from '../../types'
import { Card } from '../ui/Card'
import { formatRelativeTime, formatDuration, calculateTotalVolume } from '../../utils/formatters'

interface WorkoutCardProps {
  workout: Workout
  onClick?: () => void
}

export function WorkoutCard({ workout, onClick }: WorkoutCardProps) {
  const completedSets = workout.exercises.reduce((total, ex) => {
    return total + ex.sets.filter(s => s.completed).length
  }, 0)
  
  const totalSets = workout.exercises.reduce((total, ex) => {
    return total + ex.sets.length
  }, 0)
  
  const volume = calculateTotalVolume(workout.exercises)
  
  return (
    <Card
      hover
      onClick={onClick}
      className="group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{workout.name}</h3>
          <p className="text-sm text-text-muted">
            {formatRelativeTime(workout.startedAt)}
          </p>
        </div>
        
        {workout.completedAt ? (
          <div className="bg-accent-green/10 text-accent-green px-2 py-1 rounded-lg text-xs font-medium">
            Completed
          </div>
        ) : (
          <div className="bg-accent-orange/10 text-accent-orange px-2 py-1 rounded-lg text-xs font-medium">
            In Progress
          </div>
        )}
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-primary-500">
            {workout.exercises.length}
          </div>
          <div className="text-xs text-text-muted">Exercises</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-accent-purple">
            {completedSets}/{totalSets}
          </div>
          <div className="text-xs text-text-muted">Sets</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-accent-green">
            {formatDuration(workout.duration)}
          </div>
          <div className="text-xs text-text-muted">Duration</div>
        </div>
      </div>
      
      {workout.exercises.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="text-xs text-text-muted mb-2">Exercises:</div>
          <div className="flex flex-wrap gap-2">
            {workout.exercises.slice(0, 4).map((ex, i) => (
              <div
                key={i}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs"
              >
                {ex.exerciseId}
              </div>
            ))}
            {workout.exercises.length > 4 && (
              <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-text-muted">
                +{workout.exercises.length - 4} more
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

export default WorkoutCard
