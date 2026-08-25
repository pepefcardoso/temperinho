// src/app/robots.ts

import { MetadataRoute } from 'next';

/**
 * Gera o arquivo robots.txt para o site.
 *
 * Este arquivo instrui os robôs de busca sobre quais páginas eles podem
 * ou não rastrear. Também informa a localização do sitemap.
 *
 * @returns {MetadataRoute.Robots}
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/usuario/', '/auth/'],
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
