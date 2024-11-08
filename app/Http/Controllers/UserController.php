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
    
}

