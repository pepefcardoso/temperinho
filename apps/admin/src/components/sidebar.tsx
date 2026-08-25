"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { dashboardConfig, NavGroup } from "@/config/dashboard";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icon } from "@/components/ui/icon";
import { UserNav } from "@/components/auth/userNav";
import { ChevronDown, PanelLeftClose, PanelRightClose } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

const findActiveGroup = (groups: NavGroup[], pathname: string): string | null => {
    for (const group of groups) {
        if (group.items.some((item) => pathname.startsWith(item.href))) {
            return group.title;
        }
    }
    return null;
};

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user } = useUserStore();
    const [openGroups, setOpenGroups] = useState<string[]>(() => {
        const activeGroup = findActiveGroup(dashboardConfig.navGroups, pathname);
        return activeGroup ? [activeGroup] : [];
    });

    useEffect(() => {
        const activeGroup = findActiveGroup(dashboardConfig.navGroups, pathname);
        if (activeGroup) {
            setOpenGroups(prev => {
                if (!prev.includes(activeGroup)) {
                    return [...prev, activeGroup];
                }
                return prev;
            });
        }
    }, [pathname]);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleGroupClick = (groupTitle: string) => {
        if (isCollapsed) return;
        setOpenGroups(prevOpenGroups =>
            prevOpenGroups.includes(groupTitle)
                ? prevOpenGroups.filter(g => g !== groupTitle)
                : [...prevOpenGroups, groupTitle]
        );
    };

    const { dashboardNavItem, navGroups } = dashboardConfig;

    return (
        <div
            className={cn(
                "relative hidden min-h-screen flex-col border-r md:flex transition-all duration-300",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
                <h1 className={cn("text-lg font-bold", isCollapsed && "hidden")}>
                    Temperinho
                </h1>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                    {isCollapsed ? <PanelRightClose className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                    <span className="sr-only">Toggle Sidebar</span>
                </Button>
            </div>

            <nav className="flex-grow overflow-y-auto p-2">
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={pathname === dashboardNavItem.href ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                asChild
                            >
                                <Link href={dashboardNavItem.href}>
                                    <Icon name={dashboardNavItem.icon} className="h-4 w-4" />
                                    <span className={cn("ml-2", isCollapsed && "hidden")}>
                                        {dashboardNavItem.title}
                                    </span>
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        {isCollapsed && (
                            <TooltipContent side="right">
                                <p>{dashboardNavItem.title}</p>
                            </TooltipContent>
                        )}
                    </Tooltip>

                    {!isCollapsed && <hr className="my-2 border-border" />}

                    {navGroups.map((group) => (
                        <div key={group.title} className="mb-2">
                            {!isCollapsed && (
                                <button
                                    onClick={() => handleGroupClick(group.title)}
                                    className="flex w-full items-center justify-between rounded-md px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:bg-accent"
                                >
                                    {group.title}
                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 transition-transform",
                                            openGroups.includes(group.title) && "rotate-180"
                                        )}
                                    />
                                </button>
                            )}

                            {(openGroups.includes(group.title) || isCollapsed) && (
                                <div className={cn("mt-1 space-y-1", !isCollapsed && "ml-2 border-l border-dashed border-border pl-2")}>
                                    {group.items.map((item) => (
                                        <Tooltip key={item.href}>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant={pathname === item.href ? "secondary" : "ghost"}
                                                    className="w-full justify-start"
                                                    asChild
                                                >
                                                    <Link href={item.href}>
                                                        <Icon name={item.icon} className="h-4 w-4" />
                                                        <span className={cn("ml-2", isCollapsed && "hidden")}>
                                                            {item.title}
                                                        </span>
                                                    </Link>
                                                </Button>
                                            </TooltipTrigger>
                                            {isCollapsed && (
                                                <TooltipContent side="right">
                                                    <p>{item.title}</p>
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </TooltipProvider>
            </nav>

            <div className="mt-auto shrink-0 border-t p-2">
                <UserNav user={user} isCollapsed={isCollapsed} />
            </div>
        </div>
    );
}