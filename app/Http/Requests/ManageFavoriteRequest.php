<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ManageFavoriteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'food_id' => [
                'required',
                'integer',
                'exists:foods,id'
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'food_id.required' => 'ID makanan harus disertakan.',
            'food_id.exists' => 'Makanan yang dipilih tidak valid.',
        ];
    }
}
