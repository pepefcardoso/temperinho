import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type CardProps = React.ComponentProps<typeof Card>;

type AuthCardProps = CardProps & {
    cardTitle: string;
    cardDescription: string;
    children: React.ReactNode;
};

export function AuthCard({
    cardTitle,
    cardDescription,
    children,
    ...props
}: AuthCardProps) {
    return (
        <Card {...props}>
            <CardHeader>
                <CardTitle>{cardTitle}</CardTitle>
                <CardDescription>{cardDescription}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}