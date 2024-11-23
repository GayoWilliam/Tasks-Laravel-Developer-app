<?php

namespace App\Http\Controllers;
use App\Models\Task;
use App\Models\Priority;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::with(['priority', 'project'])->get();
        return Inertia::render(component: 'Dashboard', props: ['tasks' => $tasks]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:' . Task::class,
            'priority' => 'required|integer|exists:priorities,id',
            'project' => 'required|integer|exists:projects,id',
        ]);

        if ($validated){
            Task::create([
                'name' => $validated['name'],
                'priority_id' => $validated['priority'],
                'project_id' => $validated['project']
            ]);

            return back()->with('success', 'Successfully created task');
        }else{
            return back()->with('error', 'Error creating task');
        }
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:tasks,name,' . $task->id,
            'priority' => 'sometimes|string|max:255',
            'project' => 'sometimes|string|max:255',
        ]);

        if (isset($validated['priority'])) {
            $priority = Priority::where('name', $validated['priority'])->first();

            if (!$priority) {
                return back()->with('error', 'Failed to update task');
            }

            unset($validated['priority']);
            $validated['priority_id'] = $priority->id;
        }

        if (isset($validated['project'])) {
            $project = Project::where('name', $validated['project'])->first();

            if (!$project) {
                return back()->with('error', 'Failed to update task');
            }

            unset($validated['project']);
            $validated['project_id'] = $project->id;
        }

        $task->update($validated);

        return back()->with('success', 'Successfully updated task');
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return back()->with('success', 'Successfully deleted task');
    }
}
