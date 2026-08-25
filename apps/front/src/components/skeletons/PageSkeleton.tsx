import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface PageSkeletonProps {
    layout?: 'single-column' | 'content-sidebar';
    sidebarPosition?: 'left' | 'right';
    className?: string;
}

export function PageSkeleton({
    layout = 'single-column',
    sidebarPosition = 'right',
    className
}: PageSkeletonProps) {

    const renderContent = () => (
        <div className="flex-1 space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <div className="pt-6 space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/6" />
            </div>
        </div>
    );

    const renderSidebar = () => (
        <aside className="w-full lg:w-80 lg:sticky top-24 self-start space-y-6 flex-shrink-0">
            <Skeleton className="h-72 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
        </aside>
    );

    return (
        <div className={cn("container mx-auto px-4 py-12", className)}>
            <div className="max-w-4xl mx-auto mb-12 text-center">
                <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
                <Skeleton className="h-6 w-1/2 mx-auto" />
            </div>

            {layout === 'content-sidebar' ? (
                <div className={cn(
                    "flex flex-col lg:flex-row gap-8 lg:gap-12",
                    sidebarPosition === 'left' && 'lg:flex-row-reverse'
                )}>
                    {renderContent()}
                    {renderSidebar()}
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    {renderContent()}
                </div>
            )}
        </div>
    );
}