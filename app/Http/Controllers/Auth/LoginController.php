<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class LoginController extends Controller
{
    /**
     * Show the login view.
     */
    public function showLoginForm(): Response
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle an incoming login request.
     */
    public function login(Request $request)
    {
        // Validate request inputs
        $request->validate([
            'id_number' => 'required|integer',
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Fetch user by email
        $user = User::where('email', $request->email)->first();

        // Check if the user exists and has an ID number
        if ($user) {
            if (is_null($user->id_number)) {
                // User logged in via Google, no id_number present
                return back()->withErrors([
                    'email' => 'This account was created using Google login. Please use "Continue with Google" to access your account.',
                ]);
            }

            // Attempt login if id_number is present
            if (Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
                $request->session()->regenerate();
                return redirect()->intended('dashboard');
            }
        }

        // If user is not found or credentials do not match
        return back()->withErrors([
            'id_number' => 'The provided credentials do not match our records.',
        ]);
    }

    /**
     * Handle an incoming logout request.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
