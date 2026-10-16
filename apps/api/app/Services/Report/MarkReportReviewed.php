<?php

namespace App\Services\Report;

use App\Models\Report;

class MarkReportReviewed
{
    public function review(Report $report): Report
    {
        $report->update(['status' => Report::STATUS_REVIEWED]);

        return $report;
    }
}
