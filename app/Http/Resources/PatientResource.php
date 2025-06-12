<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=> $this->id,
            'name'=> $this->name,
            'contact_info'=> $this->contact_info,
            'address'=>$this->address,
            'medical_history'=>$this->medical_history,
            'file_number'=> $this->file_number,
            'age'=> $this->age,
            'gender'=>$this->gender,
            'created_at'=>(new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at'=>(new Carbon($this->created_at))->format('Y-m-d'),

        ];
    }
}
