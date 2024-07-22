<?php

namespace App\Http\Controllers;

use App\Models\JobOffer;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard');
    }

        public function getData()
    {
        
        try {

            $user = auth()->user();

            $data = JobOffer::with('user')->get();
            
            $profile = [
                'firstName' => $user->firstName,
                'lastName' => $user->lastName,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar,
                'id_number' => $user->id_number,
                
            ];
            
            return response()->json([
                'jobOffers' => $data,
                'profileData' => $profile,  
            ]);
        } catch (\Exception $e) {
      
            \Log::error('Error fetching dashboard data: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}