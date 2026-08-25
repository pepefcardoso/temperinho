'use client';

import { useRouter } from 'next/navigation';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { Separator } from '@/components/ui/separator';
import { InteractableType } from '@/lib/api/interactions';

interface CommentsSectionProps {
    type: InteractableType;
    id: number;
}

export function CommentsSection({ type, id }: CommentsSectionProps) {
    const router = useRouter();

    const handleCommentAdded = () => {

        router.refresh();
    };

    return (
        <section className="py-12 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
                <h2 className="text-3xl font-bold font-display mb-8">Comentários</h2>

                <CommentForm type={type} id={id} onCommentAdded={handleCommentAdded} />

                <Separator className="my-8" />

                <CommentList type={type} id={id} />
            </div>
        </section>
    );
}