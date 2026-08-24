<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AttorneyResource;
use App\Models\Attorney;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AttorneyController extends Controller
{
    /**
     * Display a listing of attorneys.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Attorney::query()
            ->with(['practiceAreas']);

        if ($request->has('practice_area_slug')) {
            $query->whereHas('practiceAreas', function ($q) use ($request) {
                $q->where('slug', $request->query('practice_area_slug'));
            });
        }

        $attorneys = $query->where('is_active', true)
            ->orderBy('id', 'asc')
            ->get();

        return AttorneyResource::collection($attorneys);
    }

    /**
     * Display the specified attorney by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $attorney = Attorney::where('slug', $slug)
            ->with(['practiceAreas', 'caseResults.practiceArea'])
            ->first();

        if (!$attorney) {
            return response()->json([
                'success' => false,
                'message' => 'Attorney profile not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new AttorneyResource($attorney),
        ]);
    }
}
