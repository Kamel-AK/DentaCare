<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Http\Resources\PatientResource;
use App\Models\Appointment;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
            $query = Patient::query();
        
        // Get sort parameters with defaults
        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');

        // Search filter
        if (request("name")) {
            $query->where("name", "like", "%".request("name")."%");
        }

        // Pagination with query preservation
        $patients = $query->orderBy($sortField, $sortDirection)
            ->paginate(20)
            ->appends(request()->query());

        return inertia("Patient/Index", [
            "patients" => PatientResource::collection($patients),
            'queryParams' => request()->query() ?: [], // Never return null
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return inertia('Patient/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePatientRequest $request)
    {
        //
        $data = $request->validated();
        Patient::create($data);
        return to_route('patient.index')->with('success', 'Patient was created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Patient $patient)
    {
        return inertia('Patient/Show', [
            'patient' => new PatientResource($patient),
            'appointments' => $patient->appointments()
                ->with(['treatments.payments']) 
                ->get(),
            'treatments' => $patient->treatmentRecords()
                ->with(['payments']) 
                ->latest()
                ->take(5)
                ->get(),
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient)
    {
        return inertia('Patient/Edit',[
            'patient'=> new PatientResource($patient)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePatientRequest $request, Patient $patient)
    {
        $data = $request->validated();
        $patient->update($data);
        return to_route('patient.index')
            ->with('success', "Patient \"$patient->name\" was updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patient $patient)
    {
        $name= $patient->name;
        $patient->delete();
        return to_route('patient.index')->with('success', "patient\"$name\" was deleted");
    }
}
