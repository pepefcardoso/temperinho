'use client';

import React from 'react';
import { useForm, Controller, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Save, Loader2, Upload, X } from 'lucide-react';
import { cva } from 'class-variance-authority';
import axios from 'axios';
import type { Post, PostCategory, PostTopic } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  getPostCategories,
  getPostTopics,
  createPost,
  updatePost,
} from '@/lib/api/blog';
import { articleSchema } from '@/lib/schemas/article';

type ArticleFormData = z.infer<typeof articleSchema>;

function ArticleMetadataSection({
  form,
  categories,
}: {
  form: UseFormReturn<ArticleFormData>;
  categories: PostCategory[];
}) {
  const {
    register,
    control,
    formState: { errors },
  } = form;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div>
          <Label htmlFor='title'>Título do Artigo *</Label>
          <Input
            id='title'
            {...register('title')}
            placeholder='Ex: 5 Dicas para um Café da Manhã Vegano'
            className='mt-1'
          />
          {errors.title && (
            <p className='text-sm text-destructive mt-1'>
              {errors.title.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor='summary'>Resumo (máx. 255 caracteres) *</Label>
          <Textarea
            id='summary'
            {...register('summary')}
            placeholder='Escreva um resumo atrativo...'
            className='mt-1 min-h-20'
            maxLength={255}
          />
          {errors.summary && (
            <p className='text-sm text-destructive mt-1'>
              {errors.summary.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor='category_id'>Categoria *</Label>
          <Controller
            name='category_id'
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={String(field.value || '')}
              >
                <SelectTrigger id='category_id' className='mt-1'>
                  <SelectValue placeholder='Selecione uma categoria' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category_id && (
            <p className='text-sm text-destructive mt-1'>
              {errors.category_id.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const tagButtonVariants = cva(
  'px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer',
  {
    variants: {
      selected: {
        true: 'bg-primary text-primary-foreground border-primary',
        false: 'bg-muted text-muted-foreground border-border hover:bg-accent',
      },
    },
  }
);

function ArticleTopicsSection({
  form,
  topics,
}: {
  form: UseFormReturn<ArticleFormData>;
  topics: PostTopic[];
}) {
  const {
    control,
    formState: { errors },
  } = form;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tópicos do Artigo</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground mb-3'>
          Selecione de 1 a 5 tópicos.
        </p>
        <Controller
          name='topics'
          control={control}
          render={({ field }) => (
            <div className='flex flex-wrap gap-2'>
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  type='button'
                  onClick={() => {
                    const val = field.value || [];
                    const newVal = val.includes(topic.id)
                      ? val.filter((id) => id !== topic.id)
                      : [...val, topic.id];
                    field.onChange(newVal);
                  }}
                  className={cn(
                    tagButtonVariants({
                      selected: field.value?.includes(topic.id),
                    })
                  )}
                >
                  {topic.name}
                </button>
              ))}
            </div>
          )}
        />
        {errors.topics && (
          <p className='text-sm text-destructive mt-2'>
            {errors.topics.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ArticleImageSection({
  imagePreview,
  onImageChange,
  onImageRemove,
}: {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
}) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Imagem de Capa</CardTitle>
        {imagePreview && (
          <Button variant='ghost' size='sm' onClick={onImageRemove}>
            <X className='h-4 w-4 mr-2' />
            Remover
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Label htmlFor='image-upload' className='cursor-pointer group'>
          <div className='relative border-2 border-dashed border-border rounded-lg p-4 text-center text-muted-foreground transition-colors group-hover:border-primary'>
            {imagePreview ? (
              <div className='relative w-full aspect-video'>
                <Image
                  src={imagePreview}
                  alt='Preview'
                  fill
                  className='object-cover rounded-md'
                  sizes='(max-width: 768px) 100vw, 50vw'
                />
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center gap-2 h-48'>
                <Upload className='h-10 w-10' />
                <p className='font-semibold'>Clique para fazer upload</p>
                <p className='text-xs'>JPG, PNG, WebP (máx 2MB)</p>
              </div>
            )}
          </div>
        </Label>
        <Input
          id='image-upload'
          type='file'
          accept='image/*'
          className='sr-only'
          onChange={onImageChange}
        />
      </CardContent>
    </Card>
  );
}

interface ArticleFormProps {
  initialData?: Post;
  action: 'create' | 'update';
}

export function ArticleForm({ initialData, action }: ArticleFormProps) {
  const router = useRouter();

  const [categories, setCategories] = React.useState<PostCategory[]>([]);
  const [topics, setTopics] = React.useState<PostTopic[]>([]);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    initialData?.image?.url || null
  );

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData?.title || '',
      summary: initialData?.summary || '',
      content: initialData?.content || '',
      category_id: initialData?.category?.id,
      topics: initialData?.topics?.map((t) => t.id) || [],
    },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, tops] = await Promise.all([
          getPostCategories({limit: 100}),
          getPostTopics({limit: 100}),
        ]);
        setCategories(cats);
        setTopics(tops);
      } catch (error) {
        console.error('Erro ao carregar categorias e tópicos:', error);
        toast.error('Falha ao carregar dados do formulário.');
      }
    };
    fetchData();
  }, []);

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
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data: ArticleFormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('summary', data.summary);
    formData.append('content', data.content);
    formData.append('category_id', String(data.category_id));
    data.topics.forEach((id) => formData.append('topics[]', String(id)));

    if (imageFile) formData.append('image', imageFile);

    try {
      if (action === 'create') {
        await createPost(formData);
        toast.success('Artigo criado com sucesso!');
      } else if (initialData?.id) {
        await updatePost(initialData.id, formData);
        toast.success('Artigo atualizado com sucesso!');
      }

      router.push('/usuario/artigos');
      router.refresh();
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : 'Ocorreu um erro ao processar o artigo.';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <ArticleMetadataSection form={form} categories={categories} />
      <ArticleTopicsSection form={form} topics={topics} />
      <ArticleImageSection
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        onImageRemove={handleImageRemove}
      />

      <Card>
        <CardHeader>
          <CardTitle>Conteúdo do Artigo</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            {...form.register('content')}
            placeholder='Escreva o conteúdo completo...'
            className='min-h-96'
          />
          {form.formState.errors.content && (
            <p className='text-sm text-destructive mt-1'>
              {form.formState.errors.content.message}
            </p>
          )}
        </CardContent>
      </Card>

      <div className='flex justify-end gap-4'>
        <Button
          type='button'
          variant='outline'
          onClick={() => router.back()}
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
          {action === 'create' ? 'Publicar Artigo' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
}
