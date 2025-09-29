import { useState, useEffect } from 'react'
import { matchService } from '../services/matchService'
import { Heart, Trash2 } from 'lucide-react'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      setError('')
      const data = await matchService.getFavorites()
      setFavorites(data)
    } catch (err) {
      setError('Failed to load favorites. Please try again.')
      console.error('Error loading favorites:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFavorite = async (id) => {
    try {
      await matchService.removeFavorite(id)
      setFavorites(prev => prev.filter(fav => fav.id !== id))
    } catch (err) {
      console.error('Error removing favorite:', err)
      // You could show a toast notification here
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ace-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading favorites...</p>
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
          <Heart className="h-8 w-8 text-red-500" />
          <span>My Favorites</span>
        </h1>
        <p className="text-gray-600">Keep track of your favorite matches and players</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Favorites List */}
      {favorites.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {favorites.length} Favorite{favorites.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        favorite.type === 'match' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {favorite.type} Favorite
                        </div>
                        {favorite.type === 'match' && favorite.match && (
                          <div className="text-sm text-gray-600">
                            {favorite.match.home_player} vs {favorite.match.away_player}
                          </div>
                        )}
                        {favorite.type === 'player' && favorite.external_player_id && (
                          <div className="text-sm text-gray-600">
                            Player ID: {favorite.external_player_id}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Added {new Date(favorite.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveFavorite(favorite.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-4">
            Start adding matches and players to your favorites from the dashboard.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ace-gradient hover:opacity-90 transition-opacity"
          >
            Go to Dashboard
          </a>
        </div>
      )}
    </div>
  )
}

export default Favorites
