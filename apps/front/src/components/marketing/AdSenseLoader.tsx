'use client';

import { useEffect, useState } from 'react';

interface AdSenseLoaderProps {
    clientId: string;
}

export default function AdSenseLoader({ clientId }: AdSenseLoaderProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!clientId || isLoaded) return;

        const loadAdSense = () => {
            if (document.getElementById('adsense-script')) return;

            const script = document.createElement('script');
            script.id = 'adsense-script';
            script.async = true;
            script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);

            setIsLoaded(true);
        };

        const handleConsentUpdate = (event: Event) => {
            const customEvent = event as CustomEvent<{ accepted?: string[] }>;
            const acceptedCategories = customEvent.detail?.accepted || [];
            if (acceptedCategories.includes('advertisement')) {
                loadAdSense();
            }
        };

        window.addEventListener('cookieyes_consent_update', handleConsentUpdate);
        window.addEventListener('CookieYes-consent-update', handleConsentUpdate);

        const checkInitialConsent = () => {
            const match = document.cookie.match(/(?:^|; )cookieyes-consent=([^;]*)/);
            if (match) {
                const consentData = decodeURIComponent(match[1]);
                if (consentData.includes('advertisement=yes')) {
                    loadAdSense();
                }
            }
        };

        checkInitialConsent();

        return () => {
            window.removeEventListener('cookieyes_consent_update', handleConsentUpdate);
            window.removeEventListener('CookieYes-consent-update', handleConsentUpdate);
        };
    }, [clientId, isLoaded]);

    return null;
}