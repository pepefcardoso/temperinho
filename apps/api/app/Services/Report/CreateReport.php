<?php

namespace App\Services\Report;

use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class CreateReport
{
    public function create(Model $reportable, User $user, array $data): Report
    {
        return Report::create([
            'reportable_id' => $reportable->id,
            'reportable_type' => get_class($reportable),
            'user_id' => $user->id,
            'reason' => $data['reason'],
            'comment' => $data['comment'] ?? null,
            'status' => Report::STATUS_PENDING,
        ]);
    }
}
