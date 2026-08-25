"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { updateProfileAction, ProfileActionState } from "@/lib/actions/profile";
import { User } from "@/lib/types/user";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "./avatarUpload";
import { useUserStore } from "@/stores/userStore";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Salvando..." : "Salvar Alterações"}
        </Button>
    );
}

export function ProfileForm({ user }: { user: User }) {
    const { setUser } = useUserStore();
    const initialState: ProfileActionState = { message: "", success: false, user: undefined };
    const updateUserWithId = updateProfileAction.bind(null, user.id);
    const [state, dispatch] = useActionState(updateUserWithId, initialState);

    useEffect(() => {
        if (state.success && state.user) {
            setUser(state.user);
        }
    }, [state, setUser]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>Atualize os detalhes da sua conta e imagem de perfil.</CardDescription>
            </CardHeader>
            <form action={dispatch}>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Imagem de Perfil</Label>
                        <AvatarUpload user={user} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" name="name" defaultValue={user.name} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" defaultValue={user.email} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" name="phone" type="tel" defaultValue={user.phone ?? ''} placeholder="(99) 99999-9999" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="birthday">Data de Nascimento</Label>
                        <Input id="birthday" name="birthday" type="date" defaultValue={user.birthday ?? ''} />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
                    {state?.message && (
                        <p className={state.success ? 'text-sm text-green-600' : 'text-sm text-red-600'}>
                            {state.message}
                        </p>
                    )}
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
    );
}