<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use Inertia\Inertia;

class AdminLoginController extends Controller
{
    // Show the login form
    public function showLoginForm()
    {
        return Inertia::render('Admin/LoginPage'); // Ensure this path matches the location of LoginPage.jsx
    }

    // Handle admin login
    public function login(Request $request)
    {
        // Validate the request
        $request->validate([
            'id_number' => 'required|string',
            'password' => 'required|string',
        ]);
    
        // Attempt to login the admin
        $credentials = $request->only('id_number', 'password');
    
        $admin = Admin::where('id_number', $credentials['id_number'])->first();
        
        if ($admin && Hash::check($credentials['password'], $admin->password)) {
            // Use the custom admin guard
            Auth::guard('admin')->login($admin); 
    
            return redirect()->intended(route('admin.dashboard'));
        } else {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }
    
        // Log::info('Login attempt for ID: ' . $request->id_number);

        // $request->validate([
        //     'id_number' => 'required|string',
        //     'password' => 'required|string',
        // ]);

        // $admin = Admin::where('id_number', $request->id_number)->first();

        // if ($admin) {
        //     Log::info('Admin found: ' . $admin->id);

        //     if (Hash::check($request->password, $admin->password)) {
        //         Auth::guard('admin')->login($admin);
        //         Log::info('Login successful for admin: ' . $admin->id);
        //         return response()->json(['message' => 'Login successful', 'redirect' => route('admin.dashboard')]);
        //     } else {
        //         Log::warning('Password mismatch for admin: ' . $admin->id);
        //         return response()->json(['errors' => ['password' => 'Invalid password.']], 422);
        //     }
        // } else {
        //     Log::warning('Admin not found with ID number: ' . $request->id_number);
        //     return response()->json(['errors' => ['id_number' => 'Invalid ID number.']], 422);
        // }
    }


}