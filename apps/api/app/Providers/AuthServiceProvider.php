<?php

namespace App\Providers;

use App\Models\Comment;
use App\Models\CustomerContact;
use App\Models\NewsletterCustomer;
use App\Models\PostCategory;
use App\Models\PostTopic;
use App\Models\Post;
use App\Models\Rating;
use App\Models\Recipe;
use App\Models\RecipeCategory;
use App\Models\RecipeDiet;
use App\Models\RecipeIngredient;
use App\Models\RecipeStep;
use App\Models\RecipeUnit;
use App\Models\User;
use App\Models\Company;
use App\Models\Plan;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\PaymentMethod;
use App\Models\Image;
use App\Policies\CommentPolicy;
use App\Policies\CustomerContactPolicy;
use App\Policies\ImagePolicy;
use App\Policies\NewsletterCustomerPolicy;
use App\Policies\PostCategoryPolicy;
use App\Policies\PostTopicPolicy;
use App\Policies\PostPolicy;
use App\Policies\RatingPolicy;
use App\Policies\RecipeCategoryPolicy;
use App\Policies\RecipeDietPolicy;
use App\Policies\RecipeIngredientPolicy;
use App\Policies\RecipePolicy;
use App\Policies\RecipeStepPolicy;
use App\Policies\RecipeUnitPolicy;
use App\Policies\UserPolicy;
use App\Policies\CompanyPolicy;
use App\Policies\PlanPolicy;
use App\Policies\SubscriptionPolicy;
use App\Policies\PaymentPolicy;
use App\Policies\PaymentMethodPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        RecipeDiet::class => RecipeDietPolicy::class,
        RecipeCategory::class => RecipeCategoryPolicy::class,
        RecipeUnit::class => RecipeUnitPolicy::class,
        RecipeIngredient::class => RecipeIngredientPolicy::class,
        RecipeStep::class => RecipeStepPolicy::class,
        Recipe::class => RecipePolicy::class,
        User::class => UserPolicy::class,
        Post::class => PostPolicy::class,
        PostCategory::class => PostCategoryPolicy::class,
        PostTopic::class => PostTopicPolicy::class,
        Image::class => ImagePolicy::class,
        Rating::class => RatingPolicy::class,
        Comment::class => CommentPolicy::class,
        CustomerContact::class => CustomerContactPolicy::class,
        NewsletterCustomer::class => NewsletterCustomerPolicy::class,
        Company::class => CompanyPolicy::class,
        Plan::class => PlanPolicy::class,
        Subscription::class => SubscriptionPolicy::class,
        Payment::class => PaymentPolicy::class,
        PaymentMethod::class => PaymentMethodPolicy::class,
    ];

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
