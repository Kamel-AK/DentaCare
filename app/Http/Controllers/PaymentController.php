<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Payment;
use App\Models\TreatmentRecord;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request , Patient $patient)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'notes' => 'nullable|string',
            'treatment_record_id' => 'required|exists:treatment_records,id',
            'patient_id' => 'required|exists:patients,id'
        ]);
        $validated['patient_id'] = $patient->id;

        // Create payment
        $payment = Payment::create($validated);

        // Update treatment payment status
        $treatment = TreatmentRecord::findOrFail($validated['treatment_record_id']);
        $totalPaid = $treatment->payments()->sum('amount');
        
        if($totalPaid >= $treatment->cost) {
            $status = 'paid';
        } elseif($totalPaid > 0) {
            $status = 'partially_paid';
        } else {
            $status = 'unpaid';
        }
        $treatment->update(['payment_status' => $status]);

        return redirect()->back()->with('success', 'Payment recorded successfully');
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
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
