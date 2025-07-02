// Cloudflare Turnstile Configuration
export const CAPTCHA_CONFIG = {
    // Replace this with your actual Cloudflare Turnstile site key
    // You can get this from: https://dash.cloudflare.com/?to=/:account/turnstile
    siteKey: '1x00000000000000000000AA',
    
    // Fallback to math CAPTCHA if Cloudflare fails
    enableFallback: true,
    
    // Theme options: 'light', 'dark'
    theme: 'light',
    
    // Size options: 'normal', 'compact'
    size: 'normal'
};

// Instructions for setting up Cloudflare Turnstile:
// 1. Go to https://dash.cloudflare.com/?to=/:account/turnstile
// 2. Create a new site key
// 3. Choose "Managed" for automatic challenge
// 4. Set domains to your website domain
// 5. Copy the site key and replace 'YOUR_CLOUDFLARE_TURNSTILE_SITE_KEY' above
// 6. For development, you can use the test keys provided by Cloudflare 