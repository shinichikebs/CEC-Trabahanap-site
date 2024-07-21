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

            if (!Str::endsWith($google_user->email, 'cec.edu.ph')) {
                return redirect()->route('login')->with('error', 'Email domain not allowed.');
            }

            $user = User::where('email', $google_user->email)->first();

            if ($user){
                Auth::login($user);
            }
            else {

                $new_user = User::create([
                    'firstName' => $google_user['given_name'],
                    'lastName' => $google_user['family_name'],
                    'email' => $google_user->email,
                    'id_number' => $google_user['id'],
                    // 'google_id' => $google_user['studentid']
                   

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