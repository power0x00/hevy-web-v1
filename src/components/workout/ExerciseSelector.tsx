import { useState } from 'react'
import { motion } from 'framer-motion'
import { Exercise } from '../../types'
import { exercises, muscleGroupNames } from '../../data/exercises'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void
  onClose: () => void
}

export function ExerciseSelector({ onSelect, onClose }: ExerciseSelectorProps) {
  const [search, setSearch] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  
  const muscleGroups = [...new Set(exercises.map(e => e.muscleGroup))]
  
  const filtered = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase())
    const matchesGroup = !selectedGroup || ex.muscleGroup === selectedGroup
    return matchesSearch && matchesGroup
  })
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-t-3xl md:rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Exercise</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Search */}
        <div className="p-4">
          <Input
            placeholder="Search exercises..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        
        {/* Muscle Group Filters */}
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSelectedGroup(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              !selectedGroup
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {muscleGroups.map(group => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                selectedGroup === group
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {muscleGroupNames[group]}
            </button>
          ))}
        </div>
        
        {/* Exercise List */}
        <div className="overflow-y-auto max-h-96 divide-y divide-gray-200 dark:divide-gray-800">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-text-muted">
              No exercises found
            </div>
          ) : (
            filtered.map(exercise => (
              <button
                key={exercise.id}
                onClick={() => onSelect(exercise)}
                className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="font-medium">{exercise.name}</div>
                <div className="text-sm text-text-muted flex gap-2 mt-1">
                  <span>{muscleGroupNames[exercise.muscleGroup]}</span>
                  <span>•</span>
                  <span>{exercise.equipment}</span>
                  {exercise.isCompound && (
                    <>
                      <span>•</span>
                      <span className="text-primary-500">Compound</span>
                    </>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ExerciseSelector
