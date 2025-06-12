<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePatientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'contact_info' => 'required|string|max:20',
            'address' => 'required|string|max:100',
            'age' => 'required|integer|min:0|max:120',
            'gender' => 'required|in:M,F',
            'medical_history' => 'nullable|string',
            'file_number' => 'required|string|max:20|', 
        ];
    }
}
