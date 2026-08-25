"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/lib/types/user";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/stores/userStore";
import { logout } from "@/lib/actions/auth";

function getInitials(name: string): string {
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.toUpperCase();
}

function UserNavSkeleton({ isCollapsed }: { isCollapsed: boolean }) {
  if (isCollapsed) {
    return <Skeleton className="h-9 w-9 rounded-full" />;
  }
  return (
    <div className="flex items-center gap-3 p-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export function UserNav({
  user,
  isCollapsed,
}: {
  user: User | null;
  isCollapsed: boolean;
}) {
  const { clearUser } = useUserStore();
  if (!user) {
    return <UserNavSkeleton isCollapsed={isCollapsed} />;
  }

  const { name, email, image } = user;
  const initials = getInitials(name);

  const handleLogout = async () => {
    clearUser();
    await logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full flex justify-start items-center gap-3 p-2 cursor-pointer",
            isCollapsed && "justify-center p-0 h-9 w-9"
          )}
        >
          <Avatar className="h-8 w-8 transition-all ring-offset-background hover:ring-2 hover:ring-ring hover:ring-offset-2">
            <AvatarImage src={image?.url} alt={`@${name}`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div
            className={cn("flex flex-col items-start", isCollapsed && "hidden")}
          >
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard/profile">
            <DropdownMenuItem>Perfil</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={handleLogout} className="w-full">
          <button type="submit" className="w-full text-left">
            <DropdownMenuItem>Sair</DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
