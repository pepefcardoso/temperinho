'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Camera,
  Save,
  Loader2,
  Edit,
  User as UserIcon,
  Eye,
  EyeOff,
} from 'lucide-react';
import axios from 'axios';
import type { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateUserProfile } from '@/lib/api/user';
import { profileSchema } from '@/lib/schemas/user';

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserProfileFormProps {
  user: User;
}

export function UserProfileForm({ user }: UserProfileFormProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(
    user.image?.url ?? null
  );
  const [showPassword, setShowPassword] = React.useState(false);

  const editButtonRef = React.useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      phone: user.phone || '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.phone) formData.append('phone', data.phone);
    if (avatarFile) formData.append('image', avatarFile);
    if (data.password) {
      formData.append('password', data.password);
      formData.append('password_confirmation', data.confirmPassword || '');
    }

    try {
      const updatedUser = await updateUserProfile(user.id, formData);
      toast.success('Perfil atualizado com sucesso!');
      reset({
        name: updatedUser.name,
        phone: updatedUser.phone,
        password: '',
        confirmPassword: '',
      });
      setAvatarPreview(updatedUser.image?.url ?? avatarPreview);
      setAvatarFile(null);
      setIsEditing(false);
      editButtonRef.current?.focus();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.message || 'Falha ao atualizar o perfil.'
        );
      } else {
        toast.error('Ocorreu um erro desconhecido.');
      }
    }
  };

  const handleCancel = () => {
    reset({
      name: user.name,
      phone: user.phone,
      password: '',
      confirmPassword: '',
    });
    setAvatarPreview(user.image?.url ?? null);
    setAvatarFile(null);
    setIsEditing(false);
    editButtonRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground mb-1'>
            Meu Perfil
          </h1>
          <p className='text-muted-foreground'>
            Gerencie suas informações pessoais.
          </p>
        </div>
        <div className='flex gap-2'>
          {isEditing ? (
            <>
              <Button
                type='button'
                variant='ghost'
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <Save className='h-4 w-4 mr-2' />
                )}
                Salvar Alterações
              </Button>
            </>
          ) : (
            <Button
              type='button'
              onClick={() => setIsEditing(true)}
              ref={editButtonRef}
            >
              <Edit className='h-4 w-4 mr-2' />
              Editar Perfil
            </Button>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
        <div className='space-y-6 lg:sticky lg:top-24'>
          <Card>
            <CardHeader>
              <CardTitle>Foto do Perfil</CardTitle>
            </CardHeader>
            <CardContent className='text-center space-y-4'>
              <div className='relative inline-block'>
                <Avatar className='w-32 h-32 text-muted-foreground'>
                  <AvatarImage
                    src={avatarPreview ?? undefined}
                    alt={`Foto de ${user.name}`}
                  />
                  <AvatarFallback className='text-4xl'>
                    <UserIcon />
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Label
                    htmlFor='avatar-upload'
                    className='absolute bottom-1 right-1 cursor-pointer'
                    aria-label='Alterar foto do perfil'
                  >
                    <div className='grid place-items-center h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90'>
                      <Camera className='h-4 w-4' />
                    </div>
                    <Input
                      id='avatar-upload'
                      type='file'
                      className='sr-only'
                      accept='image/*'
                      onChange={handleAvatarChange}
                    />
                  </Label>
                )}
              </div>
              <div>
                <h3 className='font-semibold text-lg text-foreground'>
                  {user.name}
                </h3>
                <p className='text-sm text-muted-foreground'>{user.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <Label htmlFor='name'>Nome Completo</Label>
                  <Input
                    id='name'
                    {...register('name')}
                    disabled={!isEditing}
                    className='mt-1'
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className='text-sm text-destructive mt-1' role='alert'>
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    value={user.email}
                    type='email'
                    disabled
                    className='mt-1 bg-muted/50'
                  />
                </div>
              </div>
              <div>
                <Label htmlFor='phone'>Telefone</Label>
                <Input
                  id='phone'
                  {...register('phone')}
                  disabled={!isEditing}
                  className='mt-1'
                  placeholder='(XX) XXXXX-XXXX'
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p className='text-sm text-destructive mt-1' role='alert'>
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <Label htmlFor='password'>Nova Senha</Label>
                    <div className='relative'>
                      <Input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        className='mt-1 pr-10'
                        placeholder='Mínimo 8 caracteres'
                        aria-invalid={!!errors.password}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? 'Esconder senha' : 'Mostrar senha'
                        }
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4 text-muted-foreground' />
                        ) : (
                          <Eye className='h-4 w-4 text-muted-foreground' />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className='text-sm text-destructive mt-1' role='alert'>
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor='confirmPassword'>
                      Confirmar Nova Senha
                    </Label>
                    <Input
                      id='confirmPassword'
                      type={showPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      className='mt-1'
                      aria-invalid={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword && (
                      <p className='text-sm text-destructive mt-1' role='alert'>
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </form>
  );
}
