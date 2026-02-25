import { Card } from '../ui/Card'
import { formatDuration } from '../../utils/formatters'
import { Trophy, Calendar, Clock } from 'lucide-react'

interface WorkoutSummaryProps {
  workout: {
    startedAt: string
    duration: number
    exercises: any[]
  }
}

export function WorkoutSummary({ workout }: WorkoutSummaryProps) {
  const completedSets = workout.exercises.reduce((total, ex) => {
    return total + ex.sets.filter((s: any) => s.completed).length
  }, 0)
  
  const totalSets = workout.exercises.reduce((total, ex) => {
    return total + ex.sets.length
  }, 0)
  
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary-500" />
          <span className="text-sm text-text-muted">
            {new Date(workout.startedAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium">
            {formatDuration(workout.duration)}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <div className="text-lg font-bold text-primary-600">
            {workout.exercises.length}
          </div>
          <div className="text-xs text-primary-500">Exercises</div>
        </div>
        <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-lg font-bold text-green-600">
            {completedSets}/{totalSets}
          </div>
          <div className="text-xs text-green-500">Sets</div>
        </div>
        <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-lg font-bold text-purple-600">
            {Math.round(workout.duration / 60)}
          </div>
          <div className="text-xs text-purple-500">Minutes</div>
        </div>
      </div>
    </Card>
  )
}

export default WorkoutSummary
