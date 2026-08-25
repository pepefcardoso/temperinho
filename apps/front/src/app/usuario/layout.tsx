import UserDashboardLayout from '@/components/user-profile/UserLayout';
import { AuthGuard } from '@/components/guards/AuthGuard';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <UserDashboardLayout>
        {children}
      </UserDashboardLayout>
    </AuthGuard>
  );
}