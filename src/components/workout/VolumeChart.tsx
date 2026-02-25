import { useHevyStore } from '../store/useHevyStore'
import { Card } from '../ui/Card'
import { TrendingUp } from 'lucide-react'

export function VolumeChart() {
  const { workouts, settings } = useHevyStore()
  
  // Get last 7 workouts
  const recentWorkouts = workouts.slice(0, 7).reverse()
  
  if (recentWorkouts.length === 0) {
    return null
  }
  
  const volumes = recentWorkouts.map(w => ({
    date: new Date(w.startedAt).toLocaleDateString('en-US', { weekday: 'short' }),
    volume: w.exercises.reduce((sum, ex) => {
      return sum + ex.sets.reduce((setSum, set) => {
        if (set.weight && set.reps) {
          return setSum + (set.weight * set.reps)
        }
        return setSum
      }, 0)
    }, 0)
  }))
  
  const maxVolume = Math.max(...volumes.map(v => v.volume), 1)
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Volume Trend</h3>
        <TrendingUp className="w-5 h-5 text-primary-500" />
      </div>
      
      <div className="space-y-2">
        {volumes.map((v, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">{v.date}</span>
              <span className="font-medium">
                {settings.units === 'metric' 
                  ? Math.round(v.volume).toLocaleString()
                  : Math.round(v.volume * 2.20462).toLocaleString()
                } {settings.units === 'metric' ? 'kg' : 'lbs'}
              </span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(v.volume / maxVolume) * 100}%` }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default VolumeChart
