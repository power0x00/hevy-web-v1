import { useHevyStore } from '../store/useHevyStore'
import { Card } from '../ui/Card'
import { Trophy } from 'lucide-react'

export function PersonalRecordCard() {
  const { personalRecords, workouts } = useHevyStore()
  
  // Group PRs by exercise
  const prByExercise = personalRecords.reduce((acc, pr) => {
    if (!acc[pr.exerciseId]) {
      acc[pr.exerciseId] = []
    }
    acc[pr.exerciseId].push(pr)
    return acc
  }, {} as Record<string, typeof personalRecords>)
  
  if (personalRecords.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Trophy className="w-12 h-12 text-primary-500 mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No PRs Yet</h3>
          <p className="text-sm text-text-muted">
            Complete workouts to track your personal records
          </p>
        </div>
      </Card>
    )
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Personal Records
      </h2>
      
      <div className="space-y-2">
        {Object.entries(prByExercise).map(([exerciseId, prs]) => {
          const maxPR = prs.reduce((max, pr) => 
            pr.value > max.value ? pr : max
          , prs[0])
          
          return (
            <Card key={exerciseId} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{exerciseId}</div>
                  <div className="text-sm text-text-muted">
                    {new Date(maxPR.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-500">
                    {Math.round(maxPR.value)}
                  </div>
                  <div className="text-xs text-text-muted">kg volume</div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default PersonalRecordCard
