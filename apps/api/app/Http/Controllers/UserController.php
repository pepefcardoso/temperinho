<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\FilterUsersRequest;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\ToggleFavoriteRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Requests\User\UpdateUserRoleRequest;
use App\Http\Resources\User\AuthUserResource;
use App\Http\Resources\User\UserCollectionResource;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use App\Services\User\CreateUser;
use App\Services\User\DeleteUser;
use App\Services\User\ListUser;
use App\Services\User\ToggleFavoritePost;
use App\Services\User\ToggleFavoriteRecipe;
use App\Services\User\UpdateUser;
use App\Services\User\UpdateUserRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends BaseResourceController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['store']);
    }

    protected function getFilterRequestClass(): string
    {
        return FilterUsersRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListUser::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return UserCollectionResource::class;
    }

    public function index(FilterUsersRequest $request): AnonymousResourceCollection
    {
        return $this->standardIndex($request);
    }

    public function store(StoreUserRequest $request, CreateUser $service): AuthUserResource
    {
        $user = $service->create($request->validated());
        $token = $user->createToken('auth_token')->plainTextToken;
        
        $request->setUserResolver(fn() => $user);

        return new AuthUserResource($user->load('image'), $token);
    }

    public function show(User $user): UserResource
    {
        $this->authorize('view', $user);

        return new UserResource($user->load('image'));
    }

    public function update(UpdateUserRequest $request, User $user, UpdateUser $service): UserResource
    {
        $updatedUser = $service->update($user, $request->validated());

        return new UserResource($updatedUser);
    }

    public function destroy(User $user, DeleteUser $service): JsonResponse
    {
        $this->authorize('delete', $user);

        $service->delete($user);

        return response()->json(null, 204);
    }

    public function authUser(Request $request): UserResource
    {
        $this->authorize('view', $request->user());

        return new UserResource($request->user()->load('image'));
    }

    public function updateRole(UpdateUserRoleRequest $request, User $user, UpdateUserRole $service): UserResource
    {
        $updatedUser = $service->execute($user, $request->validated('role'));

        return new UserResource($updatedUser);
    }

    public function toggleFavoritePost(ToggleFavoriteRequest $request, ToggleFavoritePost $service): JsonResponse
    {
        $postId = $request->validated()['post_id'] ?? null;
        $result = $service->execute($request->user(), $postId);
        
        return response()->json($result);
    }

    public function toggleFavoriteRecipe(ToggleFavoriteRequest $request, ToggleFavoriteRecipe $service): JsonResponse
    {
        $recipeId = $request->validated()['recipe_id'] ?? null;
        $result = $service->execute($request->user(), $recipeId);
        
        return response()->json($result);
    }
}
