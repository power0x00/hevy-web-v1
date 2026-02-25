import { useHevyStore } from '../store/useHevyStore'
import { Card } from '../components/ui/Card'

function Analytics() {
  const { workouts, settings } = useHevyStore()
  
  // Calculate stats
  const totalWorkouts = workouts.length
  const totalVolume = workouts.reduce((sum, w) => {
    return sum + w.exercises.reduce((exSum, ex) => {
      return exSum + ex.sets.reduce((setSum, set) => {
        if (set.weight && set.reps) {
          return setSum + (set.weight * set.reps)
        }
        return setSum
      }, 0)
    }, 0)
  }, 0)
  
  const avgDuration = workouts.length > 0 
    ? Math.round(workouts.reduce((sum, w) => sum + (w.duration || 0), 0) / workouts.length / 60)
    : 0
  
  const thisMonth = workouts.filter(w => {
    const date = new Date(w.startedAt)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-500">{totalWorkouts}</div>
            <div className="text-sm text-text-muted mt-1">Total Workouts</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-green">
              {settings.units === 'metric' 
                ? Math.round(totalVolume).toLocaleString()
                : Math.round(totalVolume * 2.20462).toLocaleString()
              }
            </div>
            <div className="text-sm text-text-muted mt-1">
              Total Volume ({settings.units === 'metric' ? 'kg' : 'lbs'})
            </div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-purple">{avgDuration}</div>
            <div className="text-sm text-text-muted mt-1">Avg Duration (min)</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-orange">{thisMonth}</div>
            <div className="text-sm text-text-muted mt-1">This Month</div>
          </div>
        </Card>
      </div>
      
      {/* Weekly Frequency */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Workout Frequency</h2>
        {workouts.length === 0 ? (
          <p className="text-text-muted">No workouts logged yet</p>
        ) : (
          <div className="space-y-2">
            {getLast7Days().map((day, i) => {
              const count = workouts.filter(w => {
                const date = new Date(w.startedAt).toDateString()
                return date === day.toDateString()
              }).length
              
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-20 text-sm text-text-muted">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-lg transition-all"
                      style={{ width: `${Math.min(count * 20, 100)}%` }}
                    />
                  </div>
                  <div className="w-8 text-sm font-medium">{count}</div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
      
      {/* Muscle Group Distribution */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Muscle Groups</h2>
        <p className="text-text-muted text-sm">Coming soon - track which muscle groups you train most</p>
      </Card>
      
      {/* Personal Records */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Personal Records</h2>
        <p className="text-text-muted text-sm">Coming soon - track your best lifts</p>
      </Card>
    </div>
  )
}

function getLast7Days(): Date[] {
  const days: Date[] = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push(date)
  }
  return days
}

export default Analytics
