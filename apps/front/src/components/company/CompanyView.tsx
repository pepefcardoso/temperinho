'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, MapPin, Phone, Mail, Globe, Building, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { Company } from '@/types/company';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { CompanyForm } from './CompanyForm';
import { deleteCompany } from '@/lib/api/company';

interface CompanyViewProps {
    company: Company;
}

export function CompanyView({ company }: CompanyViewProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteCompany(company.id);
            toast.success('Empresa excluída com sucesso!');
            router.refresh();
        } catch (error) {
            toast.error('Falha ao excluir empresa. Tente novamente.');
            console.error('Erro ao excluir empresa:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditSuccess = () => {
        setIsEditing(false);
        router.refresh();
    };

    if (isEditing) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Editar Empresa</h2>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancelar
                    </Button>
                </div>
                <CompanyForm 
                    action="update" 
                    initialData={company}
                    onSuccess={handleEditSuccess}
                />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Company Profile Card */}
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader className="text-center">
                        <div className="relative mx-auto w-32 h-32 mb-4">
                            <Image
                                src={company.image?.url || '/images/company-placeholder.png'}
                                alt={`Logo da ${company.name}`}
                                fill
                                className="object-cover rounded-lg"
                                sizes="128px"
                            />
                        </div>
                        <CardTitle className="text-xl">{company.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            CNPJ: {company.cnpj}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{company.email}</span>
                        </div>
                        {company.phone && (
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{company.phone}</span>
                            </div>
                        )}
                        {company.address && (
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{company.address}</span>
                            </div>
                        )}
                        {company.website && (
                            <div className="flex items-center gap-3">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <Link 
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline"
                                >
                                    {company.website}
                                </Link>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                                Cadastrada em {format(new Date(company.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Company Details and Actions */}
            <div className="lg:col-span-2 space-y-6">
                {/* Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ações</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            <Button onClick={() => setIsEditing(true)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar Informações
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Excluir Empresa
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta ação não pode ser desfeita. Isso irá excluir permanentemente
                                            sua empresa e todos os dados associados.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            {isDeleting ? 'Excluindo...' : 'Sim, excluir'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>

                {/* Subscriptions */}
                {company.subscriptions && company.subscriptions.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Assinaturas Ativas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {company.subscriptions.map((subscription) => (
                                    <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Building className="h-4 w-4" />
                                                <span className="font-medium">Assinatura #{subscription.id}</span>
                                                <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                                                    {subscription.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Válida até {format(new Date(subscription.ends_at), "dd/MM/yyyy", { locale: ptBR })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informações da Conta</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="p-4 border rounded-lg">
                                <p className="text-2xl font-bold text-primary">#{company.id}</p>
                                <p className="text-sm text-muted-foreground">ID da Empresa</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <p className="text-2xl font-bold text-primary">{company.subscriptions?.length || 0}</p>
                                <p className="text-sm text-muted-foreground">Assinaturas</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <p className="text-2xl font-bold text-primary">
                                    {format(new Date(company.created_at), "MMM/yyyy", { locale: ptBR })}
                                </p>
                                <p className="text-sm text-muted-foreground">Membro desde</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}