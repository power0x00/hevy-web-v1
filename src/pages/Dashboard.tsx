import { useNavigate } from 'react-router-dom'
import { useHevyStore } from '../store/useHevyStore'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

function Dashboard() {
  const navigate = useNavigate()
  const { workouts, routines, activeWorkout, startWorkout, settings } = useHevyStore()
  
  // Calculate stats
  const thisWeekWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.startedAt)
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return workoutDate >= weekAgo
  })
  
  const totalVolumeThisWeek = thisWeekWorkouts.reduce((total, workout) => {
    return total + workout.exercises.reduce((exTotal, ex) => {
      return exTotal + ex.sets.reduce((setTotal, set) => {
        if (set.weight && set.reps) {
          return setTotal + (set.weight * set.reps)
        }
        return setTotal
      }, 0)
    }, 0)
  }, 0)

  const handleStartWorkout = () => {
    startWorkout()
    navigate('/workout')
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold">
          {getGreeting()}, {settings.name}
        </h1>
        <p className="text-text-muted mt-1">
          {activeWorkout 
            ? "You have a workout in progress"
            : "Ready to crush it today?"
          }
        </p>
      </div>

      {/* Quick Actions */}
      {!activeWorkout && (
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 border-none text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Start Workout</h2>
              <p className="text-primary-100 text-sm mt-1">
                Begin your training session
              </p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleStartWorkout}
              className="bg-white text-primary-600 hover:bg-primary-50"
            >
              Start
            </Button>
          </div>
        </Card>
      )}

      {activeWorkout && (
        <Card className="bg-gradient-to-br from-accent-green to-green-600 border-none text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{activeWorkout.name}</h2>
              <p className="text-green-100 text-sm mt-1">
                {activeWorkout.exercises.length} exercises • In progress
              </p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/workout')}
              className="bg-white text-green-600 hover:bg-green-50"
            >
              Continue
            </Button>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-500">
              {thisWeekWorkouts.length}
            </div>
            <div className="text-sm text-text-muted mt-1">Workouts</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-green">
              {formatVolume(totalVolumeThisWeek, settings.units)}
            </div>
            <div className="text-sm text-text-muted mt-1">Volume ({settings.units === 'metric' ? 'kg' : 'lbs'})</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-purple">
              {routines.length}
            </div>
            <div className="text-sm text-text-muted mt-1">Routines</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-orange">
              {calculateStreak(workouts)}
            </div>
            <div className="text-sm text-text-muted mt-1">Day Streak</div>
          </div>
        </Card>
      </div>

      {/* Recent Workouts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
        {workouts.length === 0 ? (
          <Card>
            <div className="text-center py-8 text-text-muted">
              <p>No workouts yet</p>
              <p className="text-sm mt-1">Start your first workout to begin tracking</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {workouts.slice(0, 5).map(workout => (
              <Card key={workout.id} hover onClick={() => navigate(`/history/${workout.id}`)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{workout.name}</h3>
                    <p className="text-sm text-text-muted">
                      {formatDate(workout.startedAt)} • {workout.exercises.length} exercises
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatDuration(workout.duration)}
                    </div>
                    <div className="text-xs text-text-muted">
                      {formatVolume(calculateWorkoutVolume(workout), settings.units)} {settings.units === 'metric' ? 'kg' : 'lbs'}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Routines */}
      {routines.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Start Routines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {routines.slice(0, 4).map(routine => (
              <Card 
                key={routine.id} 
                hover
                onClick={() => {
                  startWorkout(routine.name, routine.id)
                  navigate('/workout')
                }}
              >
                <h3 className="font-medium">{routine.name}</h3>
                <p className="text-sm text-text-muted mt-1">
                  {routine.exercises.length} exercises
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Helper functions
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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

function formatVolume(volume: number, units: string): string {
  if (units === 'imperial') {
    // Convert kg to lbs
    return Math.round(volume * 2.20462).toLocaleString()
  }
  return Math.round(volume).toLocaleString()
}

function calculateWorkoutVolume(workout: { exercises: { sets: { weight: number | null; reps: number | null }[] }[] }): number {
  return workout.exercises.reduce((total, ex) => {
    return total + ex.sets.reduce((setTotal, set) => {
      if (set.weight && set.reps) {
        return setTotal + (set.weight * set.reps)
      }
      return setTotal
    }, 0)
  }, 0)
}

function calculateStreak(workouts: { startedAt: string }[]): number {
  if (workouts.length === 0) return 0
  
  const dates = workouts
    .map(w => new Date(w.startedAt).toDateString())
    .filter((date, i, arr) => arr.indexOf(date) === i)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  
  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  
  for (const dateStr of dates) {
    const workoutDate = new Date(dateStr)
    workoutDate.setHours(0, 0, 0, 0)
    
    const diffDays = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === streak || (diffDays === 0 && streak === 0)) {
      streak++
      currentDate = workoutDate
    } else {
      break
    }
  }
  
  return streak
}

export default Dashboard
