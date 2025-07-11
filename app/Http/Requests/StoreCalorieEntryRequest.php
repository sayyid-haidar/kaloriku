<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCalorieEntryRequest extends FormRequest
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
            'portion' => [
                'required',
                'numeric',
                'min:0.1',
                'max:9999.99'
            ],
            'entry_date' => [
                'nullable',
                'date',
                'before_or_equal:today',
                'after_or_equal:' . now()->subYears(1)->toDateString()
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'food_id.required' => 'Makanan harus dipilih.',
            'food_id.exists' => 'Makanan yang dipilih tidak valid.',
            'portion.required' => 'Porsi makanan harus diisi.',
            'portion.numeric' => 'Porsi harus berupa angka.',
            'portion.min' => 'Porsi minimal adalah 0.1 gram.',
            'portion.max' => 'Porsi maksimal adalah 9999.99 gram.',
            'entry_date.date' => 'Format tanggal tidak valid.',
            'entry_date.before_or_equal' => 'Tanggal tidak boleh di masa depan.',
            'entry_date.after_or_equal' => 'Tanggal tidak boleh lebih dari 1 tahun yang lalu.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure portion is properly formatted
        if ($this->has('portion')) {
            $this->merge([
                'portion' => (float) $this->input('portion')
            ]);
        }

        // Set default entry_date if not provided
        if (!$this->has('entry_date') || empty($this->input('entry_date'))) {
            $this->merge([
                'entry_date' => now()->toDateString()
            ]);
        }
    }
}
