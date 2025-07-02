import { useEffect, useRef } from 'react';

const CloudflareCaptcha = ({ siteKey, onVerify, onError }) => {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);

    useEffect(() => {
        // Load Cloudflare Turnstile script
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
            if (window.turnstile && containerRef.current) {
                widgetIdRef.current = window.turnstile.render(containerRef.current, {
                    sitekey: siteKey,
                    theme: 'light',
                    size: 'normal',
                    'appearance': 'interaction-only',
                    callback: (token) => {
                        onVerify(token);
                    },
                    'expired-callback': () => {
                        onError('CAPTCHA expired. Please try again.');
                    },
                    'error-callback': () => {
                        onError('CAPTCHA error. Please try again.');
                    }
                });
            }
        };

        script.onerror = () => {
            onError('Failed to load CAPTCHA. Please refresh the page.');
        };

        document.head.appendChild(script);

        return () => {
            // Cleanup
            if (window.turnstile && widgetIdRef.current) {
                window.turnstile.remove(widgetIdRef.current);
            }
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [siteKey, onVerify, onError]);

    const resetCaptcha = () => {
        if (window.turnstile && widgetIdRef.current) {
            window.turnstile.reset(widgetIdRef.current);
        }
    };

    return (
        <div>
            <div 
                ref={containerRef}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    margin: '1rem 0'
                }}
            />
            <div style={{
                textAlign: 'center',
                fontSize: '0.875rem',
                color: '#6c757d',
                marginTop: '0.5rem'
            }}>
                This site is protected by Cloudflare Turnstile
            </div>
        </div>
    );
};

export default CloudflareCaptcha; 