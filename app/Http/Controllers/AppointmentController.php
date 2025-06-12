<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $appointments = Appointment::with('patient')
        ->whereMonth('date', now()->month)
        ->orderBy('date')
        ->orderBy('time')
        ->paginate(100)
        ->through(function ($appointment) {
            return [
                'id' => $appointment->id,
                'date' => $appointment->date->format('Y-m-d'),
                'time' => $appointment->time,
                'status' => $appointment->status,
                'notes' => $appointment->notes,
                'patient' => $appointment->patient->only('id', 'name', 'file_number'),
                'created_at' => $appointment->created_at->diffForHumans(),
            ];
        });

        return Inertia::render('Appointments/Index', [
            'appointments' => $appointments,
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Patient $patient)
    {
        return Inertia::render('Appointments/Create', [
            'patient' => $patient->only('id', 'name', 'file_number'),
            'statusOptions' => [
                'مجدول' => 'مجدول',
                'مكتمل' => 'مكتمل',
                'تم الإلغاء' => 'تم الإلغاء',
                'لايوجد' => 'لايوجد'
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request ,  Patient $patient)
    {
        // Validate the request data
        $validated = $request->validate([
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'status' => 'required|in:مجدول,مكتمل,تم الإلغاء,لايوجد',
            'notes' => 'nullable|string|max:500'
        ]);

        // Create the appointment for the patient
        $appointment = $patient->appointments()->create([
            'date' => $validated['date'],
            'time' => $validated['time'],
            'status' => $validated['status'],
            'notes' => $validated['notes']
        ]);

        // Redirect back to the create form with success message
        return redirect()
            ->route('patient.appointments.create', $patient)
            ->with('success', 'تم إنشاء الموعد بنجاح!');
    }

    /**
     * Display the specified resource.
     */
    public function show( Appointment $appointment,Patient $patient)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit( Patient $patient , Appointment $appointment)
    {
        return Inertia::render('Appointments/Edit', [
            'patient' => $patient->only('id', 'name', 'file_number'),
            'appointment' => [
                'id' => $appointment->id,
                'date' => $appointment->date instanceof \Carbon\Carbon 
                    ? $appointment->date->format('Y-m-d')
                    : $appointment->date,
                'time' => $appointment->time,
                'status' => $appointment->status,
                'notes' => $appointment->notes,
                'is_past_due' => $appointment->isPastDue()
            ],
            'statusOptions' => [
                ['value' => 'مجدول', 'label' => 'مجدول'],
                ['value' => 'مكتمل', 'label' => 'مكتمل'],
                ['value' => 'تم الإلغاء', 'label' => 'تم الإلغاء'],
                ['value' => 'لايوجد', 'label' => 'لايوجد']
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Patient $patient, Appointment $appointment)
    {
        $validated = $request->validate([
            'date' => 'required|date_format:Y-m-d',
            'time' => 'required|date_format:H:i',
            'status' => 'required|in:مجدول,مكتمل,تم الإلغاء,لايوجد',
            'notes' => 'nullable|string|max:500'
        ]);
    
        // Format time properly
        $validated['time'] = Carbon::createFromFormat('H:i', $validated['time'])->format('H:i:s');
    
        $appointment->update($validated);
    
        return redirect()
            ->route('patient.show', $patient)
            ->with('success', 'تم تحديث الموعد بنجاح!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patient $patient,Appointment $appointment)
    {
        $appointment->delete();
        return redirect()
        ->route('patient.show', $patient)
        ->with('success', 'تم حذف الموعد بنجاح');
    }
}
