<?php

use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PostProjectController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\ReportController; // Import ReportController
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Middleware\RedirectIfAuthenticated;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::group(['middleware' => ['auth', 'user.auth']], function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Other user-specific routes

    
    Route::get('/dashboard-data', [DashboardController::class, 'getData']);
    Route::get('/notification-data', [NotificationController::class, 'getNotification']);

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
    
    Route::middleware('auth:sanctum')->get('/notifications', [NotificationController::class, 'getNotification']);
Route::middleware('auth:sanctum')->get('/user-profile/{userId}', [UserController::class, 'getUserProfile']);
// web.php
    Route::get('/user/{id}', [UserController::class, 'show'])->name('user.profile');

    // notification
    Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead']);

    Route::post('/notifications', [NotificationController::class, 'store'])->name('notifications.store');
    Route::get('/notification-data', [NotificationController::class, 'getNotification']);
    Route::post('/approve-proposal/{id}', [ProposalController::class, 'approveProposal']);
    

    // Route to view a user profile
    Route::get('/profile/{id}', [UserController::class, 'show'])->name('profile.show');
    Route::get('/myprofile/{id}', [UserController::class, 'myprofile'])->name('myprofile.edit');

    Route::post('/user/{id}/avatar', [UserController::class, 'uploadAvatar'])->name('user.avatar.upload');

    // Route to mark a project as done
    Route::post('/post-project/{id}/done', [PostProjectController::class, 'markAsDone']);

    // Route to delete a project    
    Route::delete('/post-project/{id}', [PostProjectController::class, 'destroy'])->name('post-project.destroy');



    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/chat/{id}', [ChatController::class, 'show'])->name('chat.show');
        Route::post('/messages', [ChatController::class, 'storeMessage']);
        Route::get('/messages/{contactId}', [ChatController::class, 'getMessages']);
        Route::post('/messages/mark-as-read/{contactId}', [ChatController::class, 'markMessagesAsRead']);

    });
    // Fetch messages
Route::middleware('auth:sanctum')->get('/messages/{contactId}', [ChatController::class, 'getMessages']);

    
    

    // Route to show "My Projects"
    Route::get('/My-project', function () {
        return Inertia::render('MyProject');
    })->name('My-project');

    // Add the chat route here



    // Route to submit a proposal
    Route::post('/submit-proposal', [ProposalController::class, 'store'])->name('submit-proposal');
    Route::post('/approve-proposal/{id}', [ProposalController::class, 'approveProposal']);

    // Route to get a proposal for a specific project
    Route::get('/proposal/{projectId}', [ProposalController::class, 'getProposal'])->name('proposal.get');

    // **New Route to Submit a Report**
    Route::post('/report/user/{id}', [ReportController::class, 'store'])->name('reportted.user'); // <-- Add this line
    Route::get('/proposal/{jobOfferId}', [ProposalController::class, 'getProposals']);
    Route::get('/api/users/{userId}', [ProposalController::class, 'getUserProfile']);
    Route::post('/users/{id}/rate', [UserController::class, 'rate'])->name('rate.user');
    Route::get('/post/user/{id}/approved-posts', [UserController::class, 'getUsersApprovedPosts']);
    Route::get('/jobdone/user/{id}/done-jobs', [UserController::class, 'getUsersDoneJobs']);

    Route::post('/logout', function (Request $request) {
        Auth::logout(); // Logs out the user
        $request->session()->invalidate(); // Invalidate the session
        $request->session()->regenerateToken(); // Regenerate the CSRF token
        return redirect()->route('login'); // Redirect to the login page
    })->name('logout');

    
});

Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login'])->name('login.submit');

Route::get('/pending-approval', function () {
    return Inertia::render('Auth/PendingApproval');
})->name('pending-approval');

// Group routes that require authentication for profile handling
Route::middleware('auth')->group(function () {
    // Route to edit profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');

    // Route to update profile (PATCH for partial updates)
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Route to handle the POST request for updating skills and bio
    Route::post('/profile/update', [ProfileController::class, 'updateSkillsAndBio'])->name('profile.update.skills');

    // Route to delete profile
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

// Admin-specific routes

Route::group(['middleware' => ['auth:admin']], function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/dashboardAdmin');
    })->name('admin.dashboardAdmin');

    Route::get('/admin/pending-approval-users', [AdminDashboardController::class, 'getPendingApprovalUsers']);
    Route::post('/admin/approve-user/{id}', [AdminDashboardController::class, 'approveUser']);

    Route::get('/admin/pending-approval-posts', [AdminDashboardController::class, 'getPendingApprovalPosts']);
    Route::post('/admin/approve-post/{id}', [AdminDashboardController::class, 'approvePost']);
    Route::post('/admin/decline-post/{id}', [AdminDashboardController::class, 'declinePost']);


    Route::get('/admin/approved-users', [AdminDashboardController::class, 'getApprovedUsers']);
    Route::get('/admin/restricted-users', [AdminDashboardController::class, 'getRestrictUsers']);
    Route::get('/admin/approved-posts', [AdminDashboardController::class, 'getApprovedPosts']);
    Route::get('/admin/job-done', [AdminDashboardController::class, 'getJobDone']);
    Route::get('/report/all', [AdminDashboardController::class, 'reportall'])->name('report.all');
    Route::get('/report/user', [AdminDashboardController::class, 'reportUser'])->name('report.user');
    Route::get('/report/post', [AdminDashboardController::class, 'reportPost'])->name('report.post');
    Route::get('/admin-dashboard-data', [AdminDashboardController::class, 'getHeaderDetails']);
    Route::get('/admin/search-approved-users', [AdminDashboardController::class, 'searchApprovedUsers']);
    Route::post('/admin/add-user', [AdminDashboardController::class, 'addUser'])->name('admin.add-user');
    Route::post('/admin/add-staff', [AdminDashboardController::class, 'addStaff'])->name('admin.add-staff');
    Route::delete('/admin/delete-user/{id}', [AdminDashboardController::class, 'deleteUser']);
    Route::post('/admin/restrict-user/{id}', [AdminDashboardController::class, 'restrictUser']);
    Route::post('/admin/Declineconfirm-password', [AdminDashboardController::class, 'DeclineconfirmPassword']);
    Route::get('/admin/reports', [AdminDashboardController::class, 'reportUsers']);
    Route::get('/admin/user/{id}', [AdminDashboardController::class, 'getUserById']);
    Route::get('/admin/user/{id}/approved-posts', [AdminDashboardController::class, 'getUserApprovedPosts']);
    Route::post('/admin/confirm-password', [AdminDashboardController::class, 'confirmPassword']);
    Route::get('/admin/user/{userId}/done-jobs', [AdminDashboardController::class, 'getDoneJobs']);
    Route::post('/admin/approve-user/{id}', [AdminDashboardController::class, 'approveUser']);
    Route::post('/admin/decline-user/{id}', [AdminDashboardController::class, 'DeclineUser']);

});

Route::get('/admin-dashboard-data', [AdminDashboardController::class, 'getHeaderDetails']);
Route::post('/admin/logout', function () {
    Auth::guard('admin')->logout(); // Logs out the admin
    return redirect()->route('admin.login'); // Redirect to the login page
})->name('admin.logout');

Route::get('/test', function () {
    return response()->json(['message' => 'Laravel is working!']);
});

Route::get('/test-email', function () {
    $name = "Funny Codde"; // The name you want to pass
    Mail::to('palban.markvincent@cec.edu.ph')->send(new \App\Mail\UserApprovedMail($name));
});



require __DIR__.'/auth.php';