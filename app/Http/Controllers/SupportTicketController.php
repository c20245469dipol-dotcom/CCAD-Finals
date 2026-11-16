<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupportTicketRequest;
use App\Http\Requests\UpdateSupportTicketRequest;
use App\Models\SupportTicket;
use App\Services\SupportTicketService;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class SupportTicketController extends Controller
{
    public function __construct(private readonly SupportTicketService $ticketService) {}

    public function index(): JsonResponse
    {
        return response()->json(
            SupportTicket::with(['employee.department', 'technician', 'category'])->get()
        );
    }

    public function store(StoreSupportTicketRequest $request): JsonResponse
    {
        $ticket = SupportTicket::create($request->validated());

        return response()->json(
            $ticket->load(['employee.department', 'technician', 'category']),
            201
        );
    }

    public function show(SupportTicket $supportTicket): JsonResponse
    {
        return response()->json(
            $supportTicket->load(['employee.department', 'technician', 'category'])
        );
    }

    public function update(UpdateSupportTicketRequest $request, SupportTicket $supportTicket): JsonResponse
    {
        $this->ticketService->update(
            $supportTicket,
            $request->validated()
        );

        return response()->json(
            $supportTicket->load(['employee.department', 'technician', 'category'])
        );
    }

    public function destroy(SupportTicket $supportTicket): JsonResponse
    {
        if ($supportTicket->ticket_status === SupportTicket::STATUS_CLOSED) {
            throw ValidationException::withMessages([
                'ticket_status' => 'Closed tickets cannot be edited or deleted.',
            ]);
        }

        $supportTicket->delete();

        return response()->json(status: 204);
    }
}
