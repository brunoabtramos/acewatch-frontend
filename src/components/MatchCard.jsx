import { useState } from 'react'
import { Heart, Bell, Calendar, MapPin } from 'lucide-react'
import { matchService } from '../services/matchService'

const MatchCard = ({ match, onFavoriteUpdate, onAlertUpdate }) => {
  const [isAddingFavorite, setIsAddingFavorite] = useState(false)
  const [isAddingAlert, setIsAddingAlert] = useState(false)

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'in play':
        return 'status-live'
      case 'finished':
        return 'status-finished'
      default:
        return 'status-scheduled'
    }
  }


  const formatScore = (scoreJson) => {
    if (!scoreJson) return null
    
    const { home_sets = 0, away_sets = 0, set_scores = [] } = scoreJson
    
    return (
      <div className="text-center">
        <div className="text-2xl font-bold mb-2">
          <span className="text-ace-blue">{home_sets}</span>
          <span className="mx-2 text-gray-400">-</span>
          <span className="text-ace-green">{away_sets}</span>
        </div>
        {set_scores.length > 0 && (
          <div className="text-sm text-gray-600 flex justify-center space-x-1 flex-wrap">
            {set_scores.map((setScore, index) => (
              <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
                {setScore}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  const handleAddFavorite = async () => {
    setIsAddingFavorite(true)
    try {
      await matchService.addFavorite({
        type: 'match',
        external_event_id: match.external_event_id,
        match_id: match.id
      })
      onFavoriteUpdate?.()
    } catch (error) {
      console.error('Error adding favorite:', error)
    } finally {
      setIsAddingFavorite(false)
    }
  }

  const handleAddAlert = async (trigger) => {
    setIsAddingAlert(true)
    try {
      await matchService.createAlert({
        external_event_id: match.external_event_id,
        trigger
      })
      onAlertUpdate?.()
    } catch (error) {
      console.error('Error adding alert:', error)
    } finally {
      setIsAddingAlert(false)
    }
  }

  return (
    <div className={`match-card match-card-animate ${match.status === 'In Play' ? 'match-card-live' : ''}`}>
      {/* Match Status */}
      <div className="flex justify-between items-center mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(match.status)}`}>
          {match.status === 'In Play' && <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>}
          {match.status}
        </span>
        
        <div className="flex space-x-2">
          <button
            onClick={handleAddFavorite}
            disabled={isAddingFavorite}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Add to favorites"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleAddAlert('match_started')}
            disabled={isAddingAlert}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
            title="Add alert"
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* League and Round */}
      <div className="mb-4">
        <div className="text-sm font-medium text-ace-blue">{match.league}</div>
        {match.round && (
          <div className="text-xs text-gray-500">{match.round}</div>
        )}
      </div>

      {/* Players and Score */}
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Home Player */}
          <div className="text-right">
            <div className="player-name text-lg">{match.home_player}</div>
          </div>

          {/* Score or VS */}
          <div className="flex justify-center">
            {match.score_json ? (
              formatScore(match.score_json)
            ) : (
              <span className="text-gray-400 font-medium">VS</span>
            )}
          </div>

          {/* Away Player */}
          <div className="text-left">
            <div className="player-name text-lg">{match.away_player}</div>
          </div>
        </div>
      </div>

      {/* Live Updates Indicator */}
      {match.status === 'In Play' && (
        <div className="mt-3 text-center">
          <span className="inline-flex items-center text-xs text-red-600">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 animate-pulse"></span>
            Live updates
          </span>
        </div>
      )}
    </div>
  )
}

export default MatchCard
