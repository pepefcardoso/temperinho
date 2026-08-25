import { getAuthenticatedUserProfile } from '@/lib/api/user.server';
import { getMyRecipes } from '@/lib/api/recipe.server';
import { getMyPosts } from '@/lib/api/blog.server';
import { DashboardClient } from '@/components/user-profile/DashboardClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function UserDashboardPage() {
    try {
        const userData = await getAuthenticatedUserProfile();

        const [myRecipesResponse, myPostsResponse] = await Promise.allSettled([
            getMyRecipes({ page: 1, limit: 3 }),
            getMyPosts({ page: 1, limit: 3 }),
        ]);

        const recentRecipes = myRecipesResponse.status === 'fulfilled' ? myRecipesResponse.value.data : [];
        const recentPosts = myPostsResponse.status === 'fulfilled' ? myPostsResponse.value.data : [];

        return (
            <DashboardClient
                user={userData}
                recentRecipes={recentRecipes}
                recentPosts={recentPosts}
            />
        );
    } catch (error) {
        console.error("Falha ao carregar dados do dashboard no servidor:", error);

        if (error instanceof Error &&
            (error.message.includes('Token de autenticação não encontrado') ||
                error.message.includes('401') ||
                error.message.includes('403'))) {
            redirect('/auth/login?error=authentication-required');
        }

        return (
            <DashboardClient
                user={null}
                recentRecipes={[]}
                recentPosts={[]}
            />
        );
    }
}