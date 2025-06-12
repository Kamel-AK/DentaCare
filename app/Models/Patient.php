<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Patient extends Model
{
    /** @use HasFactory<\Database\Factories\PatientFactory> */
    use HasFactory ; use Searchable;
    protected $fillable = ['name','contact_info','address','age','gender','medical_history','file_number'];
    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'file_number' => $this->file_number,
            'contact_info' => $this->contact_info,
            'age' => $this->age,
        ];
    }
    public function appointments() : HasMany{
        return $this->hasMany(Appointment::class);
    }
    public function surgery(){
        return $this->hasMany(Surgery::class);
    }
    public function treatmentRecords(){
        return $this->hasMany(TreatmentRecord::class);
    }
    public function payment(){
        return $this->hasMany(Payment::class);
    }
    
}
