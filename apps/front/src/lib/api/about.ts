import { teamMembers, ourValues } from '@/lib/data/about';
import type { TeamMember, ValueCard } from '@/types/about';

export function getAboutPageData(): {
  team: TeamMember[];
  values: ValueCard[];
  pageContent: {
    heroTitle: string;
    heroSubtitle: string;
    mission: string;
    vision: string;
    imageUrl: string;
    ctaTitle: string;
    ctaSubtitle: string;
  };
} {
  return {
    team: teamMembers,
    values: ourValues,
    pageContent: {
      heroTitle: 'Nossa História',
      heroSubtitle:
        'Nascemos da paixão por criar uma culinária verdadeiramente inclusiva, onde cada pessoa pode encontrar receitas deliciosas que atendem às suas necessidades alimentares.',
      mission:
        'Nossa missão é democratizar o acesso a receitas inclusivas, promovendo uma alimentação saudável e saborosa para todos.',
      vision:
        'Acreditamos que a culinária inclusiva pode transformar vidas, unindo pessoas através de refeições que respeitam suas necessidades e preferências alimentares.',
      imageUrl: '/images/about/mission.jpg',
      ctaTitle: 'Faça Parte da Nossa Comunidade',
      ctaSubtitle:
        'Junte-se a milhares de pessoas que já descobriram como a culinária inclusiva pode transformar a experiência de cozinhar e compartilhar refeições.',
    },
  };
}
