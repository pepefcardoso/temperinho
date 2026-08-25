import Image from 'next/image';

interface MissionSectionProps {
    mission: string;
    vision: string;
    imageUrl: string;
}

export function MissionSection({ mission, vision, imageUrl }: MissionSectionProps) {
    return (
        <section className="py-16 bg-card">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                    <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg">
                        <Image
                            src={imageUrl}
                            alt="Nossa cozinha e missão"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                        />
                    </div>
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-display font-semibold text-foreground mb-4">Nossa Missão</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">{mission}</p>
                        </div>
                        <div>
                            <h2 className="text-3xl font-display font-semibold text-foreground mb-4">Nossa Visão</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">{vision}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}