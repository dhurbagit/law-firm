<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Fallback login route to ensure route('login') is defined
Route::get('/login', function () {
    return response()->json([
        'success' => false,
        'message' => 'Unauthenticated. Please login via POST /api/v1/admin/login or visit the CMS login page at http://localhost:3001/admin/login',
    ], 401);
})->name('login');
