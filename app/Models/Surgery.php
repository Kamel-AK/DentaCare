<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Surgery extends Model
{
    /** @use HasFactory<\Database\Factories\SurgeryFactory> */
    use HasFactory;
    protected $fillable = [
        'patient_id',
        'date',
        'description',
        'cost',
        'status'
    ];
    protected $casts = [
        'date' => 'datetime'
    ];
    
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
