<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\TreatmentRecord;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class TreatmentRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // TreatmentRecordController.php
    public function index(Patient $patient)
    {
        return inertia('Treatment/Index', [
            'patient' => $patient,
            'treatments' => $patient->treatmentRecords()
                ->with(['appointment', 'payments'])
                ->latest()
                ->paginate(10)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Patient $patient)
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request , Patient $patient)
    {   
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'name' => 'required|string|max:50',
            'description' => 'nullable|string',
            'tooth_number' => 'nullable|string|max:50',
            'cost' => 'required|numeric|min:0|max:999999.99',
            'payment_status' => 'required|in:unpaid,partially_paid,paid',
            'status' => 'required|in:مخطط,قيد التنفيذ,مكتمل,ملغى',
        ]);
        try {
            DB::transaction(function () use ($validated) {
                TreatmentRecord::create($validated);
            });
            
            return redirect()->back()
                ->with('success', 'Treatment plan created successfully');
                
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error creating treatment: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient, TreatmentRecord $treatment)
    {
        return inertia('Treatments/Edit', [
            'treatment' => $treatment,
            'patient' => $patient
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update (Request $request, Patient $patient, TreatmentRecord $treatment)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'description' => 'nullable|string',
            'tooth_number' => 'nullable|string|max:50',
            'cost' => 'required|numeric|min:0|max:999999.99',
            'payment_status' => 'required|in:unpaid,partially_paid,paid',
            'status' => 'required|in:مخطط,قيد التنفيذ,مكتمل,ملغى',
        ]);
    
        try {
            DB::transaction(function () use ($validated, $treatment) {
                $treatment->update($validated);
            });
            
            return redirect()->back()
                ->with('success', 'Treatment updated successfully');
                
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error updating treatment: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patient $patient, TreatmentRecord $treatment)
    {
        try {
            $treatment->delete();
            return redirect()->back()
                ->with('success', 'Treatment deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error deleting treatment: ' . $e->getMessage());
        }
    }

    
}
