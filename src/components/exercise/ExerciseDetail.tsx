import { motion } from 'framer-motion'
import { Exercise } from '../../types'
import { muscleGroupNames } from '../../data/exercises'
import { Button } from '../ui/Button'

interface ExerciseDetailProps {
  exercise: Exercise
  onAdd?: () => void
  onClose: () => void
}

export function ExerciseDetail({ exercise, onAdd, onClose }: ExerciseDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Image Placeholder */}
        <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
          <div className="text-white text-6xl">
            {getExerciseEmoji(exercise.muscleGroup)}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{exercise.name}</h2>
          
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 bg-primary-500/10 text-primary-500 rounded-lg text-sm font-medium">
              {muscleGroupNames[exercise.muscleGroup]}
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium capitalize">
              {exercise.equipment}
            </span>
            {exercise.isCompound && (
              <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-lg text-sm font-medium">
                Compound
              </span>
            )}
          </div>
          
          {exercise.description && (
            <p className="text-text-muted mb-4">{exercise.description}</p>
          )}
          
          {exercise.instructions && exercise.instructions.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Instructions</h3>
              <ol className="space-y-2">
                {exercise.instructions.map((instruction, i) => (
                  <li key={i} className="flex gap-2 text-sm text-text-muted">
                    <span className="flex-shrink-0 w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {i + 1}
                    </span>
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          )}
          
          <div className="flex gap-3 mt-6">
            {onAdd && (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={onAdd}
              >
                Add to Workout
              </Button>
            )}
            <Button
              variant="secondary"
              size="lg"
              fullWidth={!onAdd}
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function getExerciseEmoji(muscleGroup: string): string {
  const emojis: Record<string, string> = {
    chest: '💪',
    back: '🔥',
    shoulders: ' deltoid',
    biceps: '💪',
    triceps: '💪',
    abs: '🎯',
    quads: '🦵',
    hamstrings: '🦵',
    glutes: '🍑',
    calves: '🦵',
    cardio: '❤️',
    full_body: '🏋️',
  }
  
  return emojis[muscleGroup] || '💪'
}

export default ExerciseDetail
