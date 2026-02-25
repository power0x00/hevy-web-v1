import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useHevyStore } from '../../store/useHevyStore'
import { exercises, muscleGroupNames } from '../../data/exercises'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Search, Plus, Filter } from 'lucide-react'

export function ExerciseQuickAdd() {
  const navigate = useNavigate()
  const { activeWorkout, addExercise } = useHevyStore()
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null)
  
  const muscleGroups = [...new Set(exercises.map(e => e.muscleGroup))]
  
  const filtered = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase())
    const matchesMuscle = !selectedMuscle || ex.muscleGroup === selectedMuscle
    return matchesSearch && matchesMuscle
  }).slice(0, 20)
  
  const handleAdd = (exercise: typeof exercises[0]) => {
    addExercise(exercise)
    if (!activeWorkout) {
      // Start workout if none active
      navigate('/workout')
    }
  }
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Quick Add Exercise</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <Filter className="w-5 h-5 text-text-muted" />
        </button>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <Input
          placeholder="Search exercises..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2">
              {muscleGroups.map(group => (
                <button
                  key={group}
                  onClick={() => setSelectedMuscle(selectedMuscle === group ? null : group)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedMuscle === group
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {muscleGroupNames[group]}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filtered.map((exercise, i) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02 }}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div>
              <div className="font-medium">{exercise.name}</div>
              <div className="text-sm text-text-muted">
                {muscleGroupNames[exercise.muscleGroup]} • {exercise.equipment}
              </div>
            </div>
            <button
              onClick={() => handleAdd(exercise)}
              className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
        
        {filtered.length === 0 && (
          <div className="text-center py-8 text-text-muted">
            No exercises found
          </div>
        )}
      </div>
    </Card>
  )
}

export default ExerciseQuickAdd
