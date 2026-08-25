"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { updatePasswordAction } from "@/lib/actions/profile";
import { User } from "@/lib/types/user";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Atualizando..." : "Atualizar Senha"}
        </Button>
    );
}

export function PasswordForm({ user }: { user: User }) {
    const formRef = useRef<HTMLFormElement>(null);
    const initialState = { message: "", success: false };
    const updatePasswordWithId = updatePasswordAction.bind(null, user.id);
    const [state, dispatch] = useActionState(updatePasswordWithId, initialState);

    if (state.success && formRef.current) {
        formRef.current.reset();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>Escolha uma nova senha forte para proteger sua conta.</CardDescription>
            </CardHeader>
            <form ref={formRef} action={dispatch}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Nova Senha</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">Confirmar Nova Senha</Label>
                        <Input id="password_confirmation" name="password_confirmation" type="password" required />
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