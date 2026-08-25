import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface MarketingHeroProps {
    imageUrl: string;
}

export function MarketingHero({ imageUrl }: MarketingHeroProps) {
    return (
        <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Anuncie com a Gente</h1>
                        <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed">
                            Conecte sua marca com milhares de pessoas apaixonadas por culinária inclusiva. Alcance seu público-alvo de forma autêntica e eficaz.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" variant="secondary" asChild>
                                <Link href="#pacotes">Ver Pacotes</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/50 hover:bg-primary-foreground hover:text-primary" asChild>
                                <Link href="/contato">Falar com Consultor</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="relative h-80 rounded-xl overflow-hidden shadow-2xl">
                        <Image
                            src={imageUrl}
                            alt="Gráficos de análise de marketing"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}