import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHevyStore } from '../store/useHevyStore'
import { exercises, muscleGroupNames } from '../data/exercises'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { MuscleGroup, Equipment } from '../types'

const muscleGroups: MuscleGroup[] = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'abs',
  'quads', 'hamstrings', 'glutes', 'calves', 'cardio', 'full_body'
]

const equipmentTypes: Equipment[] = [
  'barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'kettlebell', 'bands'
]

function Exercises() {
  const navigate = useNavigate()
  const { activeWorkout, addExercise } = useHevyStore()
  const [search, setSearch] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  
  // Filter exercises
  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase())
    const matchesMuscle = !selectedMuscle || ex.muscleGroup === selectedMuscle
    const matchesEquipment = !selectedEquipment || ex.equipment === selectedEquipment
    return matchesSearch && matchesMuscle && matchesEquipment
  })
  
  // Group by muscle group
  const groupedExercises = filteredExercises.reduce((acc, ex) => {
    const group = ex.muscleGroup
    if (!acc[group]) acc[group] = []
    acc[group].push(ex)
    return acc
  }, {} as Record<string, typeof exercises>)
  
  const handleAddExercise = (exerciseId: string) => {
    const exercise = exercises.find(e => e.id === exerciseId)
    if (!exercise) return
    
    if (activeWorkout) {
      addExercise(exercise)
      navigate('/workout')
    } else {
      // Could show a modal or navigate to exercise detail
      console.log('No active workout')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Exercise Library</h1>
        <p className="text-text-muted mt-1">
          {exercises.length} exercises available
        </p>
      </div>
      
      {/* Search */}
      <Input
        placeholder="Search exercises..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
      />
      
      {/* Muscle Group Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedMuscle(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
            !selectedMuscle
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-text-muted hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All
        </button>
        {muscleGroups.map(group => (
          <button
            key={group}
            onClick={() => setSelectedMuscle(group)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              selectedMuscle === group
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-text-muted hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {muscleGroupNames[group]}
          </button>
        ))}
      </div>
      
      {/* Equipment Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {equipmentTypes.map(eq => (
          <button
            key={eq}
            onClick={() => setSelectedEquipment(selectedEquipment === eq ? null : eq)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedEquipment === eq
                ? 'bg-accent-purple text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-text-muted'
            }`}
          >
            {eq.charAt(0).toUpperCase() + eq.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Exercise List */}
      {selectedMuscle ? (
        <div className="space-y-2">
          {groupedExercises[selectedMuscle]?.map(exercise => (
            <Card 
              key={exercise.id}
              hover
              onClick={() => handleAddExercise(exercise.id)}
              className="flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium">{exercise.name}</h3>
                <p className="text-sm text-text-muted">
                  {exercise.equipment} • {exercise.isCompound ? 'Compound' : 'Isolation'}
                </p>
              </div>
              {activeWorkout && (
                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedExercises).map(([group, exs]) => (
            <div key={group}>
              <h2 className="text-lg font-semibold mb-3">{muscleGroupNames[group]}</h2>
              <div className="space-y-2">
                {exs.slice(0, 5).map(exercise => (
                  <Card 
                    key={exercise.id}
                    hover
                    onClick={() => handleAddExercise(exercise.id)}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-medium">{exercise.name}</h3>
                      <p className="text-sm text-text-muted">
                        {exercise.equipment} • {exercise.isCompound ? 'Compound' : 'Isolation'}
                      </p>
                    </div>
                    {activeWorkout && (
                      <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </Card>
                ))}
                {exs.length > 5 && (
                  <button
                    onClick={() => setSelectedMuscle(group as MuscleGroup)}
                    className="w-full text-center text-sm text-primary-500 py-2"
                  >
                    View all {exs.length} exercises
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {filteredExercises.length === 0 && (
        <Card>
          <div className="text-center py-8 text-text-muted">
            <p>No exercises found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Exercises
