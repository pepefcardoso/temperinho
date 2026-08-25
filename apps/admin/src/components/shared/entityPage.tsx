import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface EntityPageProps {
    title: string;
    description: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    isLoading?: boolean;
}

export function EntityPage({
    title,
    description,
    children,
    actions,
    isLoading = false
}: EntityPageProps): React.ReactElement {
    return (
        <div className="p-4 sm:p-6 md:p-8">
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                        <div className="flex-1">
                            <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
                            <CardDescription className="text-gray-500 mt-1">
                                {description}
                            </CardDescription>
                        </div>

                        {actions && (
                            <div className="flex items-center gap-2">
                                {actions}
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-1/2" />
                        </div>
                    ) : (
                        children
                    )}
                </CardContent>
            </Card>
        </div>
    );
}