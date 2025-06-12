<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PatientSearchController ;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TreatmentRecordController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/dashboard');
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth','verified'])->group(function(){
    Route::resource('patient',PatientController::class);
    Route::resource('patient.appointments',AppointmentController::class);
    Route::resource('patients.treatments', TreatmentRecordController::class)->only(['index', 'edit', 'update', 'destroy']);
    Route::resource('patients.payments',PaymentController::class);
    Route::get('/patients/search', [PatientSearchController::class, 'index'])->name('patient.search');
    Route::post('/patients/search', [PatientSearchController::class, 'search'])->name('patient.search.query');
});
Route::resource('appointments', AppointmentController::class)
    ->only(['index', 'create', 'store', 'edit', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    
});

require __DIR__.'/auth.php';
