'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Save, Loader2, Upload, X, Building } from 'lucide-react';
import axios from 'axios';
import type { Company } from '@/types/company';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createCompany, updateCompany } from '@/lib/api/company';
import { companySchema } from '@/lib/schemas/companySchema';

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormProps {
    initialData?: Company;
    action: 'create' | 'update';
    onSuccess?: () => void;
}

export function CompanyForm({
    initialData,
    action,
    onSuccess,
}: CompanyFormProps) {
    const router = useRouter();
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(
        initialData?.image?.url || null
    );

    const form = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: initialData?.name || '',
            cnpj: initialData?.cnpj || '',
            email: initialData?.email || '',
            phone: initialData?.phone || '',
            address: initialData?.address || '',
            website: initialData?.website || '',
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = form;

    const { onChange: onCnpjChange, ...cnpjProps } = register('cnpj');

    React.useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
            if (file.size > MAX_FILE_SIZE) {
                toast.error('O arquivo é muito grande. O tamanho máximo é 2MB.');
                e.target.value = '';
                return;
            }

            const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
            if (!ALLOWED_TYPES.includes(file.type)) {
                toast.error('Tipo de arquivo inválido. Apenas JPG, PNG, SVG ou WebP são permitidos.');
                e.target.value = '';
                return;
            }

            setImageFile(file);
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleImageRemove = () => {
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(null);
        setImagePreview(null);
    };

    const onSubmit = async (data: CompanyFormData) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('address', data.address);
        formData.append('website', data.website);
        if (data.cnpj) formData.append('cnpj', data.cnpj);
        if (imageFile) formData.append('image', imageFile);

        try {
            if (action === 'create') {
                await createCompany(formData);
                toast.success('Empresa cadastrada com sucesso!');
                router.push('/usuario/empresa');
                router.refresh();
            } else if (initialData?.id) {
                await updateCompany(initialData.id, formData);
                toast.success('Empresa atualizada com sucesso!');
                onSuccess?.();
            }
        } catch (error) {
            const message =
                axios.isAxiosError(error) && error.response
                    ? error.response.data.message
                    : 'Ocorreu um erro ao processar os dados da empresa.';
            toast.error(message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Logo da Empresa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center">
                                <div className="relative mx-auto w-32 h-32 mb-4">
                                    {imagePreview ? (
                                        <Image
                                            src={imagePreview}
                                            alt="Preview do logo"
                                            fill
                                            className="object-cover rounded-lg"
                                            sizes="128px"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                                            <Building className="h-12 w-12 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 justify-center">
                                    <Label htmlFor="logo-upload" className="cursor-pointer">
                                        <Button type="button" size="sm" asChild>
                                            <span>
                                                <Upload className="h-4 w-4 mr-2" />
                                                {imagePreview ? 'Alterar' : 'Upload'}
                                            </span>
                                        </Button>
                                    </Label>
                                    {imagePreview && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleImageRemove}
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Remover
                                        </Button>
                                    )}
                                </div>
                                <Input
                                    id="logo-upload"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handleImageChange}
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    JPG, PNG, SVG, WebP (máx 2MB)
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Básicas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Nome da Empresa *</Label>
                                    <Input
                                        id="name"
                                        {...register('name')}
                                        placeholder="Ex: Restaurante Temperinho Ltda"
                                        className="mt-1"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive mt-1">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="cnpj">CNPJ</Label>
                                    <Input
                                        id="cnpj"
                                        {...cnpjProps}
                                        onChange={(e) => {
                                            const onlyNumbers = e.target.value.replace(/\D/g, '');
                                            e.target.value = onlyNumbers;
                                            onCnpjChange(e);
                                        }}
                                        placeholder="Somente números"
                                        className="mt-1"
                                        maxLength={14}
                                    />
                                    {errors.cnpj && (
                                        <p className="text-sm text-destructive mt-1">
                                            {errors.cnpj.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register('email')}
                                        placeholder="contato@empresa.com"
                                        className="mt-1"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="phone">Telefone *</Label>
                                    <Input
                                        id="phone"
                                        {...register('phone')}
                                        placeholder="(00) 00000-0000"
                                        className="mt-1"
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-destructive mt-1">
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="address">Endereço *</Label>
                                <Input
                                    id="address"
                                    {...register('address')}
                                    placeholder="Rua, número, bairro, cidade - UF"
                                    className="mt-1"
                                />
                                {errors.address && (
                                    <p className="text-sm text-destructive mt-1">
                                        {errors.address.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="website">Website *</Label>
                                <Input
                                    id="website"
                                    type="url"
                                    {...register('website')}
                                    placeholder="https://www.empresa.com"
                                    className="mt-1"
                                />
                                {errors.website && (
                                    <p className="text-sm text-destructive mt-1">
                                        {errors.website.message}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        if (action === 'create') {
                            router.back();
                        } else {
                            onSuccess?.();
                        }
                    }}
                    disabled={isSubmitting}
                >
                    Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    {action === 'create' ? 'Cadastrar Empresa' : 'Salvar Alterações'}
                </Button>
            </div>
        </form>
    );
}