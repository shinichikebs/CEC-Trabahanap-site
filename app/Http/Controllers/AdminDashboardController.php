<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\JobOffer; // Import JobOffer model
use Inertia\Inertia; // Import Inertia for rendering
use Illuminate\Support\Facades\Log; // Import for logging

class AdminDashboardController extends Controller
{
    public function index()
{
    // Count users using the query builder
    $totalUsers = DB::table('users')->count(); 




    // Count job offers using the query builder
    $totalJobOffers = DB::table('job_offers')->count();

    // Log the counts
    Log::info('Total Users: ' . $totalUsers);
    Log::info('Total Job Offers: ' . $totalJobOffers);

    return Inertia::render('Dashboard', [
        'totalUsers' => $totalUsers,
        'totalPosts' => $totalJobOffers,
    ]);
}
    public function getHeaderDetails() {

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

}
