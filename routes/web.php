<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PostProjectController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ProposalController; 
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
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/dashboard-data', [DashboardController::class, 'getData']);

  
    Route::get('/post-project', function () {
        return Inertia::render('PostProject');
    })->name('post-project');

    
    Route::post('/post-project-offer', [PostProjectController::class, 'postProject']);

  
    Route::post('/upload-file-endpoint', [PostProjectController::class, 'uploadFile']);

   
    Route::get('/post-project/{id}/edit', [PostProjectController::class, 'edit'])->name('post-project.edit');

   
    Route::post('/post-project/{id}/update', [PostProjectController::class, 'update'])->name('post-project.update');

   
    Route::get('/search-user', [UserController::class, 'searchUser']);

   
    Route::get('/profile/{id}', [UserController::class, 'show'])->name('profile.show');

   
    Route::post('/post-project/{id}/done', [PostProjectController::class, 'markAsDone']);

    
    Route::delete('/post-project/{id}', [PostProjectController::class, 'destroy'])->name('post-project.destroy');

    
    Route::get('/My-project', function () {
        return Inertia::render('MyProject');
    })->name('My-project');

   
    Route::get('/chat/{id}', [ChatController::class, 'show'])->name('chat.show');

    
    Route::post('/submit-proposal', [ProposalController::class, 'store'])->name('submit-proposal'); // <-- New Route for submitting proposals
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
