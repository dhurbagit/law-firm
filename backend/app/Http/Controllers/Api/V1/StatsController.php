<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Attorney;
use App\Models\CaseResult;
use App\Models\PracticeArea;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    /**
     * Return high-level firm statistics for landing page.
     */
    public function index(): JsonResponse
    {
        $attorneysCount = Attorney::where('is_active', true)->count();
        $practiceAreasCount = PracticeArea::count();
        $casesCount = CaseResult::count();

        return response()->json([
            'success' => true,
            'data' => [
                'recovered_amount' => '$250M+',
                'success_rate' => '98.6%',
                'years_experience' => '35+',
                'cases_resolved' => '5,200+',
                'active_attorneys' => $attorneysCount,
                'practice_areas' => $practiceAreasCount,
                'landmark_verdicts' => $casesCount,
            ],
        ]);
    }
}
