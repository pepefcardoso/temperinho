<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\Post;
use App\Models\Recipe;

class CheckPlanLimit
{
    public function handle(Request $request, Closure $next, string $contentType): Response
    {
        $user = Auth::user();
        if (!$user) {
            return $next($request);
        }

        $company = $user->company;

        if (!$company) {
            return $next($request);
        }

        $activeSubscription = $company->subscriptions()->whereIsActive()->first();
        $plan = $activeSubscription?->plan;
        if (!$plan) {
            return response()->json([
                'message' => 'Sua empresa não possui um plano ativo. Por favor, contate o suporte.'
            ], 403);
        }

        $limit = 0;
        $model = null;

        if ($contentType === 'post') {
            $limit = $plan->max_posts;
            $model = Post::class;
        } elseif ($contentType === 'recipe') {
            $limit = $plan->max_recipes;
            $model = Recipe::class;
        } else {
            return response()->json(['message' => 'Tipo de conteúdo inválido para verificação de limite.'], 500);
        }

        $currentCount = $model::where('company_id', $company->id)
            ->where('created_at', '>=', now()->subMonth())
            ->count();

        if ($currentCount >= $limit) {
            return response()->json([
                'message' => "Você atingiu o limite mensal de {$contentType}s do seu plano."
            ], 403);
        }

        return $next($request);
    }
}
