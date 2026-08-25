import { Sidebar } from "@/components/sidebar";
import { redirect } from "next/navigation";
import { UserSessionProvider } from "@/components/auth/userSessionProvider";
import { getToken, getSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();
  if (!token) {
    redirect("/auth/login?error=invalid_session");
  }

  const session = await getSession(token);
  if (!session) {
    redirect("/auth/login?error=invalid_session");
  }

  return (
    <UserSessionProvider initialUser={session.user}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </UserSessionProvider>
  );
}
