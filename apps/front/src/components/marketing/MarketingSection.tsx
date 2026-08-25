import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const DynamicAdBanner = dynamic(() => import('@/components/marketing/AdBanner'));
const DynamicGoogleAd = dynamic(() => import('@/components/marketing/GoogleAd'));

interface MarketingSectionProps {
    adBannerHref: string;
    adBannerImageUrl: string;
    adBannerAltText: string;
    googleAdSlot: string;
}

const MarketingSection = ({
    adBannerHref,
    adBannerImageUrl,
    adBannerAltText,
    googleAdSlot,
}: MarketingSectionProps) => {
    return (
        <section className="container mx-auto px-4 py-16 space-y-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground">
                Apoie nossa Comunidade
            </h2>

            <Suspense fallback={<div className="h-40 bg-muted rounded-xl animate-pulse" />}>
                <DynamicAdBanner
                    href={adBannerHref}
                    imageUrl={adBannerImageUrl}
                    altText={adBannerAltText}
                    layout="full"
                    size="large"
                />
            </Suspense>

            <Suspense fallback={<div className="h-24 bg-muted rounded-xl animate-pulse" />}>
                <DynamicGoogleAd
                    adClient={process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT || ''}
                    slot={googleAdSlot}
                    responsive
                    className="w-full"
                />
            </Suspense>
        </section>
    );
};

export default MarketingSection;