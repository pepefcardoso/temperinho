'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompanyErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface CompanyErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export class CompanyErrorBoundary extends React.Component<
    CompanyErrorBoundaryProps,
    CompanyErrorBoundaryState
> {
    constructor(props: CompanyErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): CompanyErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Company Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            const FallbackComponent = this.props.fallback || DefaultErrorFallback;
            return (
                <FallbackComponent
                    error={this.state.error}
                    retry={() => this.setState({ hasError: false, error: undefined })}
                />
            );
        }

        return this.props.children;
    }
}

function DefaultErrorFallback({ error, retry }: { error?: Error; retry: () => void }) {
    return (
        <Card className="max-w-md mx-auto mt-8">
            <CardHeader className="text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <CardTitle className="text-destructive">Erro ao Carregar Empresa</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                    {error?.message || 'Ocorreu um erro inesperado ao carregar os dados da empresa.'}
                </p>
                <Button onClick={retry} variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tentar Novamente
                </Button>
            </CardContent>
        </Card>
    );
}