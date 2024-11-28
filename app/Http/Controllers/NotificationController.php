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
    
     public function getNotification()
     {
         $user = Auth::user();
 
         if (!$user) {
             return response()->json(['error' => 'Unauthorized'], 401);
         }
 
         // Fetch notifications and include user details
         $notifications = Notification::where('user_id', $user->id)
             ->orderBy('created_at', 'desc')
             ->with('user') // Ensure user details are included
             ->get();
 
         return response()->json(['notifs' => $notifications]);
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
    
    /**
     * Mark a specific notification as read.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAsRead($id)
    {
        try {
            $notification = Notification::findOrFail($id);
    
            // Ensure the authenticated user owns the notification
            if ($notification->user_id !== auth()->id()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
    
            // Mark the notification as read
            $notification->update(['read' => true]);
    
            return response()->json([
                'message' => 'Notification marked as read.',
                'notification' => $notification,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error marking notification as read: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
    
    
    /**
     * Store a new notification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
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
