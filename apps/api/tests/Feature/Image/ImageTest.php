<?php

namespace Tests\Feature\Image;

use App\Models\Image;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ImageTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_AcessoUrlS3_GeraESalvaNoCache(): void
    {
        // --- ARRANGE ---
        Config::set('filesystems.default', 's3');
        Config::set('filesystems.disks.s3.bucket', 'test-bucket');
        Storage::fake('s3');

        $user = User::factory()->create();
        $image = Image::factory()->create([
            'path' => 'images/test.jpg',
            'user_id' => $user->id,
            'imageable_type' => User::class,
            'imageable_id' => $user->id,
        ]);

        $cacheKey = "image:url:{$image->id}";

        $this->assertNull(Cache::get($cacheKey));

        // --- ACT ---
        $url1 = $image->url;

        // --- ASSERT ---
        $this->assertNotNull($url1);
        $this->assertStringContainsString('images/test.jpg', $url1);
        $this->assertEquals($url1, Cache::get($cacheKey));
        
        // Ensure cache is hit on second access
        $url2 = $image->url;
        $this->assertEquals($url1, $url2);
        
        // Prove it actually uses cache by manually changing it
        Cache::put($cacheKey, 'fake-cached-url', now()->addMinutes(5));
        $this->assertEquals('fake-cached-url', $image->url);
    }

    #[Test]
    public function Validar_AcessoUrlLocal_NaoUsaCache(): void
    {
        // --- ARRANGE ---
        Config::set('filesystems.default', 'local');
        Storage::fake('local');

        $user = User::factory()->create();
        $image = Image::factory()->create([
            'path' => 'images/test.jpg',
            'user_id' => $user->id,
            'imageable_type' => User::class,
            'imageable_id' => $user->id,
        ]);

        $cacheKey = "image:url:{$image->id}";

        // --- ACT ---
        $url = $image->url;

        // --- ASSERT ---
        $this->assertNotNull($url);
        $this->assertStringContainsString('images/test.jpg', $url);
        $this->assertNull(Cache::get($cacheKey));
    }
}
