<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userData = [
            [
                'id_number' => '05173922',
                'firstName' => 'Lyell',
                'lastName' => 'Sumaylo',
                'email' => 'lyell2023@gmail.com',
                'password' => bcrypt('123'),
                'role' => 'Student',
                'gender' => 'Female',

            ],

            [
                'id_number' => '05173923',
                'firstName' => 'Aj',
                'lastName' => 'Sumngat',
                'email' => 'aketchup305@gmail.com',
                'password' => bcrypt('123'),
                'role' => 'Student',
                'gender' => 'Male',

            ],

            [
                'id_number' => '05173924',
                'firstName' => 'Mari',
                'lastName' => 'Cooper',
                'email' => 'maricooper@gmail.com',
                'password' => bcrypt('admin123'),
                'role' => 'Employee',
                'gender' => 'Female',

            ],

        ];

        foreach ($userData as $user) {
            User::insert([
                ...$user,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}