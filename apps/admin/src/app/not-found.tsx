import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                        <Icon
                            name="SearchX"
                            className="h-12 w-12 text-muted-foreground"
                        />
                    </div>
                    <CardTitle className="mt-4 text-3xl font-bold tracking-tight">
                        Página Não Encontrada
                    </CardTitle>
                    <CardDescription className="mt-2 text-base text-muted-foreground">
                        Oops! Parece que a página que você está tentando acessar não existe
                        ou foi movida.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/dashboard">Voltar ao Início</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}