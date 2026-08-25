import Link from "next/link";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Icon, IconName } from "@/components/ui/icon";

interface ActionCardProps {
    title: string;
    description: string;
    href: string;
    icon: IconName;
}

export function ActionCard({ title, description, href, icon }: ActionCardProps) {
    return (
        <Link href={href}>
            <Card className="hover:border-primary hover:bg-accent transition-colors">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon name={icon} className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                </CardHeader>
            </Card>
        </Link>
    );
}