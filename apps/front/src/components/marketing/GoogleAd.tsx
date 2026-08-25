'use client';

import { JSX, useEffect } from 'react';
import Script from 'next/script';

interface GoogleAdProps {
  adClient: string;
  slot: string;
  adFormat?: string;
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: object[];
  }
}

const GoogleAd = ({
  adClient,
  slot,
  adFormat = "auto",
  responsive = true,
  className,
}: GoogleAdProps): JSX.Element => {
  useEffect(() => {
    if (!adClient) {
      console.error("Google AdSense client ID (adClient) não está definido, pulando AdSense.");
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Erro ao carregar anúncio do Google:", err);
    }
  }, [adClient, slot, adFormat, responsive]);

  if (!adClient) {
    return (
      <div className="ad-placeholder" style={{ display: 'none' }}>
        Ad client not configured
      </div>
    );
  }

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <div className={className} style={{ overflow: 'hidden', textAlign: 'center' }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adClient}
          data-ad-slot={slot}
          data-ad-format={adFormat}
          data-full-width-responsive={responsive.toString()}
        ></ins>
      </div>
    </>
  );
};

export default GoogleAd;