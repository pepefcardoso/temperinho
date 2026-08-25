import { MetadataRoute } from 'next';
import { Post } from '@/types/blog';
import { Recipe } from '@/types/recipe';
import { getRecipes } from '@/lib/api/recipe';
import { getPosts } from '@/lib/api/blog';

/**
 * Gera o sitemap dinâmico para o site.
 *
 * Esta função é executada pelo Next.js para criar o arquivo sitemap.xml.
 * Ela tenta buscar todos os posts de blog e receitas para incluir URLs dinâmicas.
 * Se a API falhar, ela continua e gera o sitemap apenas com as páginas estáticas.
 *
 * @returns {Promise<MetadataRoute.Sitemap>}
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/receitas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre-nos`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  try {
    const [allRecipes, allPosts] = await Promise.all([
      getRecipes({ limit: 1000 }),
      getPosts({ limit: 1000 }),
    ]);

    const recipeUrls = (allRecipes.data || []).map((recipe: Recipe) => ({
      url: `${baseUrl}/receitas/${recipe.id}`,
      lastModified: new Date(recipe.updated_at || recipe.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const blogUrls = (allPosts.data || []).map((post: Post) => ({
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: new Date(post.updated_at || post.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    return [...staticUrls, ...recipeUrls, ...blogUrls];
  } catch (error) {
    console.error('Erro ao buscar dados para o sitemap:', error);
    return staticUrls;
  }
}
