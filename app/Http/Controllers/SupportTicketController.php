<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupportTicketRequest;
use App\Http\Requests\UpdateSupportTicketRequest;
use App\Models\SupportTicket;
use App\Services\SupportTicketService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class SupportTicketController extends Controller
{
    public function __construct(private readonly SupportTicketService $ticketService) {}

    public function index(): JsonResponse
    {
        return response()->json(
            SupportTicket::with(['employee.department', 'technician', 'category'])->get()
        );
    }

    public function store(StoreSupportTicketRequest $request): JsonResponse|RedirectResponse
    {
        $ticket = $this->ticketService->create($request->validated());

        if ($request->header('X-Inertia')) {
            return redirect()->route('dashboard');
        }

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

    public function update(UpdateSupportTicketRequest $request, SupportTicket $supportTicket): JsonResponse|RedirectResponse
    {
        $this->ticketService->update(
            $supportTicket,
            $request->validated()
        );

        if ($request->header('X-Inertia')) {
            return redirect()->route('dashboard');
        }

        return response()->json(
            $supportTicket->load(['employee.department', 'technician', 'category'])
        );
    }

    public function destroy(SupportTicket $supportTicket): JsonResponse
    {
        $this->ticketService->delete($supportTicket);

        return response()->json(status: 204);
    }
}
