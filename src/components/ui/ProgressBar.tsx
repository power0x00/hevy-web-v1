import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number
  max: number
  label?: string
  color?: string
}

export function ProgressBar({ value, max, label, color = 'bg-primary-500' }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-text-muted">{label}</span>
          <span className="font-medium">{value}/{max}</span>
        </div>
      )}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  )
}

export default ProgressBar
