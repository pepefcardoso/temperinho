'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useForm,
  Controller,
  UseFormRegister,
  FieldErrors,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, User, Loader2, Calendar } from 'lucide-react';
import { isAxiosError } from 'axios';
import { createAccountSchema } from '@/lib/schemas/auth';

type CreateAccountFormData = z.infer<typeof createAccountSchema>;

interface PasswordFieldProps {
  id: 'password' | 'confirmPassword';
  label: string;
  placeholder: string;
  register: UseFormRegister<CreateAccountFormData>;
  errors: FieldErrors<CreateAccountFormData>;
}

function PasswordField({
  id,
  label,
  placeholder,
  register,
  errors,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const error = errors[id];

  return (
    <div className='space-y-2'>
      <Label htmlFor={id}>{label}</Label>
      <div className='relative'>
        <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-500 h-4 w-4' />
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          {...register(id)}
          className='pl-10 pr-10'
          aria-invalid={!!error}
        />
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
        >
          {showPassword ? (
            <EyeOff className='h-4 w-4 text-warm-500' />
          ) : (
            <Eye className='h-4 w-4 text-warm-500' />
          )}
        </Button>
      </div>
      {error && (
        <p className='text-sm text-destructive mt-1' role='alert'>
          {error.message}
        </p>
      )}
    </div>
  );
}

export default function CreateAccountPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: '',
      email: '',
      birthday: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: CreateAccountFormData) => {
    try {
      const { confirmPassword, ...submissionData } = data;
      await registerUser({
        ...submissionData,
        password_confirmation: confirmPassword,
      });

      toast.success('Conta criada com sucesso! Redirecionando...');
      router.push('/usuario/dashboard');
    } catch (error) {
      let errorMessage = 'Não foi possível criar a conta. Tente novamente.';
      if (isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className='min-h-screen bg-background flex items-center justify-center py-12 px-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center text-warm-900'>
            Criar sua conta
          </CardTitle>
          <p className='text-center text-warm-600'>
            Preencha os dados abaixo para criar sua conta
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Nome completo</Label>
              <div className='relative'>
                <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-500 h-4 w-4' />
                <Input
                  id='name'
                  type='text'
                  placeholder='Seu nome completo'
                  {...register('name')}
                  className='pl-10'
                  aria-invalid={!!errors.name}
                />
              </div>
              {errors.name && (
                <p className='text-sm text-destructive mt-1' role='alert'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-500 h-4 w-4' />
                <Input
                  id='email'
                  type='email'
                  placeholder='seu@email.com'
                  {...register('email')}
                  className='pl-10'
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p className='text-sm text-destructive mt-1' role='alert'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='birthday'>Data de nascimento</Label>
              <div className='relative'>
                <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-500 h-4 w-4' />
                <Input
                  id='birthday'
                  type='date'
                  {...register('birthday')}
                  className='pl-10'
                  aria-invalid={!!errors.birthday}
                />
              </div>
              {errors.birthday && (
                <p className='text-sm text-destructive mt-1' role='alert'>
                  {errors.birthday.message}
                </p>
              )}
            </div>

            <PasswordField
              id='password'
              label='Senha'
              placeholder='Senha forte'
              register={register}
              errors={errors}
            />
            <PasswordField
              id='confirmPassword'
              label='Confirmar senha'
              placeholder='Confirme sua senha'
              register={register}
              errors={errors}
            />

            <div className='flex items-start space-x-2'>
              <Controller
                name='acceptTerms'
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id='terms'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className='mt-1'
                    aria-invalid={!!errors.acceptTerms}
                  />
                )}
              />
              <div className='grid gap-1.5 leading-none'>
                <Label
                  htmlFor='terms'
                  className='text-sm text-warm-700 font-medium'
                >
                  Aceito os{' '}
                  <Link
                    href='/termos'
                    className='text-sage-600 hover:text-sage-700 underline'
                  >
                    termos de uso
                  </Link>
                </Label>
                {errors.acceptTerms && (
                  <p className='text-sm text-destructive' role='alert'>
                    {errors.acceptTerms.message}
                  </p>
                )}
              </div>
            </div>

            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
              )}
              {isSubmitting ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-warm-600'>
              Já tem uma conta?{' '}
              <Link
                href='/auth/login'
                className='text-sage-600 hover:text-sage-700 font-medium underline'
              >
                Fazer login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}