import type { Metadata } from 'next';
import { ContactForm } from '@/components/marketing/ContactForm';
import { contactInfo } from '@/lib/data/contact';
import MarketingSection from '@/components/marketing/MarketingSection';

export const metadata: Metadata = {
  title: 'Contato | Temperinho',
  description: 'Tire suas dúvidas, envie sugestões ou compartilhe sua experiência com a nossa comunidade de culinária inclusiva.',
};

export default function ContactPage() {
  return (
    <div className="bg-background">
      <main>
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Entre em Contato
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Tem uma dúvida, sugestão ou quer compartilhar sua experiência?
              Estamos aqui para ouvir você.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <ContactForm />

              <div className="space-y-8">
                <div className="bg-card rounded-xl p-6 sm:p-8 shadow-sm border border-border">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">
                    Outras Formas de Contato
                  </h2>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <info.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground mb-1">{info.title}</h3>
                          <p className="text-foreground/90 mb-1">{info.description}</p>
                          <p className="text-sm text-muted-foreground">{info.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <MarketingSection
                  adBannerHref="/marketing"
                  adBannerImageUrl=""
                  adBannerAltText="Anuncie conosco e conecte-se com nossa comunidade"
                  googleAdSlot={process.env.NEXT_PUBLIC_GOOGLE_AD_SLOT_CONTACT_US || ''}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
