<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\Fluent\Concerns\Has;
use Pest\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //Admin Account
        User::create([
            'name' => 'Admin Mac',
            'email' => 'macrobert@admin.com',
            'password' => Hash::make('maki1234'),
            'remember_token' => Str::random(10),
            'role' => 'admin'
        ]);

        //User seed data using Factory
        User::factory(100)->create([
            'role' => 'user'
        ]);
    }
}
