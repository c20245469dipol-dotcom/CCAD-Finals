<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Department;
use App\Models\Employee;
use App\Models\SupportTicket;
use App\Models\Technician;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SupportTicketControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_employee_can_be_created_through_the_controller(): void
    {
        $this->actingAs(User::factory()->create());
        $department = Department::create(['name' => 'IT']);

        $this->postJson('/employees', [
            'name' => 'Alex Employee',
            'department_id' => $department->id,
        ])
            ->assertCreated()
            ->assertJsonPath('name', 'Alex Employee')
            ->assertJsonPath('department.name', 'IT');
    }

    public function test_employee_can_be_created_from_the_dashboard(): void
    {
        $this->actingAs(User::factory()->create());
        $department = Department::create(['name' => 'IT']);

        $this->post('/employees', [
            'name' => 'Jordan Employee',
            'department_id' => $department->id,
        ], ['X-Inertia' => 'true'])
            ->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('employees', [
            'name' => 'Jordan Employee',
            'department_id' => $department->id,
        ]);
    }

    public function test_technician_can_be_created_from_the_dashboard(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post('/technicians', [
            'name' => 'Morgan Technician',
        ], ['X-Inertia' => 'true'])
            ->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('technicians', [
            'name' => 'Morgan Technician',
        ]);

        $this->get('/dashboard')->assertInertia(fn (Assert $page) => $page
            ->has('technicians', 1));
    }

    public function test_ticket_controller_applies_text_and_resolution_rules(): void
    {
        $this->actingAs(User::factory()->create());
        $department = Department::create(['name' => 'IT']);
        $employee = Employee::create([
            'name' => 'Alex Employee',
            'department_id' => $department->id,
        ]);
        $category = Category::create(['name' => 'Access']);

        $ticketResponse = $this->postJson('/support-tickets', [
            'employee_id' => $employee->id,
            'category_id' => $category->id,
            'priority_level' => 'Normal',
            'ticket_description' => '<p>Cannot <b>login</b></p>',
            'ticket_status' => 'Open',
        ])->assertCreated()
            ->assertJsonPath('ticket_description', 'Cannot login');

        $ticketId = $ticketResponse->json('id');

        $this->patchJson("/support-tickets/{$ticketId}", [
            'ticket_status' => SupportTicket::STATUS_RESOLVED,
            'resolution_notes' => '<em>Password reset</em>',
        ])
            ->assertOk()
            ->assertJsonPath('resolution_notes', 'Password reset')
            ->assertJsonPath('ticket_status', SupportTicket::STATUS_RESOLVED)
            ->assertJsonStructure(['resolved_at']);
    }

    public function test_ticket_can_be_created_from_the_inertia_dashboard(): void
    {
        $this->actingAs(User::factory()->create());
        $department = Department::create(['name' => 'IT']);
        $employee = Employee::create([
            'name' => 'Alex Employee',
            'department_id' => $department->id,
        ]);
        $category = Category::create(['name' => 'Access']);

        $this->from('/dashboard')->post('/support-tickets', [
            'employee_id' => $employee->id,
            'category_id' => $category->id,
            'priority_level' => 'High',
            'ticket_description' => '<p>Cannot <b>login</b></p>',
            'ticket_status' => 'Open',
        ], ['X-Inertia' => 'true'])
            ->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('support_tickets', [
            'employee_id' => $employee->id,
            'category_id' => $category->id,
            'priority_level' => 'High',
            'ticket_description' => 'Cannot login',
            'ticket_status' => 'Open',
        ]);
    }

    public function test_dashboard_supplies_ticket_form_choices_and_ticket_records(): void
    {
        $this->actingAs(User::factory()->create());
        $department = Department::create(['name' => 'IT']);
        $employee = Employee::create([
            'name' => 'Alex Employee',
            'department_id' => $department->id,
        ]);
        $category = Category::create(['name' => 'Access']);
        Technician::create(['name' => 'Sam Technician']);
        SupportTicket::create([
            'employee_id' => $employee->id,
            'category_id' => $category->id,
            'priority_level' => 'Medium',
            'ticket_description' => 'Cannot sign in',
            'ticket_status' => 'Open',
        ]);

        $this->get('/dashboard')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('employees', 1)
            ->has('departments', 1)
            ->has('categories', 1)
            ->has('technicians', 1)
            ->has('allTickets', 1)
            ->has('recentTickets', 1));
    }

    public function test_ticket_can_be_resolved_from_the_dashboard_and_updates_the_counts(): void
    {
        $this->actingAs(User::factory()->create());
        $department = Department::create(['name' => 'IT']);
        $employee = Employee::create([
            'name' => 'Alex Employee',
            'department_id' => $department->id,
        ]);
        $category = Category::create(['name' => 'Access']);
        $ticket = SupportTicket::create([
            'employee_id' => $employee->id,
            'category_id' => $category->id,
            'priority_level' => 'Medium',
            'ticket_description' => 'Cannot sign in',
            'ticket_status' => 'Open',
        ]);

        $this->patch("/support-tickets/{$ticket->id}", [
            'priority_level' => 'High',
            'ticket_status' => SupportTicket::STATUS_RESOLVED,
            'resolution_notes' => '<p>Access restored</p>',
        ], ['X-Inertia' => 'true'])
            ->assertRedirect(route('dashboard'));

        $ticket->refresh();
        $this->assertSame('High', $ticket->priority_level);
        $this->assertSame(SupportTicket::STATUS_RESOLVED, $ticket->ticket_status);
        $this->assertSame('Access restored', $ticket->resolution_notes);
        $this->assertNotNull($ticket->resolved_at);

        $this->get('/dashboard')->assertInertia(fn (Assert $page) => $page
            ->where('ticketStats.resolved', 1)
            ->where('ticketStats.highPriority', 1));
    }

    public function test_controller_rejects_edits_to_closed_tickets(): void
    {
        $this->actingAs(User::factory()->create());
        $department = Department::create(['name' => 'IT']);
        $employee = Employee::create([
            'name' => 'Alex Employee',
            'department_id' => $department->id,
        ]);
        $category = Category::create(['name' => 'Access']);
        $ticket = SupportTicket::create([
            'employee_id' => $employee->id,
            'category_id' => $category->id,
            'priority_level' => 'Normal',
            'ticket_description' => 'Cannot sign in',
            'ticket_status' => SupportTicket::STATUS_CLOSED,
        ]);

        $this->patchJson("/support-tickets/{$ticket->id}", [
            'priority_level' => 'Urgent',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('ticket_status');
    }
}
