import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTestimonials } from "@/lib/api/marketing";
import { Testimonial } from "@/types/marketing";

export const Testimonials = () => {
    const testimonialsData = getTestimonials();

    return (
        <div className="w-full max-w-4xl mx-auto py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonialsData.testimonials.map((testimonial: Testimonial, index: number) => (
                    <figure
                        key={index}
                        className="p-6 bg-card/50 backdrop-blur-sm rounded-lg shadow-sm border border-border/20 text-left"
                    >
                        <blockquote className="text-muted-foreground italic">
                            <p>&quot;{testimonial.quote}&quot;</p>
                        </blockquote>
                        <figcaption className="flex items-center gap-4 mt-4">
                            <Avatar>
                                <AvatarImage src={testimonial.avatarUrl} alt={testimonial.author} />
                                <AvatarFallback>
                                    {testimonial.author.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <cite className="font-semibold text-foreground not-italic">
                                    {testimonial.author}
                                </cite>
                                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                            </div>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </div>
    );
};