import { GuestGuard } from "@/components/guards/GuestGuard";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return <GuestGuard>{children}</GuestGuard>;
}