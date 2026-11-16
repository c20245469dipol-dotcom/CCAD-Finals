<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupportTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => ['required', 'integer', 'exists:employees,id'],
            'technician_id' => ['nullable', 'integer', 'exists:technicians,id'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'priority_level' => ['required', 'string', 'max:100'],
            'ticket_description' => ['required', 'string'],
            'resolution_notes' => ['nullable', 'string'],
            'ticket_status' => ['required', 'string', 'max:100'],
        ];
    }
}
