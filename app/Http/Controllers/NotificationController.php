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
        try {
            $data = Notification::all();
            return response()->json([
                'notifs' => $data
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching notifications: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
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

            $notifications = $user->notifications()->orderBy('created_at', 'desc')->get();

            return response()->json([
                'notifications' => $notifications,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching user notifications: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
