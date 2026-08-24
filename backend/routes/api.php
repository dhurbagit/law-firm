<?php

use App\Http\Controllers\Api\V1\Admin\AdminAuthController;
use App\Http\Controllers\Api\V1\Admin\AdminController;
use App\Http\Controllers\Api\V1\AttorneyController;
use App\Http\Controllers\Api\V1\CaseResultController;
use App\Http\Controllers\Api\V1\ConsultationLeadController;
use App\Http\Controllers\Api\V1\PracticeAreaController;
use App\Http\Controllers\Api\V1\StatsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - V1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Public Firm Statistics
    Route::get('/stats', [StatsController::class, 'index']);

    // Public Practice Areas
    Route::get('/practice-areas', [PracticeAreaController::class, 'index']);
    Route::get('/practice-areas/{slug}', [PracticeAreaController::class, 'show']);

    // Public Attorneys
    Route::get('/attorneys', [AttorneyController::class, 'index']);
    Route::get('/attorneys/{slug}', [AttorneyController::class, 'show']);

    // Public Case Results / Verdicts
    Route::get('/case-results', [CaseResultController::class, 'index']);

    // Public Consultation Leads (Throttled: 6 submissions per min per IP)
    Route::post('/consultations', [ConsultationLeadController::class, 'store'])
        ->middleware('throttle:6,1');

    // ==========================================
    // ADMIN OPERATIONS & CMS ROUTES
    // ==========================================
    Route::prefix('admin')->group(function () {

        // Admin Auth (Public)
        Route::post('/login', [AdminAuthController::class, 'login']);

        // Protected Admin Endpoints (Sanctum)
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AdminAuthController::class, 'me']);
            Route::post('/logout', [AdminAuthController::class, 'logout']);

            // 1. Analytics & Triage Metrics
            Route::get('/analytics', [AdminController::class, 'analytics']);
            Route::get('/dashboard-stats', [AdminController::class, 'analytics']); // Alias

            // 2. Consultation Leads CRM
            Route::get('/leads', [AdminController::class, 'leads']);
            Route::get('/consultation-leads', [AdminController::class, 'leads']); // Alias
            Route::match(['put', 'patch'], '/leads/{lead}/status', [AdminController::class, 'updateLeadStatus']);
            Route::match(['put', 'patch'], '/consultation-leads/{lead}/status', [AdminController::class, 'updateLeadStatus']);
            Route::delete('/leads/{lead}', [AdminController::class, 'deleteLead']);
            Route::delete('/consultation-leads/{lead}', [AdminController::class, 'deleteLead']);

            // 3. Attorneys Directory Management
            Route::get('/attorneys', [AdminController::class, 'attorneys']);
            Route::post('/attorneys', [AdminController::class, 'storeAttorney']);
            Route::put('/attorneys/{attorney}', [AdminController::class, 'updateAttorney']);
            Route::delete('/attorneys/{attorney}', [AdminController::class, 'deleteAttorney']);

            // 4. Practice Areas Management
            Route::get('/practice-areas', [AdminController::class, 'practiceAreas']);
            Route::post('/practice-areas', [AdminController::class, 'storePracticeArea']);
            Route::put('/practice-areas/{practiceArea}', [AdminController::class, 'updatePracticeArea']);
            Route::delete('/practice-areas/{practiceArea}', [AdminController::class, 'deletePracticeArea']);

            // 5. Case Results & Verdicts Management
            Route::get('/case-results', [AdminController::class, 'caseResults']);
            Route::post('/case-results', [AdminController::class, 'storeCaseResult']);
            Route::put('/case-results/{caseResult}', [AdminController::class, 'updateCaseResult']);
            Route::delete('/case-results/{caseResult}', [AdminController::class, 'deleteCaseResult']);

            // 6. Secure Upload Pipeline
            Route::post('/upload', [AdminController::class, 'upload']);
        });
    });

});
