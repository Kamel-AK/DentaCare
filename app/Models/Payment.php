<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentFactory> */
    use HasFactory;
    protected $fillable = [
        'patient_id',
        'treatment_record_id',
        'amount',
        'payment_date',
        'status',
        'note'
    ];

    protected $casts = [
        'payment_date' => 'datetime',
        'amount' => 'float'
    ];
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function treatmentRecord()
    {
        return $this->belongsTo(TreatmentRecord::class);
    }
    public function treatments()
    {
        return $this->hasMany(TreatmentRecord::class);
    }
}
