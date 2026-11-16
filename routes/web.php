<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\SupportTicketController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('dashboard');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::apiResource('employees', EmployeeController::class);
    Route::apiResource('support-tickets', SupportTicketController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
