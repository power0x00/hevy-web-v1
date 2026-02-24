import { useHevyStore } from '../store/useHevyStore'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

function Settings() {
  const { settings, updateSettings, workouts, routines } = useHevyStore()
  
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      {/* Profile */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        <div className="space-y-4">
          <Input
            label="Name"
            value={settings.name}
            onChange={(e) => updateSettings({ name: e.target.value })}
            placeholder="Your name"
          />
        </div>
      </Card>
      
      {/* Preferences */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Preferences</h2>
        <div className="space-y-4">
          {/* Units */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Units</div>
              <div className="text-sm text-text-muted">Choose between metric and imperial</div>
            </div>
            <select
              value={settings.units}
              onChange={(e) => updateSettings({ units: e.target.value as 'metric' | 'imperial' })}
              className="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="metric">Metric (kg)</option>
              <option value="imperial">Imperial (lbs)</option>
            </select>
          </div>
          
          {/* Theme */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Theme</div>
              <div className="text-sm text-text-muted">Choose your preferred theme</div>
            </div>
            <select
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' | 'system' })}
              className="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          
          {/* Default Rest Time */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Default Rest Time</div>
              <div className="text-sm text-text-muted">Rest time between sets</div>
            </div>
            <select
              value={settings.defaultRestTime}
              onChange={(e) => updateSettings({ defaultRestTime: parseInt(e.target.value) })}
              className="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={60}>1 min</option>
              <option value={90}>1.5 min</option>
              <option value={120}>2 min</option>
              <option value={180}>3 min</option>
              <option value={300}>5 min</option>
            </select>
          </div>
          
          {/* Sound */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Sound Effects</div>
              <div className="text-sm text-text-muted">Play sounds for timer</div>
            </div>
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                settings.soundEnabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </Card>
      
      {/* Stats */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-primary-500">{workouts.length}</div>
            <div className="text-sm text-text-muted">Total Workouts</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="text-2xl font-bold text-accent-green">{routines.length}</div>
            <div className="text-sm text-text-muted">Routines</div>
          </div>
        </div>
      </Card>
      
      {/* About */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">About</h2>
        <div className="space-y-2 text-sm text-text-muted">
          <p>Hevy Web v1.0.0</p>
          <p>A workout tracking app inspired by Hevy</p>
          <p className="pt-2">
            Built with React, TypeScript, Tailwind CSS, and ❤️
          </p>
        </div>
      </Card>
      
      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <h2 className="text-lg font-semibold text-accent-red mb-4">Danger Zone</h2>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
              localStorage.clear()
              window.location.reload()
            }
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm"
        >
          Clear All Data
        </button>
      </Card>
    </div>
  )
}

export default Settings
