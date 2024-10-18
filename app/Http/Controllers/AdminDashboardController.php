<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\JobOffer;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalUsers = DB::table('users')->count();
        $totalJobOffers = DB::table('job_offers')->count();

        Log::info('Total Users: ' . $totalUsers);
        Log::info('Total Job Offers: ' . $totalJobOffers);

        return Inertia::render('Dashboard', [
            'totalUsers' => $totalUsers,
            'totalPosts' => $totalJobOffers,
        ]);
    }

    public function getHeaderDetails()
    {
        try {
            $totalUsers = User::where('is_approved', 1)->count();
            $totalPosts = JobOffer::count();

            return response()->json([
                'totalUsers' => $totalUsers,
                'totalPosts' => $totalPosts,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching dashboard data: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    // Method to fetch users pending approval (is_approved = 0)
    public function getPendingApprovalUsers()
    {
        try {
            $pendingUsers = User::where('is_approved', 0)->get(); // Fetch users not approved

            return response()->json([
                'pendingUsers' => $pendingUsers,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching pending users: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    // Method to approve user (set is_approved to 1)
    public function approveUser($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->is_approved = 1;
            $user->save();

            return response()->json(['message' => 'User approved successfully']);
        } catch (\Exception $e) {
            \Log::error('Error approving user: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
