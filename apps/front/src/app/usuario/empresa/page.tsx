import { getMyCompany } from '@/lib/api/company.server';
import { CompanyClient } from '@/components/company/CompanyClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CompanyPage() {
    try {
        const company = await getMyCompany();
        
        return <CompanyClient initialCompany={company} />;
    } catch (error) {
        console.error("Falha ao carregar dados da empresa no servidor:", error);

        if (error instanceof Error &&
            (error.message.includes('Token de autenticação não encontrado') ||
                error.message.includes('401') ||
                error.message.includes('403'))) {
            redirect('/auth/login?error=authentication-required');
        }

        return <CompanyClient initialCompany={null} />;
    }
}