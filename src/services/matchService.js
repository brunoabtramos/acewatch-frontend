import api from './api'

export const matchService = {
  async getMatches(params = {}) {
    // Get processed data from backend (data is now pre-processed by TennisDataProcessor)
    try {
      const [liveResponse, upcomingResponse, recentResponse] = await Promise.all([
        api.get('/tennis/live'),
        api.get('/tennis/upcoming'),  
        api.get('/tennis/recent')
      ])

      // Data is already processed by the backend, just combine all matches
      const liveMatches = liveResponse.data.data || []
      const upcomingMatches = upcomingResponse.data.data || []
      const recentMatches = recentResponse.data.data || []

      // Combine all matches with priority: live > upcoming > recent
      return [...liveMatches, ...upcomingMatches, ...recentMatches]
    } catch (error) {
      console.error('Error fetching matches:', error)
      return []
    }
  },


  async getMatchById(id) {
    const response = await api.get(`/matches/${id}`)
    return response.data
  },

  async getFavorites() {
    const response = await api.get('/favorites')
    return response.data
  },

  async addFavorite(favorite) {
    const response = await api.post('/favorites', favorite)
    return response.data
  },

  async removeFavorite(id) {
    const response = await api.delete(`/favorites/${id}`)
    return response.data
  },

  async getAlerts() {
    const response = await api.get('/alerts')
    return response.data
  },

  async createAlert(alert) {
    const response = await api.post('/alerts', alert)
    return response.data
  },

  async updateAlert(id, alert) {
    const response = await api.put(`/alerts/${id}`, alert)
    return response.data
  },

  async deleteAlert(id) {
    const response = await api.delete(`/alerts/${id}`)
    return response.data
  }
}
