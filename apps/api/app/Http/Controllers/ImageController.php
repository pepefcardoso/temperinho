<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ManagesResourceCaching;
use App\Http\Resources\Image\ImageCollectionResource;
use App\Models\Image;
use App\Services\Image\CreateImage;
use App\Services\Image\DeleteImage;
use App\Services\Image\UpdateImage;
use App\Http\Requests\Image\StoreImageRequest;
use App\Http\Requests\Image\UpdateImageRequest;
use Illuminate\Http\Request;

use App\Http\Requests\Image\FilterImageRequest;
use App\Services\Image\ListImages;

class ImageController extends BaseResourceController
{
    use ManagesResourceCaching;

    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    protected function getFilterRequestClass(): string
    {
        return FilterImageRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListImages::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return ImageCollectionResource::class;
    }

    protected function getCacheTag(): string
    {
        return 'images';
    }

    public function index(FilterImageRequest $request)
    {
        $this->authorize('viewAny', Image::class);
        return $this->standardIndex($request);
    }

    public function store(StoreImageRequest $request, CreateImage $service)
    {
        $data = $request->validated();
        $model = $data['imageable_type']::findOrFail($data['imageable_id']);
        
        $this->authorize('update', $model);

        $file = $data['file'];

        $imageData = $service->uploadOnly($file);
        $image = $service->createDbRecord($request->user(), $model, $imageData);

        $this->flushResourceCache();

        return response()->json($image, 201);
    }

    public function show(Image $image)
    {
        $this->authorize('view', $image);

        return response()->json($image);
    }

    public function update(UpdateImageRequest $request, Image $image, UpdateImage $updateService, CreateImage $createService)
    {
        $data = $request->validated();
        $file = $data['file'];

        $newImageData = $createService->uploadOnly($file);
        $oldPath = $updateService->updateDbRecord($image, $newImageData);
        $updateService->deleteFile($oldPath);

        $this->flushResourceCache();

        return response()->json($image->fresh());
    }

    public function destroy(Image $image, DeleteImage $service)
    {
        $this->authorize('delete', $image);

        $filePath = $service->deleteDbRecord($image);
        $service->deleteFile($filePath);

        $this->flushResourceCache();

        return response()->json(null, 204);
    }
}
