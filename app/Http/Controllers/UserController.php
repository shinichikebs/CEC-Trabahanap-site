<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function searchUser(Request $request)
    {
        $query = $request->input('query');
        
        // Search for users by firstName or lastName
        $users = User::where('firstName', 'LIKE', "%$query%")
                    ->orWhere('lastName', 'LIKE', "%$query%")
                    ->get(); // Get all matching users

        if ($users->isNotEmpty()) {
            return response()->json(['users' => $users]); // Return the list of users
        }

        return response()->json(['message' => 'No users found'], 404);
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
}
