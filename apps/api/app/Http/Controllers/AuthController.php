<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Resources\User\AuthUserResource;
use App\Services\Auth\Login;
use App\Services\Auth\Logout;
use App\Services\Auth\ResetPassword;
use App\Services\Auth\SendPasswordResetLink;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class AuthController extends BaseController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->only('logout');
    }

    public function login(LoginRequest $request, Login $service)
    {
        $token = $service->login($request->validated());
        $user = $service->getUser();
        
        $request->setUserResolver(fn() => $user);

        return new AuthUserResource($user->load('image'), $token);
    }

    public function logout(Request $request, Logout $service): JsonResponse
    {
        $service->logout($request->user());
        return response()->json(null, 204);
    }

    public function sendResetLink(ForgotPasswordRequest $request, SendPasswordResetLink $service): JsonResponse
    {
        $service->execute($request->validated());

        return response()->json([
            'message' => 'Se o e-mail fornecido estiver em nossa base de dados, um link para redefinição de senha será enviado.'
        ]);
    }

    public function resetPassword(ResetPasswordRequest $request, ResetPassword $service): JsonResponse
    {
        $status = $service->execute($request->validated());

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }
}
