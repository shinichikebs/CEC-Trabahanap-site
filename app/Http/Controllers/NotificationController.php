<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Notification;

class NotificationController extends Controller
{
    /**
     * Fetch all notifications for all users.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    // public function getNotification()
    // {
    //     try {
    //         $user = Auth::user();
    
    //         if (!$user) {
    //             return response()->json(['error' => 'Unauthorized'], 401);
    //         }
    
    //         // Fetch notifications for the authenticated user
    //         $data = Notification::where('user_id', $user->id)
    //             ->orderBy('created_at', 'desc')
    //             ->get();
    
    //         return response()->json([
    //             'notifs' => $data,
    //         ]);
    //     } catch (\Exception $e) {
    //         \Log::error('Error fetching notifications: ' . $e->getMessage());
    //         return response()->json(['error' => 'Internal Server Error'], 500);
    //     }
    // }
    public function getNotification()
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $data = Notification::where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->with('user') // Include user details for notifications
        ->get();

    return response()->json(['notifs' => $data]);
}

    /**
     * Fetch notifications for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserNotifications()
    {
        try {
            $user = Auth::user();
    
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
    
            $notifications = Notification::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();
    
            return response()->json([
                'notifications' => $notifications,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching user notifications: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
    
    public function store(Request $request)
{
    try {
        $request->validate([
            'user_id' => 'required|exists:users,id', // Ensure the user exists
            'message' => 'required|string|max:255',
        ]);

        // Create a new notification
        $notification = Notification::create([
            'user_id' => $request->user_id,
            'message' => $request->message,
            'read' => 0, // Default to unread
        ]);

        return response()->json([
            'message' => 'Notification created successfully',
            'notification' => $notification,
        ], 201);
    } catch (\Exception $e) {
        \Log::error('Error storing notification: ' . $e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}
}
