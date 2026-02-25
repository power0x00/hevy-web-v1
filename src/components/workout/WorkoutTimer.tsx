import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHevyStore } from '../store/useHevyStore'
import { Button } from './ui/Button'

export function WorkoutTimer() {
  const { isRestTimerActive, restTimeRemaining, stopRestTimer } = useHevyStore()
  const [displayTime, setDisplayTime] = useState(restTimeRemaining)
  
  useEffect(() => {
    setDisplayTime(restTimeRemaining)
  }, [restTimeRemaining])
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  if (!isRestTimerActive) return null
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl text-center max-w-sm mx-4"
        >
          <div className="text-sm font-medium text-text-muted mb-2">Rest Time</div>
          
          <div className="relative w-48 h-48 mx-auto mb-6">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-800"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className="text-primary-500 transition-all duration-1000"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - displayTime / 180)}`}
              />
            </svg>
            
            {/* Time display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl font-bold text-primary-500">
                {formatTime(displayTime)}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={() => {
                // Add 30 seconds
                setDisplayTime(prev => prev + 30)
              }}
            >
              +30s
            </Button>
            <Button
              variant="primary"
              onClick={stopRestTimer}
            >
              Skip
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default WorkoutTimer
