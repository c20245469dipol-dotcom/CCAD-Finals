<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class EmployeeController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Employee::with('department')->get()
        );
    }

    public function store(StoreEmployeeRequest $request): JsonResponse|RedirectResponse
    {
        $employee = Employee::create($request->validated());

        if ($request->header('X-Inertia')) {
            return redirect()->route('dashboard');
        }

        return response()->json($employee->load('department'), 201);
    }

    public function show(Employee $employee): JsonResponse
    {
        return response()->json($employee->load('department'));
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee): JsonResponse
    {
        $employee->update($request->validated());

        return response()->json($employee->load('department'));
    }

    public function destroy(Employee $employee): JsonResponse
    {
        $employee->delete();

        return response()->json(status: 204);
    }
}
