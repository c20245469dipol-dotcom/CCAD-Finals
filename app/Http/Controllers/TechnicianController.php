<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTechnicianRequest;
use App\Models\Technician;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class TechnicianController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Technician::query()->orderBy('name')->get());
    }

    public function store(StoreTechnicianRequest $request): JsonResponse|RedirectResponse
    {
        $technician = Technician::create($request->validated());

        if ($request->header('X-Inertia')) {
            return redirect()->route('dashboard');
        }

        return response()->json($technician, 201);
    }
}
