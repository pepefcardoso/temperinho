<?php

namespace App\Http\Controllers;

use App\Http\Requests\Report\FilterReportRequest;
use App\Http\Requests\Report\StoreReportRequest;
use App\Http\Resources\Report\ReportCollectionResource;
use App\Http\Resources\Report\ReportResource;
use App\Models\Report;
use App\Services\Report\CreateReport;
use App\Services\Report\ListReports;
use App\Services\Report\MarkReportReviewed;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

class ReportController extends BaseResourceController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    protected function getFilterRequestClass(): string
    {
        return FilterReportRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListReports::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return ReportCollectionResource::class;
    }

    public function index(FilterReportRequest $request): AnonymousResourceCollection
    {
        return $this->standardIndex($request);
    }

    public function store(StoreReportRequest $request, string $type, int $reportableId, CreateReport $service): JsonResponse
    {
        $reportable = $this->resolveReportable($type, $reportableId);

        $report = $service->create($reportable, $request->user(), $request->validated());

        return (new ReportResource($report))->response()->setStatusCode(201);
    }

    public function review(Report $report, MarkReportReviewed $service): ReportResource
    {
        $this->authorize('update', $report);

        return new ReportResource($service->review($report));
    }

    protected function resolveReportable(string $type, $id)
    {
        $class = 'App\\Models\\' . Str::studly(Str::singular($type));
        abort_unless(class_exists($class), 404, "Tipo inválido: {$type}");
        return $class::findOrFail($id);
    }
}
