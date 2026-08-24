<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CaseResultResource;
use App\Models\CaseResult;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CaseResultController extends Controller
{
    /**
     * Display a listing of case results / verdicts.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = CaseResult::query()
            ->with(['practiceArea', 'leadAttorney']);

        if ($request->has('practice_area_id')) {
            $query->where('practice_area_id', $request->query('practice_area_id'));
        }

        if ($request->has('lead_attorney_id')) {
            $query->where('lead_attorney_id', $request->query('lead_attorney_id'));
        }

        $results = $query->orderBy('case_year', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        return CaseResultResource::collection($results);
    }
}
