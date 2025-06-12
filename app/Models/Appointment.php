<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'date',
        'time',
        'status',
        'notes' 
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'time' => 'string',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function treatments(): HasMany
    {
        return $this->hasMany(TreatmentRecord::class);
    }
    public function isPastDue()
    {
        $appointmentDateTime = Carbon::parse($this->date->format('Y-m-d') . ' ' . $this->time);
        return now()->gt($appointmentDateTime);
    }

}