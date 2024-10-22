<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
{

    $request->validate([
        'id_number' => 'required|integer|unique:users',
        'firstName' => 'required|string|max:255',
        'lastName' => 'required|string|max:255',
        'middleName' => 'nullable|string|max:255',
        'gender' => 'required|in:male,female',
        'role' => 'required|in:student,employee',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => ['required', 'confirmed', Rules\Password::defaults()],
    ]);

    $user = User::create([
        'id_number' => $request->id_number,
        'firstName' => $request->firstName,
        'lastName' => $request->lastName,
        'middleName' => $request->middleName,
        'is_approved' => 0,
        'gender' => $request->gender,
        'role' => $request->role,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    event(new Registered($user));

    // Log the user in
    if($user->is_approved == 1) {

        Auth::login($user);
        
        return redirect()->intended(route('dashboard'));
    }

    return redirect()->route('pending-approval');
}

}