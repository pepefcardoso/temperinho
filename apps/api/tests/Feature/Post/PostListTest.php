<?php

namespace Tests\Feature\Post;

use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use Tests\Feature\Post\PostTestSetup;
use PHPUnit\Framework\Attributes\Test;

class PostListTest extends TestCase
{
    use RefreshDatabase, PostTestSetup;

    #[Test]
    public function anyone_can_list_posts_with_correct_structure_and_pagination()
    {
        Post::factory(15)->for($this->category, 'category')->create();

        $this->getJson('/api/posts?per_page=10')
            ->assertOk()
            ->assertJsonCount(10, 'data')
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'title', 'summary', 'image', 'category', 'average_rating', 'ratings_count', 'is_favorited']],
                'links',
                'meta'
            ]);
    }

    #[test]
    public function posts_can_be_filtered_by_search_term()
    {
        Post::factory()->create(['title' => 'Um post sobre Laravel']);
        Post::factory()->create(['title' => 'Outro sobre PHP']);

        $this->getJson('/api/posts?search=Laravel')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Um post sobre Laravel');
    }

    #[test]
    public function posts_can_be_filtered_by_category()
    {
        $otherCategory = PostCategory::factory()->create();
        Post::factory()->for($this->category, 'category')->create();
        Post::factory(2)->for($otherCategory, 'category')->create();

        $this->getJson("/api/posts?category_id={$this->category->id}")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.category.id', $this->category->id);
    }

    #[test]
    public function posts_can_be_sorted_by_title_asc()
    {
        Post::factory()->create(['title' => 'Z Post Final']);
        Post::factory()->create(['title' => 'A Post Inicial']);

        $this->getJson('/api/posts?order_by=title&order_direction=asc')
            ->assertOk()
            ->assertJsonPath('data.0.title', 'A Post Inicial');
    }

    #[Test]
    public function authenticated_user_sees_favorited_status()
    {
        Sanctum::actingAs($this->user);
        $post = Post::factory()->create();
        $this->user->favoritePosts()->attach($post);

        $this->getJson("/api/posts")
            ->assertOk()
            ->assertJson(function (AssertableJson $json) use ($post) {
                $json->where('data.0.id', $post->id)
                    ->where('data.0.is_favorited', true)
                    ->etc();
            });
    }
}
