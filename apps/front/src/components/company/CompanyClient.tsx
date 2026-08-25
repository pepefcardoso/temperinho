'use client';

import { useEffect } from 'react';
import { CompanyForm } from './CompanyForm';
import { CompanyView } from './CompanyView';
import type { Company } from '@/types/company';

interface CompanyClientProps {
    initialCompany: Company | null;
}

export function CompanyClient({ initialCompany }: CompanyClientProps) {
    useEffect(() => {
        document.title = 'Minha Empresa | Temperinho';
    }, []);

    if (!initialCompany) {
        return (
            <div className="space-y-6">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Cadastrar Empresa
                    </h1>
                    <p className="text-muted-foreground">
                        Complete o cadastro da sua empresa para começar a anunciar conosco.
                    </p>
                </div>
                <CompanyForm action="create" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1">
                        Minha Empresa
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie as informações da sua empresa.
                    </p>
                </div>
            </div>
            <CompanyView company={initialCompany} />
        </div>
    );
}