<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Store a new report in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, $id)
    {
        // Validate the incoming request data
        $request->validate([
            'violation' => 'required|string|max:255',
        ]);

        // Find the user being reported by their ID
        $user = User::findOrFail($id);

        // Create a new report for the user with the specified violation
        Report::create([
            'user_id' => $user->id,
            'violation' => $request->input('violation'),
        ]);

        // Return a JSON response indicating successful report submission
        return response()->json(['message' => 'Report submitted successfully.'], 200);
    }
}
