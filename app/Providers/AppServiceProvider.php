<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\UserMiddleware;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Registering middleware aliases
        $this->app['router']->aliasMiddleware('admin.auth', AdminMiddleware::class);
        $this->app['router']->aliasMiddleware('user.auth', UserMiddleware::class);
    }
}
