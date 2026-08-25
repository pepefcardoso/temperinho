import { getSession, getToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/profileForm";
import { PasswordForm } from "@/components/profile/passwordForm";
import { User } from "@/lib/types/user";

export default async function ProfilePage() {
  const token = await getToken();
  const session = await getSession(token);

  if (!session || !session.user) {
    redirect("/auth/login?error=invalid_session");
  }

  const user: User = session.user;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Meu Perfil</h2>
        <p className="text-muted-foreground mt-2">
          Gerencie suas informações pessoais e configurações de segurança.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-start">
        <ProfileForm user={user} />
        <PasswordForm user={user} />
      </div>
    </div>
  );
}