import { useState, useEffect } from 'react'
import { matchService } from '../services/matchService'
import { Bell, Plus, Trash2, Edit2, Check, X } from 'lucide-react'

const Alerts = () => {
  const [alerts, setAlerts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingAlert, setEditingAlert] = useState(null)
  const [editForm, setEditForm] = useState({ trigger: '', is_active: true })

  const triggerOptions = [
    { value: 'match_started', label: 'Match Started' },
    { value: 'tie_break', label: 'Tie Break' },
    { value: 'third_set', label: 'Third Set' },
    { value: 'match_finished', label: 'Match Finished' }
  ]

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    try {
      setError('')
      const data = await matchService.getAlerts()
      setAlerts(data)
    } catch (err) {
      setError('Failed to load alerts. Please try again.')
      console.error('Error loading alerts:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAlert = async (id) => {
    if (!window.confirm('Are you sure you want to delete this alert?')) {
      return
    }

    try {
      await matchService.deleteAlert(id)
      setAlerts(prev => prev.filter(alert => alert.id !== id))
    } catch (err) {
      console.error('Error deleting alert:', err)
    }
  }

  const handleEditAlert = (alert) => {
    setEditingAlert(alert.id)
    setEditForm({
      trigger: alert.trigger,
      is_active: alert.is_active
    })
  }

  const handleSaveEdit = async () => {
    try {
      const updatedAlert = await matchService.updateAlert(editingAlert, editForm)
      setAlerts(prev => prev.map(alert => 
        alert.id === editingAlert ? updatedAlert : alert
      ))
      setEditingAlert(null)
      setEditForm({ trigger: '', is_active: true })
    } catch (err) {
      console.error('Error updating alert:', err)
    }
  }

  const handleCancelEdit = () => {
    setEditingAlert(null)
    setEditForm({ trigger: '', is_active: true })
  }

  const getTriggerLabel = (trigger) => {
    const option = triggerOptions.find(opt => opt.value === trigger)
    return option ? option.label : trigger
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ace-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading alerts...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
          <Bell className="h-8 w-8 text-ace-blue" />
          <span>Match Alerts</span>
        </h1>
        <p className="text-gray-600">Get notified when important match events happen</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Alerts List */}
      {alerts.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {alerts.length} Alert{alerts.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.map((alert) => (
              <div key={alert.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                {editingAlert === alert.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Trigger Event
                        </label>
                        <select
                          value={editForm.trigger}
                          onChange={(e) => setEditForm(prev => ({ ...prev, trigger: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ace-blue focus:border-ace-blue"
                        >
                          {triggerOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`active-${alert.id}`}
                          checked={editForm.is_active}
                          onChange={(e) => setEditForm(prev => ({ ...prev, is_active: e.target.checked }))}
                          className="h-4 w-4 text-ace-blue focus:ring-ace-blue border-gray-300 rounded"
                        />
                        <label htmlFor={`active-${alert.id}`} className="text-sm text-gray-700">
                          Active
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-ace-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ace-green"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ace-blue"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.is_active ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getTriggerLabel(alert.trigger)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Match ID: {alert.match_id}
                          </div>
                        </div>
                        {!alert.is_active && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        Created {new Date(alert.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditAlert(alert)}
                        className="p-2 text-gray-400 hover:text-ace-blue hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit alert"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete alert"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts set up</h3>
          <p className="text-gray-500 mb-4">
            Create alerts from match cards to get notified about important events.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ace-gradient hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4 mr-2" />
            Go to Dashboard
          </a>
        </div>
      )}
    </div>
  )
}

export default Alerts
