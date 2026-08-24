<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AttorneyResource;
use App\Http\Resources\CaseResultResource;
use App\Http\Resources\ConsultationLeadResource;
use App\Http\Resources\PracticeAreaResource;
use App\Models\Attorney;
use App\Models\CaseResult;
use App\Models\ConsultationLead;
use App\Models\PracticeArea;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    /**
     * Analytics & Triage Metrics.
     */
    public function analytics(): JsonResponse
    {
        $leadsTotal = ConsultationLead::count();
        $pendingLeads = ConsultationLead::where('status', 'pending')->count();
        $contactedLeads = ConsultationLead::where('status', 'contacted')->count();
        $scheduledLeads = ConsultationLead::where('status', 'scheduled')->count();
        $closedLeads = ConsultationLead::where('status', 'closed')->count();

        $conversionRate = $leadsTotal > 0
            ? round((($scheduledLeads + $closedLeads) / $leadsTotal) * 100, 1)
            : 0;

        $practiceAreasCount = PracticeArea::count();
        $attorneysTotal = Attorney::count();
        $attorneysActive = Attorney::where('is_active', true)->count();
        $caseResultsCount = CaseResult::count();

        // Practice discipline breakdown
        $practiceDistribution = PracticeArea::withCount(['leads', 'attorneys'])
            ->orderBy('leads_count', 'desc')
            ->get()
            ->map(function ($area) {
                return [
                    'id' => $area->id,
                    'title' => $area->title,
                    'slug' => $area->slug,
                    'leads_count' => $area->leads_count,
                    'attorneys_count' => $area->attorneys_count,
                ];
            });

        // Recent intake activity
        $recentActivity = ConsultationLead::with('practiceArea')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'leads_total' => $leadsTotal,
                'leads_pending' => $pendingLeads,
                'leads_contacted' => $contactedLeads,
                'leads_scheduled' => $scheduledLeads,
                'leads_closed' => $closedLeads,
                'conversion_rate' => $conversionRate . '%',
                'practice_areas_total' => $practiceAreasCount,
                'attorneys_total' => $attorneysTotal,
                'attorneys_active' => $attorneysActive,
                'case_results_total' => $caseResultsCount,
                'practice_distribution' => $practiceDistribution,
                'recent_activity' => ConsultationLeadResource::collection($recentActivity),
            ],
        ]);
    }

    /**
     * List all consultation leads with optional status, search, and date filters.
     */
    public function leads(Request $request): AnonymousResourceCollection
    {
        $query = ConsultationLead::query()->with('practiceArea');

        // Status filter
        if ($request->filled('status') && in_array($request->status, ['pending', 'contacted', 'scheduled', 'closed'])) {
            $query->where('status', $request->status);
        }

        // Search query (keyword matching name, email, phone, details)
        if ($request->filled('q')) {
            $search = '%' . trim($request->q) . '%';
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', $search)
                  ->orWhere('email', 'like', $search)
                  ->orWhere('phone', 'like', $search)
                  ->orWhere('case_details', 'like', $search);
            });
        }

        // Date filtering
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $leads = $query->orderBy('created_at', 'desc')
            ->paginate($request->integer('per_page', 25));

        return ConsultationLeadResource::collection($leads);
    }

    /**
     * Update consultation lead status with optional notes.
     */
    public function updateLeadStatus(Request $request, ConsultationLead $lead): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'in:pending,contacted,scheduled,closed'],
        ]);

        $lead->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Consultation inquiry #' . $lead->id . ' transitioned to status ' . $request->status . '.',
            'data' => new ConsultationLeadResource($lead->fresh('practiceArea')),
        ]);
    }

    /**
     * Delete lead / purge spam record.
     */
    public function deleteLead(ConsultationLead $lead): JsonResponse
    {
        $id = $lead->id;
        $lead->delete();

        return response()->json([
            'success' => true,
            'message' => 'Consultation lead #' . $id . ' has been purged successfully.',
        ]);
    }

    // ==========================================
    // ATTORNEYS DIRECTORY CRUD
    // ==========================================

    /**
     * List all attorneys for admin.
     */
    public function attorneys(): AnonymousResourceCollection
    {
        $attorneys = Attorney::with('practiceAreas')
            ->orderBy('id', 'asc')
            ->get();

        return AttorneyResource::collection($attorneys);
    }

    /**
     * Store a new attorney with JSON fields and pivot practice area sync.
     */
    public function storeAttorney(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'designation' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:attorneys,email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'photo_url' => ['nullable', 'string', 'max:1000'],
            'bio' => ['required', 'string'],
            'bar_admissions' => ['nullable', 'array'],
            'bar_admissions.*' => ['string'],
            'education' => ['nullable', 'array'],
            'education.*' => ['string'],
            'social_links' => ['nullable', 'array'],
            'is_active' => ['nullable', 'boolean'],
            'practice_area_ids' => ['nullable', 'array'],
            'practice_area_ids.*' => ['exists:practice_areas,id'],
        ]);

        $slugBase = Str::slug($validated['name']);
        $slug = $slugBase;
        $count = 1;
        while (Attorney::where('slug', $slug)->exists()) {
            $slug = $slugBase . '-' . (++$count);
        }

        $attorney = Attorney::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'designation' => $validated['designation'],
            'email' => strtolower(trim($validated['email'])),
            'phone' => $validated['phone'] ?? null,
            'photo_url' => $validated['photo_url'] ?? null,
            'bio' => $validated['bio'],
            'bar_admissions' => $validated['bar_admissions'] ?? [],
            'education' => $validated['education'] ?? [],
            'social_links' => $validated['social_links'] ?? [],
            'is_active' => $request->boolean('is_active', true),
        ]);

        if (!empty($validated['practice_area_ids'])) {
            $attorney->practiceAreas()->sync($validated['practice_area_ids']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Attorney profile for ' . $attorney->name . ' created successfully.',
            'data' => new AttorneyResource($attorney->load('practiceAreas')),
        ], 201);
    }

    /**
     * Update an attorney profile.
     */
    public function updateAttorney(Request $request, Attorney $attorney): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'designation' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('attorneys', 'email')->ignore($attorney->id)],
            'phone' => ['nullable', 'string', 'max:50'],
            'photo_url' => ['nullable', 'string', 'max:1000'],
            'bio' => ['required', 'string'],
            'bar_admissions' => ['nullable', 'array'],
            'education' => ['nullable', 'array'],
            'social_links' => ['nullable', 'array'],
            'is_active' => ['nullable', 'boolean'],
            'practice_area_ids' => ['nullable', 'array'],
            'practice_area_ids.*' => ['exists:practice_areas,id'],
        ]);

        if ($attorney->name !== $validated['name']) {
            $slugBase = Str::slug($validated['name']);
            $slug = $slugBase;
            $count = 1;
            while (Attorney::where('slug', $slug)->where('id', '!=', $attorney->id)->exists()) {
                $slug = $slugBase . '-' . (++$count);
            }
            $attorney->slug = $slug;
        }

        $attorney->name = $validated['name'];
        $attorney->designation = $validated['designation'];
        $attorney->email = strtolower(trim($validated['email']));
        $attorney->phone = $validated['phone'] ?? null;
        $attorney->photo_url = $validated['photo_url'] ?? null;
        $attorney->bio = $validated['bio'];
        $attorney->bar_admissions = $validated['bar_admissions'] ?? [];
        $attorney->education = $validated['education'] ?? [];
        $attorney->social_links = $validated['social_links'] ?? [];
        $attorney->is_active = $request->boolean('is_active', true);
        $attorney->save();

        if (isset($validated['practice_area_ids'])) {
            $attorney->practiceAreas()->sync($validated['practice_area_ids']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Attorney profile for ' . $attorney->name . ' updated successfully.',
            'data' => new AttorneyResource($attorney->fresh('practiceAreas')),
        ]);
    }

    /**
     * Delete an attorney record.
     */
    public function deleteAttorney(Attorney $attorney): JsonResponse
    {
        $name = $attorney->name;
        $attorney->practiceAreas()->detach();
        $attorney->delete();

        return response()->json([
            'success' => true,
            'message' => 'Attorney record for ' . $name . ' deleted successfully.',
        ]);
    }

    // ==========================================
    // PRACTICE AREAS CRUD
    // ==========================================

    /**
     * List all practice areas for admin.
     */
    public function practiceAreas(): AnonymousResourceCollection
    {
        $areas = PracticeArea::with(['parent', 'attorneys', 'children'])
            ->orderBy('title', 'asc')
            ->get();

        return PracticeAreaResource::collection($areas);
    }

    /**
     * Create practice area.
     */
    public function storePracticeArea(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'short_summary' => ['required', 'string', 'max:500'],
            'description' => ['required', 'string'],
            'icon' => ['nullable', 'string', 'max:50'],
            'is_featured' => ['nullable', 'boolean'],
            'parent_id' => ['nullable', 'exists:practice_areas,id'],
        ]);

        $slugBase = Str::slug($validated['title']);
        $slug = $slugBase;
        $count = 1;
        while (PracticeArea::where('slug', $slug)->exists()) {
            $slug = $slugBase . '-' . (++$count);
        }

        $validated['slug'] = $slug;
        $validated['is_featured'] = $request->boolean('is_featured', false);

        $area = PracticeArea::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Practice discipline "' . $area->title . '" created successfully.',
            'data' => new PracticeAreaResource($area->load('parent')),
        ], 201);
    }

    /**
     * Update practice area.
     */
    public function updatePracticeArea(Request $request, PracticeArea $practiceArea): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'short_summary' => ['required', 'string', 'max:500'],
            'description' => ['required', 'string'],
            'icon' => ['nullable', 'string', 'max:50'],
            'is_featured' => ['nullable', 'boolean'],
            'parent_id' => ['nullable', 'exists:practice_areas,id'],
        ]);

        if ($practiceArea->title !== $validated['title']) {
            $slugBase = Str::slug($validated['title']);
            $slug = $slugBase;
            $count = 1;
            while (PracticeArea::where('slug', $slug)->where('id', '!=', $practiceArea->id)->exists()) {
                $slug = $slugBase . '-' . (++$count);
            }
            $validated['slug'] = $slug;
        }

        $validated['is_featured'] = $request->boolean('is_featured', false);

        $practiceArea->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Practice discipline "' . $practiceArea->title . '" updated successfully.',
            'data' => new PracticeAreaResource($practiceArea->fresh(['parent', 'attorneys'])),
        ]);
    }

    /**
     * Delete practice area.
     */
    public function deletePracticeArea(PracticeArea $practiceArea): JsonResponse
    {
        $title = $practiceArea->title;
        $practiceArea->delete();

        return response()->json([
            'success' => true,
            'message' => 'Practice discipline "' . $title . '" deleted successfully.',
        ]);
    }

    // ==========================================
    // CASE RESULTS CRUD
    // ==========================================

    /**
     * List all case results for admin.
     */
    public function caseResults(): AnonymousResourceCollection
    {
        $results = CaseResult::with(['practiceArea', 'leadAttorney'])
            ->orderBy('case_year', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        return CaseResultResource::collection($results);
    }

    /**
     * Store case result / verdict.
     */
    public function storeCaseResult(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'settlement_verdict' => ['required', 'string', 'max:255'],
            'practice_area_id' => ['required', 'exists:practice_areas,id'],
            'lead_attorney_id' => ['required', 'exists:attorneys,id'],
            'summary' => ['required', 'string'],
            'case_year' => ['required', 'integer', 'min:1990', 'max:2030'],
        ]);

        $slugBase = Str::slug($validated['title']);
        $slug = $slugBase;
        $count = 1;
        while (CaseResult::where('slug', $slug)->exists()) {
            $slug = $slugBase . '-' . (++$count);
        }

        $validated['slug'] = $slug;

        $caseResult = CaseResult::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Landmark case record "' . $caseResult->title . '" created successfully.',
            'data' => new CaseResultResource($caseResult->load(['practiceArea', 'leadAttorney'])),
        ], 201);
    }

    /**
     * Update case result.
     */
    public function updateCaseResult(Request $request, CaseResult $caseResult): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'settlement_verdict' => ['required', 'string', 'max:255'],
            'practice_area_id' => ['required', 'exists:practice_areas,id'],
            'lead_attorney_id' => ['required', 'exists:attorneys,id'],
            'summary' => ['required', 'string'],
            'case_year' => ['required', 'integer', 'min:1990', 'max:2030'],
        ]);

        if ($caseResult->title !== $validated['title']) {
            $slugBase = Str::slug($validated['title']);
            $slug = $slugBase;
            $count = 1;
            while (CaseResult::where('slug', $slug)->where('id', '!=', $caseResult->id)->exists()) {
                $slug = $slugBase . '-' . (++$count);
            }
            $validated['slug'] = $slug;
        }

        $caseResult->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Landmark case record "' . $caseResult->title . '" updated successfully.',
            'data' => new CaseResultResource($caseResult->fresh(['practiceArea', 'leadAttorney'])),
        ]);
    }

    /**
     * Delete case result.
     */
    public function deleteCaseResult(CaseResult $caseResult): JsonResponse
    {
        $title = $caseResult->title;
        $caseResult->delete();

        return response()->json([
            'success' => true,
            'message' => 'Landmark case record "' . $title . '" deleted successfully.',
        ]);
    }

    // ==========================================
    // SECURE FILE UPLOAD PIPELINE
    // ==========================================

    /**
     * Secure upload for attorney headshots and case documentation.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => [
                'required',
                'file',
                'mimes:jpeg,jpg,png,webp,pdf',
                'max:5120', // 5MB max
            ],
        ]);

        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension();
        $safeFileName = Str::random(24) . '.' . $extension;

        // Store inside storage/app/public/uploads
        $path = $file->storeAs('uploads', $safeFileName, 'public');

        $fullUrl = url('storage/' . $path);

        return response()->json([
            'success' => true,
            'message' => 'File uploaded securely.',
            'url' => $fullUrl,
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
            'size_bytes' => $file->getSize(),
        ]);
    }
}
