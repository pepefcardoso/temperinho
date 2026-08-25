<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Filesystem\FilesystemAdapter;

class Image extends Model
{
    use HasFactory;

    static public string $S3Directory = 'images';

    protected $appends = [
        'url',
    ];

    protected $fillable = ['name', 'path', 'imageable_id', 'imageable_type', 'user_id'];

    public function scopeFilter($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $searchTerm = '%' . $filters['search'] . '%';

            $query->where('name', 'like', $searchTerm);
        }

        return $query;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }

    protected function url(): Attribute
    {
        return Attribute::make(
            get: function () {
                $diskName = config('filesystems.default');

                /** @var FilesystemAdapter $disk */
                $disk = Storage::disk($diskName);

                if ($diskName !== 's3') {
                    return $disk->url($this->path);
                }

                if (config('filesystems.disks.s3.bucket')) {
                    $cacheKey = "image:url:{$this->id}";
                    return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($disk) {
                        return $disk->temporaryUrl($this->path, now()->addMinutes(15));
                    });
                }

                return null;
            }
        );
    }
}
