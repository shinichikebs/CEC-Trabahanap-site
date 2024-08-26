<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PostProjectController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::group(['middleware' => ['auth', 'verified']], function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    Route::get('/dashboard-data', [DashboardController::class, 'getData']);

Route::get('/post-project', function () {
    return Inertia::render('PostProject');
})->name('post-project');

Route::post('/post-project-offer', [PostProjectController::class, 'postProject'])->name('post-offer');

Route::get('/My-project', function () {
    return Inertia::render('MyProject');
})->name('My-project');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::group(['prefix' => 'auth/google'], function () {
    Route::get('/', [GoogleAuthController::class, 'redirect'])->name('google-auth');
    Route::get('/call-back', [GoogleAuthController::class, 'callbackGoogle']);
});

require __DIR__.'/auth.php';