import type { TeamMember, ValueCard } from '@/types/about';
import { Heart, Leaf, ShieldCheck, Users } from 'lucide-react';

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Pedro Paulo',
    role: 'Analista de Software e Fundador',
    bio: 'Com uma paixão por tecnologia e alimentação saudável, Pedro fundou o Leve Sabor para compartilhar receitas que unem sabor e saúde. Ele é o cérebro por trás do desenvolvimento do site e da experiência do usuário.',
    image: '/images/team/pedro-paulo.jpg',
  },
  {
    id: 2,
    name: 'Julia Luciano',
    role: 'Farmacêutica e Co-Fundadora',
    bio: 'Julia traz sua expertise em farmacologia para garantir que todas as receitas sejam não apenas deliciosas, mas também seguras e saudáveis. Ela é a responsável pela curadoria de receitas e pela validação nutricional.',
    image: '/images/team/julia-luciano.jpg',
  },
];

export const ourValues: ValueCard[] = [
  {
    icon: Leaf,
    title: 'Sabor Incomparável',
    description:
      'Acreditamos que comida saudável não precisa ser sem graça. Cada receita é criada para ser uma explosão de sabores.',
  },
  {
    icon: Heart,
    title: 'Inclusão na Cozinha',
    description:
      'Nossa missão é garantir que todos, independentemente de suas restrições alimentares, possam desfrutar de pratos deliciosos.',
  },
  {
    icon: ShieldCheck,
    title: 'Confiança e Saúde',
    description:
      'Todas as nossas receitas são revisadas por nutricionistas para garantir que sejam seguras, balanceadas e nutritivas.',
  },
  {
    icon: Users,
    title: 'Comunidade Forte',
    description:
      'Somos um espaço para compartilhar, aprender e crescer juntos, unidos pela paixão por uma alimentação consciente e feliz.',
  },
];
