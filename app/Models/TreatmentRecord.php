<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class TreatmentRecord extends Model
{
    /** @use HasFactory<\Database\Factories\TreatmentRecordFactory> */
    use HasFactory;
    protected $fillable = [
        'patient_id',
        'appointment_id',
        'name',
        'description',
        'tooth_number',
        'cost',
        'payment_status',
        'status'
    ];
    protected $casts = [
        'cost' => 'float'
    ];
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
