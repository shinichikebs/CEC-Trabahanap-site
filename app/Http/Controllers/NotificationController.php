<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function getNotification() {
        try {

            $data = Notification::all();
            return response()->json([
                'notifs' => $data
            ]);
        } catch (\Exception $e) {
      
            \Log::error('Error fetching dashboard data: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
