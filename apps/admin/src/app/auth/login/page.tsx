
import { AuthCard } from "@/components/auth/authCard";
import { LoginForm } from "@/components/auth/loginForm";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
      <AuthCard
        className="w-full max-w-sm"
        cardTitle="Login"
        cardDescription="Entre com suas credenciais para acessar o painel."
      >
        <LoginForm />
      </AuthCard>
    </main>
  );
}