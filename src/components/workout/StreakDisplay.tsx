import { motion } from 'framer-motion'
import { Flame, Trophy, Calendar, TrendingUp } from 'lucide-react'
import { Card } from '../ui/Card'
import { calculateStreak } from '../../utils/formatters'
import { useHevyStore } from '../../store/useHevyStore'

export function StreakDisplay() {
  const { workouts } = useHevyStore()
  
  const streak = calculateStreak(workouts)
  const totalWorkouts = workouts.length
  const thisWeek = workouts.filter(w => {
    const date = new Date(w.startedAt)
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return date >= weekAgo
  }).length
  
  const stats = [
    {
      icon: <Flame className="w-5 h-5" />,
      label: 'Current Streak',
      value: `${streak} day${streak !== 1 ? 's' : ''}`,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      label: 'Total Workouts',
      value: totalWorkouts,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'This Week',
      value: thisWeek,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
  ]
  
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary-500" />
        Progress Stats
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-xl p-4 ${stat.bg}`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`${stat.color} mb-2`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-text-muted">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {streak >= 7 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white text-center"
        >
          <div className="text-3xl mb-2">🔥</div>
          <div className="font-semibold">Week streak! Keep it up!</div>
        </motion.div>
      )}
    </Card>
  )
}

export default StreakDisplay
