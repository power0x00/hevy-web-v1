import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import { useEffect } from 'react'
import { useHevyStore } from './store/useHevyStore'
import Dashboard from './pages/Dashboard'
import Exercises from './pages/Exercises'
import Workout from './pages/Workout'
import History from './pages/History'
import Routines from './pages/Routines'
import Settings from './pages/Settings'

function App() {
  const { settings, activeWorkout } = useHevyStore()
  
  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    
    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(settings.theme)
    }
  }, [settings.theme])
  
  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/exercises', label: 'Exercises' },
    { to: '/workout', label: activeWorkout ? 'Workout' : 'Start' },
    { to: '/history', label: 'History' },
    { to: '/routines', label: 'Routines' },
  ]

  return (
    <Router>
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-lg border-b border-border-light/50 dark:border-border-dark/50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Hevy Web</h1>
                {activeWorkout && (
                  <p className="text-xs text-primary-500 font-medium">Workout in progress</p>
                )}
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                        : 'text-text-muted hover:text-text-light dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            
            <NavLink
              to="/settings"
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </NavLink>
          </div>
        </header>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-lg border-t border-border-light/50 dark:border-border-dark/50 safe-bottom">
          <div className="flex justify-around py-2">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
                    isActive
                      ? 'text-primary-500'
                      : 'text-text-muted'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/history" element={<History />} />
            <Route path="/routines" element={<Routines />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
