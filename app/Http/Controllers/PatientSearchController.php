<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Http\Resources\PatientResource;
use Illuminate\Http\Request;

class PatientSearchController extends Controller
{
    public function index()
    {
        return inertia("Search", [
            'initialResults' => PatientResource::collection(collect()),
        ]);
    }
    
    public function search(Request $request)
    {
        $query = $request->input('query');
    
        if (empty($query)) {
            return response()->json([
                'patients' => PatientResource::collection(collect()),
            ]);
        }
        
        $patients = Patient::search($query)
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get();
            
        return response()->json([
            'patients' => PatientResource::collection($patients),
        ]);
    }
}