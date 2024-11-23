<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('projects')->insert([
            ['name' => 'Project Alpha', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Project Beta', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Project Gamma', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
