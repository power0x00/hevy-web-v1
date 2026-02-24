import { useNavigate } from 'react-router-dom'
import { useHevyStore } from '../store/useHevyStore'
import { Card } from '../components/ui/Card'

function History() {
  const navigate = useNavigate()
  const { workouts } = useHevyStore()
  
  // Sort workouts by date (newest first)
  const sortedWorkouts = [...workouts].sort((a, b) => 
    new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  )
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Workout History</h1>
      
      {sortedWorkouts.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-text-muted">
            <p>No workouts logged yet</p>
            <p className="text-sm mt-1">Start your first workout to begin tracking your progress</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedWorkouts.map(workout => (
            <Card 
              key={workout.id} 
              hover
              onClick={() => navigate(`/history/${workout.id}`)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{workout.name}</h3>
                  <p className="text-sm text-text-muted mt-1">
                    {workout.exercises.length} exercises • {new Date(workout.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {new Date(workout.startedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-xs text-text-muted">
                    {formatDuration(workout.duration)} • {workout.completedAt ? 'Completed' : 'In Progress'}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function formatDuration(seconds: number): string {
  if (!seconds) return '0m'
  const mins = Math.floor(seconds / 60)
  const hrs = Math.floor(mins / 60)
  const remainingMins = mins % 60
  
  if (hrs > 0) {
    return `${hrs}h ${remainingMins}m`
  }
  return `${mins}m`
}

export default History
