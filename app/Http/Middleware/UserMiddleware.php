<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class UserMiddleware
{
    public function handle($request, Closure $next)
    {
        // Check if the user is authenticated using the default guard
        if (!Auth::check()) {
            return redirect()->route('login'); // Redirect to login page if user is not authenticated
        }

        return $next($request);
    }
}
