'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { forgotPassword } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { isAxiosError } from 'axios';
import { forgotPasswordSchema } from '@/lib/schemas/auth';

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface EmailSentViewProps {
  email: string;
  onReset: () => void;
}

function EmailSentView({ email, onReset }: EmailSentViewProps) {
  return (
    <Card className='w-full max-w-md'>
      <CardContent className='pt-6'>
        <div className='text-center space-y-4'>
          <div className='mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
            <CheckCircle className='h-6 w-6 text-green-600' />
          </div>
          <div className='space-y-2'>
            <h2 className='text-2xl font-bold text-warm-900'>Email enviado!</h2>
            <p className='text-warm-600'>
              Enviamos um link de recuperação de senha para
            </p>
            <p className='font-medium text-warm-800'>{email}</p>
          </div>
          <div className='space-y-4 pt-4'>
            <p className='text-sm text-warm-600'>
              Verifique sua caixa de entrada e spam. O link expira em breve.
            </p>
            <div className='space-y-2'>
              <Button onClick={onReset} variant='outline' className='w-full'>
                Tentar com outro email
              </Button>
              <Button variant='ghost' className='w-full' asChild>
                <Link href='/auth/login'>
                  <ArrowLeft className='h-4 w-4 mr-2' />
                  Voltar ao login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setEmailSent(true);
      reset();
    } catch (error) {
      let errorMessage = 'Não foi possível enviar o email. Tente novamente.';
      if (isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className='min-h-screen bg-background flex items-center justify-center py-12 px-4'>
      {emailSent ? (
        <EmailSentView
          email={submittedEmail}
          onReset={() => setEmailSent(false)}
        />
      ) : (
        <Card className='w-full max-w-md'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl font-bold text-center text-warm-900'>
              Esqueceu sua senha?
            </CardTitle>
            <p className='text-center text-warm-600'>
              Digite seu email e enviaremos um link para redefinir sua senha.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
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

              <Button type='submit' className='w-full' disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                )}
                {isSubmitting ? 'Enviando...' : 'Enviar link de recuperação'}
              </Button>
            </form>
            <div className='mt-6 text-center'>
              <Link
                href='/auth/login'
                className='inline-flex items-center text-sage-600 hover:text-sage-700 font-medium'
              >
                <ArrowLeft className='h-4 w-4 mr-2' />
                Voltar ao login
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
