import { useHevyStore } from '../store/useHevyStore'
import { Card } from '../ui/Card'

export function ProgressChart() {
  const { workouts } = useHevyStore()
  
  // Get last 30 days of workout volume
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toDateString()
  })
  
  const volumeByDay = last30Days.map(day => {
    const dayWorkouts = workouts.filter(w => 
      new Date(w.startedAt).toDateString() === day
    )
    
    const volume = dayWorkouts.reduce((sum, w) => {
      return sum + w.exercises.reduce((exSum, ex) => {
        return exSum + ex.sets.reduce((setSum, set) => {
          if (set.weight && set.reps) {
            return setSum + (set.weight * set.reps)
          }
          return setSum
        }, 0)
      }, 0)
    }, 0)
    
    return { day, volume }
  })
  
  const maxVolume = Math.max(...volumeByDay.map(d => d.volume), 1)
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Volume (Last 30 Days)</h3>
      
      <div className="flex items-end justify-between h-32 gap-1">
        {volumeByDay.map((d, i) => (
          <div
            key={i}
            className="flex-1 bg-primary-500 rounded-t transition-all hover:bg-primary-600"
            style={{
              height: `${(d.volume / maxVolume) * 100}%`,
              minHeight: d.volume > 0 ? '4px' : '0',
            }}
            title={`${d.day}: ${Math.round(d.volume)} kg`}
          />
        ))}
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-text-muted">
        <span>30 days ago</span>
        <span>Today</span>
      </div>
    </Card>
  )
}

export default ProgressChart
