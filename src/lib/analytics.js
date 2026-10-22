const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let analyticsInitialized = false;

export function initializeAnalytics() {
    if (analyticsInitialized || !GA_MEASUREMENT_ID || typeof window === 'undefined') return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
        window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    analyticsInitialized = true;
}

export function trackEvent(eventName, parameters = {}) {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') return;

    window.gtag('event', eventName, parameters);
}
