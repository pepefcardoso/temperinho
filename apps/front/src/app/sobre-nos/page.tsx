import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ValuesSection } from '@/components/about/ValuesSection';
import { TeamSection } from '@/components/about/TeamSection';
import { MissionSection } from '@/components/about/MissionSection';
import { getAboutPageData } from '@/lib/api/about';
import MarketingSection from '@/components/marketing/MarketingSection';

export const metadata: Metadata = {
    title: 'Sobre Nós | Temperinho',
    description: 'Conheça nossa história, missão e a equipe apaixonada por trás da culinária verdadeiramente inclusiva.',
};

function HeroSection({ title, subtitle }: { title: string, subtitle: string }) {
    return (
        <section className="bg-muted/50 py-16">
            <div className="container mx-auto px-4 text-center max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">{title}</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">{subtitle}</p>
            </div>
        </section>
    );
}

function CtaSection({ title, subtitle }: { title: string, subtitle: string }) {
    return (
        <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center max-w-3xl">
                <h2 className="text-3xl font-display font-bold mb-4">{title}</h2>
                <p className="text-primary-foreground/80 text-lg mb-8">{subtitle}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary" asChild><Link href="/receitas">Explorar Receitas</Link></Button>
                    <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/50 hover:bg-primary-foreground hover:text-primary" asChild><Link href="/contato">Entrar em Contato</Link></Button>
                </div>
            </div>
        </section>
    );
}

export default async function AboutPage() {
    const { team, values, pageContent } = await getAboutPageData();

    return (
        <div className="bg-background">
            <main>
                <HeroSection title={pageContent.heroTitle} subtitle={pageContent.heroSubtitle} />
                <MissionSection
                    mission={pageContent.mission}
                    vision={pageContent.vision}
                    imageUrl={pageContent.imageUrl}
                />
                <ValuesSection values={values} />
                <TeamSection teamMembers={team} />
                <MarketingSection
                    adBannerHref="/marketing"
                    adBannerImageUrl=""
                    adBannerAltText="Anuncie conosco e conecte-se com nossa comunidade"
                    googleAdSlot={process.env.NEXT_PUBLIC_GOOGLE_AD_SLOT_ABOUT_US || ''}
                />
                <CtaSection title={pageContent.ctaTitle} subtitle={pageContent.ctaSubtitle} />
            </main>
        </div>
    );
}