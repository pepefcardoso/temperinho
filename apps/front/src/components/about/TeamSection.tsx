import type { TeamMember } from '@/types/about';
import Image from 'next/image';

function TeamMemberCard({ member }: { member: TeamMember }) {
    return (
        <div className="text-center bg-card p-6 rounded-xl border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6">
                <Image
                    src={member.image}
                    alt={`Foto de ${member.name}`}
                    fill
                    className="object-cover rounded-full shadow-lg"
                    sizes="(max-width: 768px) 128px, 160px"
                />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
            <p className="text-primary font-medium mb-3">{member.role}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
        </div>
    );
}

export function TeamSection({ teamMembers }: { teamMembers: TeamMember[] }) {
    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Nossa Equipe</h2>
                    <p className="text-muted-foreground">Conheça as pessoas apaixonadas que tornam nossa missão possível.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {teamMembers.map((member) => (
                        <TeamMemberCard key={member.id} member={member} />
                    ))}
                </div>
            </div>
        </section>
    );
}