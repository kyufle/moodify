<?php

namespace Database\Seeders;

use App\Models\User;
use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Valeria',
            'email' => 'valeria@gmail.com',
            'password' => Hash::make('test'),
            'type_user' => 'admin',
            'username' => 'valeria',
            'image_id' => 'avatar26'
        ]);

        User::factory()->create([
            'name' => 'Ruth',
            'email' => 'ruth@gmail.com',
            'password' => Hash::make('test'),
            'type_user' => 'admin',
            'username' => 'ruth',
            'image_id' => 'avatar26'
        ]);

         User::factory()->create([
            'name' => 'pablo',
            'email' => 'pablo@gmail.com',
            'password' => Hash::make('test'),
            'type_user' => 'admin',
            'username' => 'pablo',
            'image_id' => 'avatar26'
        ]);
    }
}
