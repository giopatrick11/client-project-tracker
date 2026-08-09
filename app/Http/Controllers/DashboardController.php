<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'total' => Project::count(),

            'inProgress' => Project::where(
                'status',
                'In Progress',
            )->count(),

            'completed' => Project::where(
                'status',
                'Completed',
            )->count(),
        ]);
    }
}
