<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PracticeAreaResource;
use App\Models\PracticeArea;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PracticeAreaController extends Controller
{
    /**
     * Display a listing of the practice areas.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = PracticeArea::query()
            ->with(['children', 'attorneys']);

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        if ($request->has('root_only')) {
            $query->whereNull('parent_id');
        }

        $practiceAreas = $query->orderBy('is_featured', 'desc')
            ->orderBy('title', 'asc')
            ->get();

        return PracticeAreaResource::collection($practiceAreas);
    }

    /**
     * Display the specified practice area by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $practiceArea = PracticeArea::where('slug', $slug)
            ->with(['parent', 'children', 'attorneys', 'caseResults.leadAttorney'])
            ->first();

        if (!$practiceArea) {
            return response()->json([
                'success' => false,
                'message' => 'Practice area not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new PracticeAreaResource($practiceArea),
        ]);
    }
}
