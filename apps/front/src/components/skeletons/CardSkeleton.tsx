import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface CardSkeletonProps {
    layout?: 'grid' | 'list';
}

export function CardSkeleton({ layout = 'grid' }: CardSkeletonProps) {

    if (layout === 'grid') {
        return (
            <Card className="flex flex-col h-full">
                <CardContent className="p-0">
                    <Skeleton className="h-48 w-full rounded-t-xl" />
                    <div className="p-4 space-y-3">
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-6 w-1/2" />
                        </div>
                        <div className="flex items-center justify-between pt-4 mt-auto border-t">
                            <div className="flex gap-4">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <Skeleton className="h-5 w-12" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (layout === 'list') {
        return (
            <Card>
                <CardContent className="p-4 flex flex-row items-center gap-4">
                    <Skeleton className="h-32 w-32 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                        <div className="flex items-center gap-4 pt-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return null;
}