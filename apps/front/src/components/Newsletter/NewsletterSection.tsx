'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { subscribeToNewsletter } from '@/lib/api/customer';
import axios from 'axios';
import { newsletterSchema } from '@/lib/schemas/marketing';

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export default function NewsletterSection() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      await subscribeToNewsletter(data.email);
      toast.success('Inscrição realizada com sucesso! 🎉');
      reset();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        toast.error('Este e-mail já está cadastrado.');
      } else {
        toast.error('Ocorreu um erro. Por favor, tente novamente.');
      }
      console.error(error);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-sage-600 to-sage-700">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
          Junte-se à Nossa Comunidade
        </h2>
        <p className="text-xl text-sage-100 mb-8 max-w-2xl mx-auto">
          Receba receitas exclusivas, dicas de substituições e novidades direto no seu email.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <div className="flex-1 flex flex-col">
            <Input
              {...register('email')}
              type="email"
              placeholder="Digite seu email"
              disabled={isSubmitting}
              required
              className="px-4 py-3 rounded-xl border-0 text-warm-900 placeholder-warm-500 focus:ring-2 focus:ring-white focus:outline-none"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-2 text-left">{errors.email.message}</p>
            )}
          </div>
          <Button type="submit" size="lg" disabled={isSubmitting} className="bg-sunset-500 hover:bg-sunset-600 text-white font-medium whitespace-nowrap">
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Assinar Grátis
          </Button>
        </form>

        <p className="text-sage-200 text-sm mt-4">
          Ao assinar, você concorda com nossa{' '}
          <Link href="/privacidade" className="underline hover:text-white transition-colors">
            Política de Privacidade
          </Link>.
          Sem spam, cancele a qualquer momento.
        </p>
      </div>
    </section>
  );
}