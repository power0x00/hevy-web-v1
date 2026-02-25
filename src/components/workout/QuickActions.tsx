import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useHevyStore } from '../store/useHevyStore'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { PlusCircle, Calendar, Target, TrendingUp } from 'lucide-react'

export function QuickActions() {
  const navigate = useNavigate()
  const { activeWorkout, startWorkout, routines } = useHevyStore()
  
  const actions = [
    {
      icon: <PlusCircle className="w-6 h-6" />,
      label: 'Start Workout',
      description: 'Begin a new session',
      onClick: () => {
        startWorkout()
        navigate('/workout')
      },
      color: 'bg-primary-500',
      disabled: !!activeWorkout,
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Use Routine',
      description: `${routines.length} saved`,
      onClick: () => navigate('/routines'),
      color: 'bg-purple-500',
    },
    {
      icon: <Target className="w-6 h-6" />,
      label: 'Browse Exercises',
      description: '300+ exercises',
      onClick: () => navigate('/exercises'),
      color: 'bg-green-500',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'View Progress',
      description: 'Analytics & PRs',
      onClick: () => navigate('/analytics'),
      color: 'bg-orange-500',
    },
  ]
  
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card
            hover
            onClick={action.disabled ? undefined : action.onClick}
            className={`p-4 ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-3`}>
                {action.icon}
              </div>
              <div className="font-medium text-sm mb-1">{action.label}</div>
              <div className="text-xs text-text-muted">{action.description}</div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default QuickActions
