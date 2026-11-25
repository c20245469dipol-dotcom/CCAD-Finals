<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\SupportTicketController;
use App\Models\Category;
use App\Models\Employee;
use App\Models\SupportTicket;
use App\Models\Technician;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/dashboard')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        $allTickets = SupportTicket::query()
            ->with(['employee.department', 'technician', 'category'])
            ->latest()
            ->get()
            ->map(fn (SupportTicket $ticket) => [
                'id' => $ticket->id,
                'employeeId' => $ticket->employee_id,
                'categoryId' => $ticket->category_id,
                'technicianId' => $ticket->technician_id,
                'category' => $ticket->category?->name ?? 'Uncategorized',
                'employee' => $ticket->employee?->name ?? 'Unknown employee',
                'technician' => $ticket->technician?->name,
                'description' => $ticket->ticket_description,
                'resolutionNotes' => $ticket->resolution_notes,
                'priority' => $ticket->priority_level,
                'status' => $ticket->ticket_status,
                'createdAt' => $ticket->created_at?->format('M j, Y h:i A'),
            ]);

        return Inertia::render('dashboard', [
            'ticketStats' => [
                'total' => SupportTicket::count(),
                'open' => SupportTicket::where('ticket_status', 'Open')->count(),
                'resolved' => SupportTicket::where('ticket_status', 'Resolved')->count(),
                'highPriority' => SupportTicket::where('priority_level', 'High')->count(),
            ],
            'recentTickets' => $allTickets->take(5)->values(),
            'allTickets' => $allTickets,
            'employees' => Employee::query()
                ->with('department:id,name')
                ->orderBy('name')
                ->get(['id', 'name', 'department_id'])
                ->map(fn (Employee $employee) => [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'department' => $employee->department?->name,
                ]),
            'categories' => Category::query()
                ->orderBy('name')
                ->get(['id', 'name']),
            'technicians' => Technician::query()
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    })->name('dashboard');

    Route::apiResource('employees', EmployeeController::class);
    Route::apiResource('support-tickets', SupportTicketController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
