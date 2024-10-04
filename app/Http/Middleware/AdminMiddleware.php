<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle($request, Closure $next)
    {
        // Check if the user is authenticated as admin using the 'admin' guard
        if (!Auth::guard('admin')->check()) {
            return redirect()->route('admin.login'); // Redirect to admin login page
        }

        return $next($request);
    }
}