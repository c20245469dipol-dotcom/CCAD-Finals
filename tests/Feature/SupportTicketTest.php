<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Department;
use App\Models\Employee;
use App\Models\SupportTicket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class SupportTicketTest extends TestCase
{
    use RefreshDatabase;

    public function test_ticket_text_is_stripped_of_html_tags(): void
    {
        $ticket = new SupportTicket([
            'ticket_description' => '<p>Cannot <b>login</b></p>',
            'resolution_notes' => '<em>Password reset</em>',
        ]);

        $this->assertSame('Cannot login', $ticket->ticket_description);
        $this->assertSame('Password reset', $ticket->resolution_notes);
    }

    public function test_resolved_at_is_set_when_ticket_status_changes_to_resolved(): void
    {
        $ticket = $this->makeTicket();

        $ticket->update(['ticket_status' => SupportTicket::STATUS_RESOLVED]);

        $this->assertNotNull($ticket->fresh()->resolved_at);
    }

    public function test_closed_tickets_cannot_be_updated(): void
    {
        $ticket = $this->makeTicket(SupportTicket::STATUS_CLOSED);

        $this->expectException(ValidationException::class);

        $ticket->update(['priority_level' => 'Urgent']);
    }

    public function test_closed_tickets_cannot_be_deleted(): void
    {
        $ticket = $this->makeTicket(SupportTicket::STATUS_CLOSED);

        $this->expectException(ValidationException::class);

        $ticket->delete();
    }

    private function makeTicket(string $status = 'Open'): SupportTicket
    {
        $department = Department::create(['name' => 'IT']);
        $employee = Employee::create([
            'name' => 'Alex Employee',
            'department_id' => $department->id,
        ]);
        $category = Category::create(['name' => 'Access']);

        return SupportTicket::create([
            'employee_id' => $employee->id,
            'category_id' => $category->id,
            'priority_level' => 'Normal',
            'ticket_description' => 'Cannot sign in',
            'ticket_status' => $status,
        ]);
    }
}
