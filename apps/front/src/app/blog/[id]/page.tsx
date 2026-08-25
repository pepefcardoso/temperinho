import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPostById } from '@/lib/api/blog';
import type { Metadata } from 'next';
import AdBanner from '@/components/marketing/AdBanner';
import { BlogPostHeader } from '@/components/blog/BlogPostHeader';
import { CommentsSection } from '@/components/comments/CommentsSection';
import MarketingSection from '@/components/marketing/MarketingSection';

type BlogPostPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  props: BlogPostPageProps
): Promise<Metadata> {
  const { id } = await props.params;
  const postId = parseInt(id, 10);

  if (isNaN(postId) || postId <= 0) {
    return {
      title: 'Artigo não encontrado | Temperinho',
      description: 'O artigo solicitado não foi encontrado',
    };
  }

  try {
    const article = await getPostById(postId);
    return {
      title: `${article.title} | Temperinho`,
      description: article.summary,
      openGraph: {
        title: article.title,
        description: article.summary,
        images: [
          {
            url: article.image?.url ?? '/images/placeholder.svg',
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  } catch (error) {
    console.error(`Erro ao gerar metadados para ID ${postId}:`, error);
    return {
      title: 'Artigo não encontrado | Temperinho',
      description: 'O artigo solicitado não foi encontrado',
    };
  }
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const { id } = await props.params;
  const postId = parseInt(id, 10);

  if (isNaN(postId) || postId <= 0) {
    notFound();
  }

  try {
    const article = await getPostById(postId);
    const wordCount = article.content?.trim().split(/\s+/).length ?? 0;
    const readTimeInMinutes = Math.ceil(wordCount / 200);

    return (
      <main>
        <section className='py-8 bg-card'>
          <BlogPostHeader article={article} readTime={readTimeInMinutes} />

          <div className='container mx-auto px-4 max-w-4xl'>
            <div className='relative w-full aspect-video mb-8'>
              <Image
                src={article.image?.url ?? '/images/placeholder.svg'}
                alt={article.title}
                fill
                className='object-cover rounded-xl shadow-lg'
                sizes='(max-width: 1024px) 100vw, 896px'
                priority
              />
            </div>
            <AdBanner
              href='/marketing'
              layout='full'
              size='large'
              className='mb-8'
            />
          </div>
        </section>

        <section className='py-8 bg-background'>
          <div className='container mx-auto px-4 max-w-4xl'>
            <div className='flex flex-col lg:flex-row gap-8 lg:gap-12'>
              <article className='prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-p:text-muted-foreground prose-strong:text-foreground'>
                <p className='whitespace-pre-wrap'>{article.content ?? ''}</p>
              </article>
              <aside className='w-full lg:w-80 lg:sticky top-24 self-start space-y-6'>
                <AdBanner href='/marketing' layout='sidebar' />
              </aside>
            </div>
          </div>
        </section>

        <CommentsSection type='posts' id={postId} />

        <MarketingSection
          adBannerHref="/marketing"
          adBannerImageUrl=""
          adBannerAltText="Anuncie conosco e conecte-se com nossa comunidade"
          googleAdSlot={process.env.NEXT_PUBLIC_GOOGLE_AD_SLOT_BLOG_DETAILS || ''}
        />
      </main>
    );
  } catch (error) {
    console.error(`Falha ao buscar artigo ID ${postId}:`, error);
    notFound();
  }
}
