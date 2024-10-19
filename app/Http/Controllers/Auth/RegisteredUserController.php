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
    // Log the incoming request data
    \Log::info('Request data:', $request->all());

    // Validate the incoming request
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

    // Log the validated data
    \Log::info('Validated data:', $request->all());

    // Create a new user
    $user = User::create([
        'id_number' => $request->id_number,
        'firstName' => $request->firstName,
        'lastName' => $request->lastName,
        'middleName' => $request->middleName,
        'gender' => $request->gender,
        'role' => $request->role,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    // Fire the Registered event
    event(new Registered($user));

    // Log the user creation
    \Log::info('User created:', $user->toArray());

    // Log the user in
    Auth::login($user);

    // Redirect to pending approval page
    return redirect()->route('pending-approval');
}

}