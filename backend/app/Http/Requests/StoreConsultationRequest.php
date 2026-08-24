<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreConsultationRequest extends FormRequest
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
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'practice_area_id' => ['nullable', 'exists:practice_areas,id'],
            'case_details' => ['required', 'string', 'min:10', 'max:5000'],
            'source' => ['nullable', 'string', 'max:100'],
        ];
    }

    /**
     * Custom error messages.
     */
    public function messages(): array
    {
        return [
            'full_name.required' => 'Please provide your full legal name.',
            'email.required' => 'A valid email address is required so we can contact you.',
            'email.email' => 'Please provide a valid email address.',
            'phone.required' => 'A contact telephone number is required.',
            'practice_area_id.exists' => 'The selected practice area is invalid.',
            'case_details.required' => 'Please provide a brief summary of your legal matter.',
            'case_details.min' => 'Please share at least a few details (minimum 10 characters).',
        ];
    }
}
