import { useState, useEffect } from 'react'
import { matchService } from '../services/matchService'
import MatchCard from '../components/MatchCard'
import { RefreshCw, Filter, Calendar, Trophy } from 'lucide-react'

const Dashboard = () => {
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    date: ''
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    loadMatches()
  }, [filters])

  const loadMatches = async () => {
    try {
      setError('')
      const data = await matchService.getMatches(filters)
      setMatches(data)
    } catch (err) {
      setError('Failed to load matches. Please try again.')
      console.error('Error loading matches:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadMatches()
    setIsRefreshing(false)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      status: '',
      date: ''
    })
  }

  const getMatchesByStatus = (status) => {
    return matches.filter(match => match.status.toLowerCase() === status.toLowerCase())
  }

  const liveMatches = getMatchesByStatus('In Play')
  const scheduledMatches = getMatchesByStatus('Scheduled')
  const finishedMatches = getMatchesByStatus('Finished')

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ace-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading matches...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tennis Dashboard</h1>
        <p className="text-gray-600">Live scores and upcoming matches</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ace-blue focus:border-ace-blue"
              >
                <option value="">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Play">Live</option>
                <option value="Finished">Finished</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ace-blue focus:border-ace-blue"
              />
            </div>

            {/* Clear Filters */}
            {(filters.status || filters.date) && (
              <button
                onClick={clearFilters}
                className="text-sm text-ace-blue hover:text-ace-green transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-ace-blue text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h2 className="text-xl font-semibold text-gray-900">Live Matches ({liveMatches.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onFavoriteUpdate={loadMatches}
                onAlertUpdate={loadMatches}
              />
            ))}
          </div>
        </div>
      )}

      {/* Scheduled Matches Section */}
      {scheduledMatches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upcoming Matches ({scheduledMatches.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scheduledMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onFavoriteUpdate={loadMatches}
                onAlertUpdate={loadMatches}
              />
            ))}
          </div>
        </div>
      )}

      {/* Finished Matches Section */}
      {finishedMatches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Results ({finishedMatches.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {finishedMatches.slice(0, 6).map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onFavoriteUpdate={loadMatches}
                onAlertUpdate={loadMatches}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {matches.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-500">
            {filters.status || filters.date
              ? 'Try adjusting your filters or check back later.'
              : 'Check back later for upcoming matches.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Dashboard
