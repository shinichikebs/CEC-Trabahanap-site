<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
        $reportedUser = User::findOrFail($id);

        // Get the reporting user (the authenticated user)
        $reportingUser = Auth::user();

        // Create a new report with the violation and both user names
        Report::create([
            'user_id' => $reportedUser->id,
            'violation' => $request->input('violation'),
            'reported_user_name' => $reportedUser->firstName . ' ' . $reportedUser->lastName,
            'reporting_user_name' => $reportingUser->firstName . ' ' . $reportingUser->lastName,
        ]);

        // Return a JSON response indicating successful report submission
        return response()->json(['message' => 'Report submitted successfully.'], 200);
    }
}
