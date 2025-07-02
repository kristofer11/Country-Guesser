// Local Database Service using IndexedDB with localStorage fallback
class LocalDatabaseService {
    constructor() {
        this.dbName = 'CountryGuesserDB';
        this.dbVersion = 1;
        this.storeName = 'leaderboard';
        this.db = null;
        this.isIndexedDBSupported = 'indexedDB' in window;
    }

    // Initialize the database
    async init() {
        console.log('Initializing local database...');
        if (this.isIndexedDBSupported) {
            try {
                console.log('Attempting to use IndexedDB...');
                return await this.initIndexedDB();
            } catch (error) {
                console.warn('IndexedDB failed, falling back to localStorage:', error);
                return this.initLocalStorage();
            }
        } else {
            console.warn('IndexedDB not supported, using localStorage');
            return this.initLocalStorage();
        }
    }

    // Initialize IndexedDB
    async initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                reject(new Error('Failed to open IndexedDB'));
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create leaderboard store if it doesn't exist
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    
                    // Create indexes for better querying
                    store.createIndex('streak', 'streak', { unique: false });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                    store.createIndex('name', 'name', { unique: false });
                }

                // Create comments store if it doesn't exist
                if (!db.objectStoreNames.contains('comments')) {
                    const commentsStore = db.createObjectStore('comments', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    
                    // Create indexes for comments
                    commentsStore.createIndex('timestamp', 'timestamp', { unique: false });
                    commentsStore.createIndex('author', 'author', { unique: false });
                }
            };
        });
    }

    // Initialize localStorage fallback
    initLocalStorage() {
        this.db = 'localStorage';
        if (!localStorage.getItem('leaderboard')) {
            localStorage.setItem('leaderboard', JSON.stringify([]));
        }
    }

    // Get all leaderboard entries
    async getLeaders() {
        await this.ensureInit();
        console.log('Getting leaders, storage type:', this.db === 'localStorage' ? 'localStorage' : 'IndexedDB');
        
        if (this.db === 'localStorage') {
            return this.getLeadersFromLocalStorage();
        } else {
            return this.getLeadersFromIndexedDB();
        }
    }

    // Get all comments
    async getComments() {
        await this.ensureInit();
        
        if (this.db === 'localStorage') {
            return this.getCommentsFromLocalStorage();
        } else {
            return this.getCommentsFromIndexedDB();
        }
    }

    // Get leaders from IndexedDB
    async getLeadersFromIndexedDB() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result || []);
            };

            request.onerror = () => {
                reject(new Error('Failed to get leaders from IndexedDB'));
            };
        });
    }

    // Get comments from IndexedDB
    async getCommentsFromIndexedDB() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['comments'], 'readonly');
            const store = transaction.objectStore('comments');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result || []);
            };

            request.onerror = () => {
                reject(new Error('Failed to get comments from IndexedDB'));
            };
        });
    }

    // Get leaders from localStorage
    getLeadersFromLocalStorage() {
        try {
            const data = localStorage.getItem('leaderboard');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    }

    // Get comments from localStorage
    getCommentsFromLocalStorage() {
        try {
            const data = localStorage.getItem('comments');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading comments from localStorage:', error);
            return [];
        }
    }

    // Add a new score
    async addScore(scoreData) {
        await this.ensureInit();
        
        const entry = {
            ...scoreData,
            timestamp: Date.now(),
            id: Date.now() + Math.random() // Simple unique ID
        };

        if (this.db === 'localStorage') {
            return this.addScoreToLocalStorage(entry);
        } else {
            return this.addScoreToIndexedDB(entry);
        }
    }

    // Add a new comment
    async addComment(commentData) {
        await this.ensureInit();
        
        const entry = {
            ...commentData,
            timestamp: Date.now(),
            id: Date.now() + Math.random() // Simple unique ID
        };

        if (this.db === 'localStorage') {
            return this.addCommentToLocalStorage(entry);
        } else {
            return this.addCommentToIndexedDB(entry);
        }
    }

    // Add score to IndexedDB
    async addScoreToIndexedDB(entry) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(entry);

            request.onsuccess = () => {
                resolve(entry);
            };

            request.onerror = () => {
                reject(new Error('Failed to add score to IndexedDB'));
            };
        });
    }

    // Add comment to IndexedDB
    async addCommentToIndexedDB(entry) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['comments'], 'readwrite');
            const store = transaction.objectStore('comments');
            const request = store.add(entry);

            request.onsuccess = () => {
                resolve(entry);
            };

            request.onerror = () => {
                reject(new Error('Failed to add comment to IndexedDB'));
            };
        });
    }

    // Add score to localStorage
    addScoreToLocalStorage(entry) {
        try {
            const leaders = this.getLeadersFromLocalStorage();
            leaders.push(entry);
            
            // Keep only top 100 scores to prevent localStorage from getting too large
            if (leaders.length > 100) {
                leaders.sort((a, b) => b.streak - a.streak);
                leaders.splice(100);
            }
            
            localStorage.setItem('leaderboard', JSON.stringify(leaders));
            return entry;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            throw new Error('Failed to add score to localStorage');
        }
    }

    // Add comment to localStorage
    addCommentToLocalStorage(entry) {
        try {
            const comments = this.getCommentsFromLocalStorage();
            comments.unshift(entry); // Add to beginning for newest first
            
            // Keep only last 50 comments to prevent localStorage from getting too large
            if (comments.length > 50) {
                comments.splice(50);
            }
            
            localStorage.setItem('comments', JSON.stringify(comments));
            return entry;
        } catch (error) {
            console.error('Error writing comment to localStorage:', error);
            throw new Error('Failed to add comment to localStorage');
        }
    }

    // Get top N leaders
    async getTopLeaders(count = 10) {
        const leaders = await this.getLeaders();
        return leaders
            .sort((a, b) => b.streak - a.streak)
            .slice(0, count);
    }

    // Clear all data
    async clearAll() {
        await this.ensureInit();
        
        if (this.db === 'localStorage') {
            localStorage.removeItem('leaderboard');
        } else {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.clear();

                request.onsuccess = () => resolve();
                request.onerror = () => reject(new Error('Failed to clear IndexedDB'));
            });
        }
    }

    // Get database statistics
    async getStats() {
        const leaders = await this.getLeaders();
        return {
            totalEntries: leaders.length,
            highestStreak: leaders.length > 0 ? Math.max(...leaders.map(l => l.streak)) : 0,
            averageStreak: leaders.length > 0 ? 
                Math.round(leaders.reduce((sum, l) => sum + l.streak, 0) / leaders.length) : 0,
            storageType: this.db === 'localStorage' ? 'localStorage' : 'IndexedDB'
        };
    }

    // Ensure database is initialized
    async ensureInit() {
        if (!this.db) {
            await this.init();
        }
    }

    // Export data (for backup)
    async exportData() {
        const leaders = await this.getLeaders();
        const stats = await this.getStats();
        
        return {
            version: '1.0',
            exportDate: new Date().toISOString(),
            stats,
            data: leaders
        };
    }

    // Import data (for restore)
    async importData(data) {
        if (!data || !data.data || !Array.isArray(data.data)) {
            throw new Error('Invalid data format');
        }

        await this.clearAll();
        
        for (const entry of data.data) {
            await this.addScore(entry);
        }
    }
}

// Create and export a singleton instance
const localDatabase = new LocalDatabaseService();
export default localDatabase; 