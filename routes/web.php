<?php

use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PostProjectController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ProposalController; // Ensure ProposalController is imported
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
    
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


// Group routes that require authentication and email verification
Route::group(['middleware' => ['auth', 'verified']], function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/dashboard-data', [DashboardController::class, 'getData']);

    // Route to display the PostProject form
    Route::get('/post-project', function () {
        return Inertia::render('PostProject');
    })->name('post-project');

    // Route to create a new project
    Route::post('/post-project-offer', [PostProjectController::class, 'postProject']);

    // Route to upload files
    Route::post('/upload-file-endpoint', [PostProjectController::class, 'uploadFile']);

    // Route to edit a project
    Route::get('/post-project/{id}/edit', [PostProjectController::class, 'edit'])->name('post-project.edit');

    // Route to update an existing project
    Route::post('/post-project/{id}/update', [PostProjectController::class, 'update'])->name('post-project.update');

    // Route to search users
    Route::get('/search-user', [UserController::class, 'searchUser']);

    // Route to view a user profile
    Route::get('/profile/{id}', [UserController::class, 'show'])->name('profile.show');

    // Route to mark a project as done
    Route::post('/post-project/{id}/done', [PostProjectController::class, 'markAsDone']);

    // Route to delete a project
    Route::delete('/post-project/{id}', [PostProjectController::class, 'destroy'])->name('post-project.destroy');

    // Route to show "My Projects"
    Route::get('/My-project', function () {
        return Inertia::render('MyProject');
    })->name('My-project');

    // Add the chat route here
    Route::get('/chat/{id}', [ChatController::class, 'show'])->name('chat.show');

    // Route to submit a proposal
    Route::post('/submit-proposal', [ProposalController::class, 'store'])->name('submit-proposal'); // <-- New Route for submitting proposals

    // Route to get a proposal for a specific project
    Route::get('/proposal/{projectId}', [ProposalController::class, 'getProposal'])->name('proposal.get'); // <-- New Route for fetching proposals
});

// Group routes that require authentication
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Google authentication routes
Route::group(['prefix' => 'auth/google'], function () {
    Route::get('/', [GoogleAuthController::class, 'redirect'])->name('google-auth');
    Route::get('/call-back', [GoogleAuthController::class, 'callbackGoogle']);
});

Route::get('/admin/login', [AdminLoginController::class, 'showLoginForm'])->name('admin.login');
Route::post('/admin/login', [AdminLoginController::class, 'login'])->name('admin.login.submit');
Route::post('/admin/logout', [AdminLoginController::class, 'logout'])->name('admin.logout');




Route::group(['middleware' => ['is_admin']], function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/dashboardAdmin'); // Admin Dashboard
    })->name('admin.dashboard');
});

Route::get('/admin-dashboard-data', [AdminDashboardController::class, 'getHeaderDetails']);
Route::post('/admin/logout', function () {
    Auth::guard('admin')->logout(); // Logs out the admin
    return redirect()->route('admin.login'); // Redirect to the login page
})->name('admin.logout');





Route::get('/test', function () {
    return response()->json(['message' => 'Laravel is working!']);
});

require __DIR__.'/auth.php';
