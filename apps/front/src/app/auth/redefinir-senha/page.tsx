'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { resetPassword } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { isAxiosError } from 'axios';
import { resetPasswordSchema } from '@/lib/schemas/auth';

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token || !email) {
      toast.error('Link inválido ou expirado. Por favor, solicite um novo.');
      return;
    }

    try {
      await resetPassword({
        token,
        email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });

      setPasswordReset(true);
    } catch (error) {
      let errorMessage = 'Não foi possível redefinir a senha.';
      if (isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  if (passwordReset) {
    return (
      <Card className='w-full max-w-md'>
        <CardContent className='pt-6'>
          <div className='text-center space-y-4'>
            <div className='mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
              <CheckCircle className='h-6 w-6 text-green-600' />
            </div>
            <div className='space-y-2'>
              <h2 className='text-2xl font-bold text-warm-900'>
                Senha redefinida!
              </h2>
              <p className='text-warm-600'>
                Sua senha foi redefinida com sucesso. Agora você pode fazer
                login com sua nova senha.
              </p>
            </div>
            <div className='pt-4'>
              <Button className='w-full' asChild>
                <Link href='/auth/login'>Ir para o login</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!token || !email) {
    return (
      <Card className='w-full max-w-md'>
        <CardContent className='pt-6'>
          <div className='text-center space-y-4'>
            <h2 className='text-2xl font-bold text-warm-900'>Link inválido</h2>
            <p className='text-warm-600'>
              Este link de redefinição de senha é inválido ou expirou.
            </p>
            <div className='space-y-2 pt-4'>
              <Button className='w-full' asChild>
                <Link href='/auth/esqueceu-senha'>Solicitar novo link</Link>
              </Button>
              <Button variant='outline' className='w-full' asChild>
                <Link href='/auth/login'>Voltar ao login</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold text-center text-warm-900'>
          Redefinir senha
        </CardTitle>
        <p className='text-center text-warm-600'>
          Digite sua nova senha abaixo
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='password'>Nova senha</Label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-500 h-4 w-4' />
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Mínimo 8 caracteres'
                {...register('password')}
                className='pl-10 pr-10'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4 text-warm-500' />
                ) : (
                  <Eye className='h-4 w-4 text-warm-500' />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className='text-sm text-destructive mt-1'>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Confirmar nova senha</Label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-500 h-4 w-4' />
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Confirme sua nova senha'
                {...register('confirmPassword')}
                className='pl-10 pr-10'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-4 w-4 text-warm-500' />
                ) : (
                  <Eye className='h-4 w-4 text-warm-500' />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className='text-sm text-destructive mt-1'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
            {isSubmitting ? 'Redefinindo...' : 'Redefinir senha'}
          </Button>
        </form>

        <div className='mt-6 text-center'>
          <Link
            href='/auth/login'
            className='text-sage-600 hover:text-sage-700 font-medium'
          >
            Voltar ao login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='flex items-center justify-center py-12 px-4'>
        <Suspense fallback={<div>Carregando...</div>}>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
