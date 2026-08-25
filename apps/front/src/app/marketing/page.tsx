import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMarketingData } from '@/lib/api/marketing';
import { PageSkeleton } from '@/components/skeletons/PageSkeleton';
import { MarketingHero } from '@/components/marketing/MarketingHero';
import { PlanCard } from '@/components/marketing/PlanCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plan } from '@/types/company';
import { getPlans } from '@/lib/api/plan';

export const metadata: Metadata = {
    title: 'Anuncie Conosco | Temperinho',
    description: 'Conecte sua marca com milhares de pessoas apaixonadas por culinária inclusiva e alimentação saudável.',
};

function PlansSection({ plans }: { plans: Plan[] }) {
    return (
        <section id="pacotes" className="py-16 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-display font-bold text-foreground mb-4">Pacotes de Publicidade</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">Escolha o plano ideal para sua marca e comece a alcançar resultados hoje.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
                    {plans.map((plan) => <PlanCard key={plan.name} plan={plan} />)}
                </div>
            </div>
        </section>
    );
}

function CtaSection() {
    return (
        <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4 text-center max-w-4xl">
                <h2 className="text-3xl font-display font-bold mb-4">Pronto para Fazer sua Marca Crescer?</h2>
                <p className="text-muted-foreground text-lg mb-8">Entre em contato e descubra como podemos ajudar sua marca a alcançar milhares de consumidores engajados.</p>
                <Button size="lg" asChild>
                    <Link href="/contato?assunto=proposta">Solicitar Proposta</Link>
                </Button>
            </div>
        </section>
    );
}

async function MarketingContent() {
    try {
        const paginatedResponse = await getPlans({
            limit: 3,
        });
        const plans = paginatedResponse.data;
        const { heroImageUrl } = await getMarketingData();

        return (
            <>
                <MarketingHero imageUrl={heroImageUrl} />
                <PlansSection plans={plans} />
                <CtaSection />
            </>
        );
    } catch (error) {
        console.error("Falha ao carregar dados da página de marketing:", error);
        notFound();
    }
}

export default function MarketingPage() {
    return (
        <div className="bg-background">
            <Suspense fallback={<PageSkeleton layout="single-column" />}>
                <main>
                    <MarketingContent />
                </main>
            </Suspense>
        </div>
    );
}