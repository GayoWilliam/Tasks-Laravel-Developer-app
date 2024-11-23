<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Priority;
use App\Models\Task;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $projects = Project::with('tasks')->get();
        $priorities = Priority::all();
        $tasks = Task::with(['priority', 'project'])->get();

        return Inertia::render('Dashboard', [
            'projects' => $projects,
            'priorities' => $priorities,
            'tasks' => $tasks,
        ]);
    }
}
