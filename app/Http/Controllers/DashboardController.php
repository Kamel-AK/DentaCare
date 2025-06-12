<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Appointment;
use App\Models\TreatmentRecord;
use App\Models\Payment;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $monthStart = Carbon::now()->startOfMonth();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalPatients' => Patient::count(), // camelCase
                'appointmentsToday' => Appointment::whereDate('date', $today)->count(),
                'unpaidTreatments' => TreatmentRecord::where('payment_status', '!=', 'paid')->count(),
                'paymentsThisMonth' => Payment::where('payment_date', '>=', $monthStart)->sum('amount'),
            ],
            'recent' => [
                'appointments' => Appointment::with('patient')->orderBy('date', 'desc')->take(5)->get(),
                'treatments' => TreatmentRecord::with('patient')->orderBy('created_at', 'desc')->take(5)->get(),
                'payments' => Payment::with(['patient', 'treatmentRecord'])->orderBy('payment_date', 'desc')->take(5)->get(),
            ]
        ]);
    }
}