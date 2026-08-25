import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Plan } from '@/types/company';

interface PlanCardProps {
    plan: Plan;
}

export function PlanCard({ plan }: PlanCardProps) {
    const numericPrice = Number(plan.price.replace(',', '.'));

    return (
        <div className={cn(
            "relative bg-background rounded-xl p-8 shadow-lg border-2 flex flex-col h-full",
            plan.is_popular ? 'border-primary ring-4 ring-primary/20' : 'border-border'
        )}>
            {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant={plan.is_popular ? 'default' : 'secondary'} className="px-4 py-1 text-sm">{plan.badge}</Badge>
                </div>
            )}
            <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-4">
                    <span className="text-4xl font-bold text-primary">
                        {numericPrice === 0 ? "Customizável" : `R$ ${plan.price}`}
                    </span>
                    {numericPrice !== 0 && (
                        <span className="text-muted-foreground ml-1">{plan.period}</span>
                    )}
                </div>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                    </li>
                ))}
            </ul>
            <Button size="lg" variant={plan.is_popular ? 'default' : 'secondary'} className="w-full mt-auto" asChild>
                <Link href="/contato?assunto=parceria">
                    Contratar Pacote <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
            </Button>
        </div>
    );
}