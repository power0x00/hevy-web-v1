// Utility functions for Hevy Web

/**
 * Format duration in seconds to human-readable string
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds < 0) return '0m'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m`
  }
  return `${secs}s`
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffSecs < 60) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format time to readable string
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Calculate workout volume (weight × reps)
 */
export function calculateVolume(
  weight: number | null,
  reps: number | null
): number {
  if (!weight || !reps) return 0
  return weight * reps
}

/**
 * Calculate total workout volume
 */
export function calculateTotalVolume(exercises: Array<{
  sets: Array<{ weight: number | null; reps: number | null }>
}>): number {
  return exercises.reduce((total, exercise) => {
    return total + exercise.sets.reduce((setTotal, set) => {
      return setTotal + calculateVolume(set.weight, set.reps)
    }, 0)
  }, 0)
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

/**
 * Calculate workout streak
 */
export function calculateStreak(workouts: Array<{ startedAt: string }>): number {
  if (workouts.length === 0) return 0
  
  const dates = workouts
    .map(w => new Date(w.startedAt).toDateString())
    .filter((date, i, arr) => arr.indexOf(date) === i)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  
  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  
  for (const dateStr of dates) {
    const workoutDate = new Date(dateStr)
    workoutDate.setHours(0, 0, 0, 0)
    
    const diffDays = Math.floor(
      (currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    
    if (diffDays === streak || (diffDays === 0 && streak === 0)) {
      streak++
      currentDate = workoutDate
    } else {
      break
    }
  }
  
  return streak
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return crypto.randomUUID()
}

/**
 * Convert units (kg to lbs or vice versa)
 */
export function convertWeight(
  weight: number,
  from: 'metric' | 'imperial',
  to: 'metric' | 'imperial'
): number {
  if (from === to) return weight
  if (from === 'metric' && to === 'imperial') {
    return weight * 2.20462
  }
  return weight / 2.20462
}

/**
 * Format weight with units
 */
export function formatWeight(
  weight: number | null,
  units: 'metric' | 'imperial'
): string {
  if (!weight) return '-'
  const converted = units === 'imperial' ? weight * 2.20462 : weight
  return `${Math.round(converted)} ${units === 'metric' ? 'kg' : 'lbs'}`
}
