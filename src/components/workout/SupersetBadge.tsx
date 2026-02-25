import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SupersetBadgeProps {
  exercises: string[]
  number: number
}

export function SupersetBadge({ exercises, number }: SupersetBadgeProps) {
  const [expanded, setExpanded] = useState(false)
  
  const colors = [
    'bg-purple-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-pink-500',
  ]
  
  const color = colors[number % colors.length]
  
  return (
    <div className="relative">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`${color} text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2`}
      >
        <span>Superset {number + 1}</span>
        <svg
          className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 min-w-48 z-10"
          >
            <div className="text-xs text-text-muted mb-2">Superset exercises:</div>
            <div className="space-y-1">
              {exercises.map((ex, i) => (
                <div key={i} className="text-sm font-medium">
                  {i + 1}. {ex}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SupersetBadge
