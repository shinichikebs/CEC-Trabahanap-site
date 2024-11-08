<?php

namespace App\Http\Controllers\Auth;

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
        return Inertia::render('Admin/LoginPage');
    }

    // Handle admin login
    // In AdminLoginController.php

public function login(Request $request)
{
    $request->validate([
        'id_number' => 'required|string',
        'password' => 'required|string',
    ]);

    $credentials = $request->only('id_number', 'password');
    $admin = Admin::where('id_number', $credentials['id_number'])->first();

    if ($admin && Hash::check($credentials['password'], $admin->password)) {
        Auth::guard('admin')->login($admin); 
        
        return redirect()->intended(route('admin.dashboardAdmin'))->with([
            'role' => $admin->role  // Pass role to frontend
        ]);
    } else {
        return back()->withErrors(['id_number' => 'Invalid credentials']);
    }
}

    
    // Handle admin logout
    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        return redirect()->route('admin.login');
    }
}
