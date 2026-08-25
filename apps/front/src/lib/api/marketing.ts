import { testimonials } from '@/lib/data/marketing';
import type { Testimonial } from '@/types/marketing';

export function getMarketingData(): {
  heroImageUrl: string;
} {
  return {
    heroImageUrl: '/images/marketing-hero.jpg',
  };
}

export function getTestimonials(): {
  testimonials: Testimonial[];
} {
  return {
    testimonials: testimonials,
  };
}
