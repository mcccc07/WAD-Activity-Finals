<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin Account - only create if doesn't exist
        User::firstOrCreate(
            ['email' => 'macrobert@admin.com'],
            [
                'name' => 'Admin Mac',
                'password' => Hash::make('maki1234'),
                'remember_token' => Str::random(10),
                'role' => 'admin'
            ]
        );

        // Only seed users if less than 10 exist
        if (User::where('role', 'user')->count() < 10) {
            User::factory(100)->create([
                'role' => 'user'
            ]);
        }
    }
}