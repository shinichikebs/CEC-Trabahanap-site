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

        $response = $next($request);

        return $response->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
                        ->header('Expires', '0');


        // return $next($request);
    }
}