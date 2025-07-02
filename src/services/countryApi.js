import axios from 'axios';

// API configuration
const API_CONFIG = {
    primary: 'https://restcountries.com/v3.1/all',
    fallback: 'https://restcountries.com/v2/all',
    fields: 'name,flags,population,area,region,capital,currencies,languages'
};

// Alternative APIs for better reliability (reserved for future use)
// const ALTERNATIVE_APIS = [
//     'https://restcountries.com/v3.1/all',
//     'https://restcountries.com/v2/all',
//     // Add more alternative APIs here if needed
// ];

class CountryApiService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    // Check if cached data is still valid
    isCacheValid(timestamp) {
        return Date.now() - timestamp < this.cacheTimeout;
    }

    // Transform v3.1 API data to consistent format
    transformV31Data(countries) {
        return countries.map(country => ({
            name: country.name.common || country.name,
            flag: country.flags.svg || country.flags.png,
            population: country.population,
            area: country.area,
            region: country.region,
            capital: country.capital?.[0] || 'N/A',
            currencies: country.currencies ? Object.keys(country.currencies).join(', ') : 'N/A',
            languages: country.languages ? Object.values(country.languages).join(', ') : 'N/A'
        }));
    }

    // Transform v2 API data to consistent format
    transformV2Data(countries) {
        return countries.map(country => ({
            name: country.name,
            flag: country.flag,
            population: country.population,
            area: country.area,
            region: country.region,
            capital: country.capital || 'N/A',
            currencies: country.currencies ? country.currencies.map(c => c.name).join(', ') : 'N/A',
            languages: country.languages ? country.languages.map(l => l.name).join(', ') : 'N/A'
        }));
    }

    // Fetch countries with multiple fallback options
    async fetchCountries() {
        // Check cache first
        const cached = this.cache.get('countries');
        if (cached && this.isCacheValid(cached.timestamp)) {
            return cached.data;
        }

        const errors = [];

        // Try v3.1 API first
        try {
            const response = await axios.get(`${API_CONFIG.primary}?fields=${API_CONFIG.fields}`, {
                timeout: 10000 // 10 second timeout
            });
            const countries = this.transformV31Data(response.data);
            this.cache.set('countries', { data: countries, timestamp: Date.now() });
            return countries;
        } catch (error) {
            errors.push(`v3.1 API failed: ${error.message}`);
            console.warn('v3.1 API failed, trying v2 fallback:', error.message);
        }

        // Try v2 API as fallback
        try {
            const response = await axios.get(API_CONFIG.fallback, {
                timeout: 10000
            });
            const countries = this.transformV2Data(response.data);
            this.cache.set('countries', { data: countries, timestamp: Date.now() });
            return countries;
        } catch (error) {
            errors.push(`v2 API failed: ${error.message}`);
            console.error('Both APIs failed:', error.message);
        }

        // If all APIs fail, throw comprehensive error
        throw new Error(`Failed to fetch country data. Errors: ${errors.join('; ')}`);
    }

    // Get a random country from the provided countries array
    getRandomCountry(countries) {
        if (!countries || countries.length === 0) {
            throw new Error('No countries available');
        }
        const randomIndex = Math.floor(Math.random() * countries.length);
        return countries[randomIndex];
    }

    // Generate multiple choice options
    generateOptions(correctCountry, allCountries, count = 4) {
        const options = [correctCountry.name];
        
        while (options.length < count) {
            const randomCountry = this.getRandomCountry(allCountries);
            if (!options.includes(randomCountry.name)) {
                options.push(randomCountry.name);
            }
        }

        return options.sort(() => Math.random() - 0.5);
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }
}

export default new CountryApiService(); 