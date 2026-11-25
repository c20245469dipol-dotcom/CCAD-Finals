<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Technician;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (! User::where('email', 'test@example.com')->exists()) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }

        $department = Department::firstOrCreate(['name' => 'Information Technology']);

        foreach ([
            'Alex Morgan' => 'Jayson',
            'Jamie Chen' => 'Emman',
            'Taylor Brooks' => 'Aljon',
        ] as $oldName => $name) {
            Employee::where('name', $oldName)->update(['name' => $name]);

            Employee::firstOrCreate([
                'name' => $name,
                'department_id' => $department->id,
            ]);
        }

        foreach (['Account Access', 'Hardware Issue', 'Software Support', 'Network Connectivity'] as $name) {
            Category::firstOrCreate(['name' => $name]);
        }

        foreach (['Sam Rivera', 'Jordan Lee', 'Casey Patel'] as $name) {
            Technician::firstOrCreate(['name' => $name]);
        }
    }
}
