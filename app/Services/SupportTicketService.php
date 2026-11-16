<?php

namespace App\Services;

use App\Models\SupportTicket;

class SupportTicketService
{
    public function update(SupportTicket $ticket, array $attributes): SupportTicket
    {
        $ticket->update($attributes);

        return $ticket;
    }
}
