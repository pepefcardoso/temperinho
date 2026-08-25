import { ValueCard } from "@/types/about";

function ValueCardComponent({ value }: { value: ValueCard }) {
    return (
        <div className="bg-card rounded-xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-border">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                <value.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3">{value.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
        </div>
    );
}

export function ValuesSection({ values }: { values: ValueCard[] }) {
    return (
        <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 max-w-2xl mx-auto">
                    <h2 className="text-3xl font-display font-bold text-foreground mb-4">Nossos Valores</h2>
                    <p className="text-muted-foreground">Os princípios que guiam cada receita, cada artigo e cada interação em nossa plataforma.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value) => (
                        <ValueCardComponent key={value.title} value={value} />
                    ))}
                </div>
            </div>
        </section>
    );
}
