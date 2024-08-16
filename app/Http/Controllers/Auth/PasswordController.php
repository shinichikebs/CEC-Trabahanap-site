<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
{
    // If the user has a password, validate current password
    if ($request->user()->password) {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);
    } else {
        // Validate only new password and confirmation if no password exists
        $validated = $request->validate([
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);
    }

    $request->user()->update([
        'password' => Hash::make($validated['password']),
    ]);

    return back();
}


}
