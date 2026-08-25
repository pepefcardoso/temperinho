<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsletterCustomer extends Model
{
    use HasFactory;

    protected $fillable = ['email'];

    public function scopeFilter($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $searchTerm = '%' . $filters['search'] . '%';

            $query->where('email', 'like', $searchTerm);
        }

        return $query;
    }
}
