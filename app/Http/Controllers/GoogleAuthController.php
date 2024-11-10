<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect() 
    {
        return Socialite::driver('google')->redirect();
    }

    public function callbackGoogle()
    {
        try {
            $google_user = Socialite::driver('google')->user();

            // Check if the email domain is allowed
            if (!Str::endsWith($google_user->email, 'cec.edu.ph')) {
                return redirect()->route('login')->with('error', 'Email domain not allowed.');
            }

            $user = User::where('email', $google_user->email)->first();

            // Check if the user exists and has restricted approval status
            if ($user) {
                if ($user->is_approved == 2 || $user->is_approved == 3) {
                    return redirect()->route('login')->with('error', 'Your account is not approved for login.');
                }

                // Login the user if approved
                Auth::login($user);
            } else {
                // Create a new user if they don't exist
                $new_user = User::create([
                    'firstName' => $google_user['given_name'],
                    'lastName' => $google_user['family_name'],
                    'email' => $google_user->email,
                    'avatar' => $google_user->getAvatar(),
                    'google_id' => $google_user['id']
                ]);

                // Set a default is_approved status if needed
                if ($new_user->is_approved == 2 || $new_user->is_approved == 3) {
                    return redirect()->route('login')->with('error', 'Your account is not approved for login.');
                }

                Auth::login($new_user);
            }
            
            return redirect()->route('dashboard');
        }
        catch (\Throwable $th) {
            \Log::error('Google OAuth Error: ' . $th->getMessage());
            return redirect()->route('login')->with('error', 'Something went wrong during authentication. Please try again.');
        }
    }
}
