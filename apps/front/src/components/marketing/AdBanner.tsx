'use client';

import { Image as ImageIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

const adBannerVariants = cva(
    "relative flex items-center justify-center rounded-xl transition-all duration-300 group",
    {
        variants: {
            variant: {
                placeholder: "bg-muted/30 border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/50 text-muted-foreground",
                image: "bg-card overflow-hidden",
            },
            size: {
                small: "h-24 md:h-28",
                medium: "h-32 md:h-40",
                large: "h-40 md:h-56",
            },
            layout: {
                full: "w-full",
                sidebar: "max-w-xs w-full",
            }
        },
        defaultVariants: {
            variant: "placeholder",
            size: "medium",
            layout: "full",
        },
    }
);

export interface AdBannerProps extends Omit<VariantProps<typeof adBannerVariants>, 'variant'> {
    href: string;
    imageUrl?: string;
    altText?: string;
    className?: string;
}

const PlaceholderContent = () => (
    <div className="text-center p-4">
        <ImageIcon className="h-6 w-6 mx-auto mb-2 transition-colors group-hover:text-primary" />
        <p className="text-sm font-medium transition-colors group-hover:text-primary">
            Espaço Publicitário
        </p>
        <p className="text-xs">Clique para saber mais</p>
    </div>
);

const AdBanner = ({
    size,
    layout,
    className,
    href,
    imageUrl,
    altText = "Anúncio publicitário"
}: AdBannerProps) => {

    const hasImage = imageUrl && href;
    const finalVariant = hasImage ? 'image' : 'placeholder';

    const imageSizes = layout === 'sidebar'
        ? '(max-width: 320px) 100vw, 320px'
        : '100vw';

    return (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            aria-label={altText}
            className={cn(adBannerVariants({ variant: finalVariant, size, layout }), className)}
        >
            {hasImage ? (
                <Image
                    src={imageUrl}
                    alt={altText}
                    fill
                    sizes={imageSizes}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            ) : (
                <PlaceholderContent />
            )}
        </Link>
    );
};

export default AdBanner;