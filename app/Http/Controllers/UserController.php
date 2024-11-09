<?php

namespace App\Http\Controllers;

use App\Models\Proposal;
use App\Models\User;
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

    public function getNotifications()
    {
        try {
            // Retrieve unread notifications from the authenticated user specifically for approved proposals
            $notifications = Auth::user()->notifications()
                ->where('type', ProposalApproved::class) // Filter for ProposalApproved notifications
                ->whereNull('read_at') // Only unread notifications
                ->latest() // Order by latest
                ->get()
                ->map(function ($notification) {
                    return [
                        'id' => $notification->id,
                        'message' => $notification->data['message'] ?? 'No message provided',
                        'created_at' => $notification->created_at->toDateTimeString(),
                    ];
                });
                
            return response()->json($notifications);
        } catch (\Exception $e) {
            Log::error('Error fetching notifications: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Could not fetch notifications'], 500);
        }
    }
    

    
    

    

}

