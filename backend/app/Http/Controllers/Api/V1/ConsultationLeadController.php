<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreConsultationRequest;
use App\Http\Resources\ConsultationLeadResource;
use App\Models\ConsultationLead;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ConsultationLeadController extends Controller
{
    /**
     * Store a newly created consultation inquiry in storage.
     */
    public function store(StoreConsultationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        try {
            $lead = DB::transaction(function () use ($validated) {
                return ConsultationLead::create([
                    'full_name' => $validated['full_name'],
                    'email' => strtolower(trim($validated['email'])),
                    'phone' => trim($validated['phone']),
                    'practice_area_id' => $validated['practice_area_id'] ?? null,
                    'case_details' => $validated['case_details'],
                    'status' => 'pending',
                    'source' => $validated['source'] ?? 'website',
                ]);
            });

            $lead->load('practiceArea');

            return response()->json([
                'success' => true,
                'message' => 'Your case evaluation request has been submitted successfully. A member of our legal team will review your inquiry and contact you within 24 hours.',
                'lead_id' => $lead->id,
                'data' => new ConsultationLeadResource($lead),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Consultation lead submission error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Unable to process your request at this time. Please call our direct office line immediately.',
            ], 500);
        }
    }
}
