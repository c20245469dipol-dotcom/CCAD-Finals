<?php

namespace App\Services;

use App\Models\SupportTicket;
use Illuminate\Validation\ValidationException;

class SupportTicketService
{
    public function create(array $attributes): SupportTicket
    {
        $this->sanitizeTextAttributes($attributes);
        unset($attributes['resolved_at']);

        if (($attributes['ticket_status'] ?? null) === SupportTicket::STATUS_RESOLVED) {
            $attributes['resolved_at'] = now();
        }

        return SupportTicket::create($attributes);
    }

    public function update(SupportTicket $ticket, array $attributes): SupportTicket
    {
        if ($ticket->ticket_status === SupportTicket::STATUS_CLOSED) {
            throw ValidationException::withMessages([
                'ticket_status' => 'Closed tickets cannot be edited.',
            ]);
        }

        $this->sanitizeTextAttributes($attributes);
        unset($attributes['resolved_at']);

        $status = $attributes['ticket_status'] ?? $ticket->ticket_status;
        if ($status === SupportTicket::STATUS_RESOLVED && $ticket->resolved_at === null) {
            $attributes['resolved_at'] = now();
        }

        $ticket->update($attributes);

        return $ticket;
    }

    public function delete(SupportTicket $ticket): void
    {
        if ($ticket->ticket_status === SupportTicket::STATUS_CLOSED) {
            throw ValidationException::withMessages([
                'ticket_status' => 'Closed tickets cannot be deleted.',
            ]);
        }

        $ticket->delete();
    }

    private function sanitizeTextAttributes(array &$attributes): void
    {
        foreach (['ticket_description', 'resolution_notes'] as $attribute) {
            if (array_key_exists($attribute, $attributes)) {
                $attributes[$attribute] = $attributes[$attribute] === null
                    ? null
                    : strip_tags($attributes[$attribute]);
            }
        }
    }
}
