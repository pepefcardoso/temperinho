'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
    initialRating?: number;
    totalStars?: number;
    onRating: (rating: number) => void;
    readOnly?: boolean;
}

export function StarRating({
    initialRating = 0,
    totalStars = 5,
    onRating,
    readOnly = false,
}: StarRatingProps) {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState<number | null>(null);

    const handleStarClick = (rate: number) => {
        if (readOnly) return;
        setRating(rate);
        onRating(rate);
    };

    return (
        <div className="flex items-center space-x-1">
            {[...Array(totalStars)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <label key={starValue} className={!readOnly ? 'cursor-pointer' : ''}>
                        <input
                            type="radio"
                            name="rating"
                            value={starValue}
                            className="sr-only"
                            onClick={() => handleStarClick(starValue)}
                            disabled={readOnly}
                        />
                        <Star
                            className={cn(
                                'h-5 w-5 transition-colors',
                                starValue <= (hover || rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                            )}
                            onMouseEnter={() => !readOnly && setHover(starValue)}
                            onMouseLeave={() => !readOnly && setHover(null)}
                        />
                    </label>
                );
            })}
        </div>
    );
}