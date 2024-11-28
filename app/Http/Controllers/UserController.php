<?php

namespace App\Http\Controllers;

use App\Models\Proposal;
use App\Models\Rating;
use App\Models\User;
use App\Models\JobOffer;
use App\Models\JobDone;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Notifications\ProposalApproved;
use Illuminate\Support\Facades\Auth; // Ensure this is included
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function searchUser(Request $request)
    {
        $query = $request->input('query');

        // Search for users who are approved (is_approved = 1) and match the query in firstName or lastName
        $users = User::where('is_approved', 1)
            ->where(function ($q) use ($query) {
                $q->where('firstName', 'LIKE', "%$query%")
                  ->orWhere('lastName', 'LIKE', "%$query%");
            })
            ->get();

        if ($users->isNotEmpty()) {
            return response()->json(['users' => $users]); // Return the list of users
        }

        return response()->json(['message' => 'No approved users found'], 404);
    }

    public function getUserProfile($userId)
    {
        $user = User::find($userId);
    
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
    
        return response()->json([
            'id' => $user->id,
            'firstName' => $user->firstName,
            'lastName' => $user->lastName,
            'email' => $user->email,
            'bio' => $user->bio ?? 'No bio available', // Default value for bio
            'avatar' => $user->avatar,
        ]);
    }
    
    

    public function show($id)
    {
        $user = User::find($id);
    
        if ($user) {
            return Inertia::render('userProfile', [ // Ensure this matches 'resources/js/Pages/UserProfile.jsx'
                'user' => $user,
            ]);
        }
    
        return redirect()->back()->with('error', 'User not found');
    }
    

    
    public function myprofile($id)
    {
        $user = User::find($id);
    
        if ($user) {
            return Inertia::render('userProfileEdit', [ // Ensure this matches 'resources/js/Pages/UserProfile.jsx'
                'user' => $user,
            ]);
        }
    
        return redirect()->back()->with('error', 'User not found');
    }
    
    public function uploadAvatar(Request $request, $id)
    {
        $user = User::findOrFail($id);
    
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public'); // Store in 'public/avatars' directory
            $user->avatar = "/storage/" . $path; // Adjust path for public access
            $user->save();
    
            return response()->json(['avatar' => $user->avatar], 200);
        }
    
        return response()->json(['error' => 'File upload failed'], 500);
    }

    
    public function rate(Request $request, $id)
{
    $request->validate([
        'rating' => 'required|integer|min:1|max:5',
    ]);

    $ratedUser = User::findOrFail($id);

    // Check if the user already rated this user
    $existingRating = Rating::where('rated_user_id', $id)
        ->where('rater_user_id', Auth::id())
        ->first();

    if ($existingRating) {
        // Update existing rating
        $existingRating->update(['rating' => $request->rating]);
    } else {
        // Create a new rating
        Rating::create([
            'rated_user_id' => $id,
            'rater_user_id' => Auth::id(),
            'rating' => $request->rating,
        ]);
    }

    // Calculate and return the new average rating
    $newAverageRating = $ratedUser->ratingsReceived()->avg('rating');

    return response()->json([
        'success' => true,
        'newAverageRating' => $newAverageRating,
    ]);
}

    
public function getUsersApprovedPosts($userId)
{
    try {
        $approvedPosts = JobOffer::where('user_id', $userId)
            ->where('is_approved', 1) // Only fetch approved posts
            ->get();

        return response()->json([
            'approvedPosts' => $approvedPosts,
        ]);
    } catch (\Exception $e) {
        \Log::error('Error fetching approved posts: ' . $e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}



public function getUsersDoneJobs($userId)
{
    try {
        $doneJobs = JobDone::where('user_id', $userId)->get();

        return response()->json([
            'doneJobs' => $doneJobs
        ]);
    } catch (\Exception $e) {
        \Log::error('Error fetching done jobs: ' . $e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}


    // public function getNotifications()
    // {
    //     try {
    //         // Retrieve unread notifications from the authenticated user specifically for approved proposals
    //         $notifications = Auth::user()->notifications()
    //             ->where('type', ProposalApproved::class) // Filter for ProposalApproved notifications
    //             ->whereNull('read_at') // Only unread notifications
    //             ->latest() // Order by latest
    //             ->get()
    //             ->map(function ($notification) {
    //                 return [
    //                     'id' => $notification->id,
    //                     'message' => $notification->data['message'] ?? 'No message provided',
    //                     'created_at' => $notification->created_at->toDateTimeString(),
    //                 ];
    //             });
                
    //         return response()->json($notifications);
    //     } catch (\Exception $e) {
    //         Log::error('Error fetching notifications: ' . $e->getMessage(), [
    //             'exception' => $e,
    //             'trace' => $e->getTraceAsString(),
    //         ]);
    //         return response()->json(['error' => 'Could not fetch notifications'], 500);
    //     }
    // }
    

    

}

