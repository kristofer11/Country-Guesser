import localDatabase from './localDatabase';

// Local database configuration
const DB_CONFIG = {
    cacheTimeout: 2 * 60 * 1000, // 2 minutes for leaderboard data
    maxRetries: 3,
    retryDelay: 1000
};

class LeaderboardApiService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = DB_CONFIG.cacheTimeout;
        this.initialized = false;
    }

    // Initialize the local database
    async init() {
        if (!this.initialized) {
            try {
                await localDatabase.init();
                this.initialized = true;
                console.log('Local database initialized successfully');
            } catch (error) {
                console.error('Failed to initialize local database:', error);
                throw error;
            }
        }
    }

    // Check if cached data is still valid
    isCacheValid(timestamp) {
        return Date.now() - timestamp < this.cacheTimeout;
    }

    // Get leaderboard data with caching
    async getLeaders() {
        await this.init();
        
        // Check cache first
        const cached = this.cache.get('leaders');
        if (cached && this.isCacheValid(cached.timestamp)) {
            return cached.data;
        }

        try {
            const leaders = await localDatabase.getLeaders();
            this.cache.set('leaders', { data: leaders, timestamp: Date.now() });
            return leaders;
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error.message);
            throw new Error(`Failed to load leaderboard: ${error.message}`);
        }
    }

    // Submit a new score
    async submitScore(scoreData) {
        await this.init();
        
        try {
            const result = await localDatabase.addScore(scoreData);
            
            // Clear cache to refresh leaderboard
            this.cache.delete('leaders');
            
            console.log('Score submitted to local database:', result);
            return result;
        } catch (error) {
            console.error('Failed to submit score:', error.message);
            throw new Error(`Failed to submit score: ${error.message}`);
        }
    }

    // Get top N leaders
    async getTopLeaders(count = 10) {
        try {
            return await localDatabase.getTopLeaders(count);
        } catch (error) {
            console.error('Failed to get top leaders:', error.message);
            throw error;
        }
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }

    // Get database statistics
    async getStats() {
        await this.init();
        return await localDatabase.getStats();
    }

    // Export data
    async exportData() {
        await this.init();
        return await localDatabase.exportData();
    }

    // Import data
    async importData(data) {
        await this.init();
        return await localDatabase.importData(data);
    }

    // Clear all data
    async clearAll() {
        await this.init();
        await localDatabase.clearAll();
        this.clearCache();
    }

    // Retry mechanism for failed requests
    async retryRequest(requestFn, maxRetries = DB_CONFIG.maxRetries, delay = DB_CONFIG.retryDelay) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await requestFn();
            } catch (error) {
                if (attempt === maxRetries) {
                    throw error;
                }
                console.warn(`Request failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    }
}

export default new LeaderboardApiService(); 