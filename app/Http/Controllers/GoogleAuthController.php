<?php

namespace App\Http\Controllers;

use App\Models\User;
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

            $user = User::where('email', $google_user->email)->first();

            if ($user){
                Auth::login($user);
            }
            else {

                $new_user = User::create([
                    'firstName' => $google_user['given_name'],
                    'lastName' => $google_user['family_name'],
                    'email' => $google_user->email,
                    'google_id' => $google_user->id

                ]);
                Auth::login($new_user);

            }
            
                return redirect()->route('dashboard');
        }
        catch (\Throwable $th) {
            dd('Something went wrong!'. $th->getMessage());
        }
    }
}