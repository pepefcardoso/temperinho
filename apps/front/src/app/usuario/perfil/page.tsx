import { getAuthenticatedUserProfile } from '@/lib/api/user.server';
import { UserProfileClient } from '@/components/user-profile/UserProfileClient';

export const dynamic = 'force-dynamic';

export default async function UserProfilePage() {
    try {
        const userProfileData = await getAuthenticatedUserProfile();

        return <UserProfileClient user={userProfileData} />;
    } catch (error) {
        console.error("Falha ao buscar perfil do usuário no servidor:", error);
        return <UserProfileClient user={null} />;
    }
}