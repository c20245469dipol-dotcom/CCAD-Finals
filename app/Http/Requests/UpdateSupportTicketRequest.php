<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSupportTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => ['sometimes', 'required', 'integer', 'exists:employees,id'],
            'technician_id' => ['sometimes', 'nullable', 'integer', 'exists:technicians,id'],
            'category_id' => ['sometimes', 'required', 'integer', 'exists:categories,id'],
            'priority_level' => ['sometimes', 'required', 'string', 'max:100'],
            'ticket_description' => ['sometimes', 'required', 'string'],
            'resolution_notes' => ['sometimes', 'nullable', 'string'],
            'ticket_status' => ['sometimes', 'required', 'string', 'max:100'],
        ];
    }
}
