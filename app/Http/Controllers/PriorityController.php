<?php

namespace App\Http\Controllers;
use App\Models\Priority;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PriorityController extends Controller
{
    public function index()
    {
        $priorities = Priority::all();
        return Inertia::render('Dashboard', props: ['priorities' => $priorities]);
    }
}
