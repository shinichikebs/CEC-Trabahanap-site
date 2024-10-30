<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\User;
use App\Models\JobOffer;
use App\Models\JobDone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalUsers = DB::table('users')->count();
        $totalJobOffers = DB::table('job_offers')->count();
        $totalJobsDone = DB::table('job_done')->count();

        Log::info('Total Users: ' . $totalUsers);
        Log::info('Total Job Offers: ' . $totalJobOffers);
        Log::info('Total Jobs Done: ' . $totalJobsDone);

        return Inertia::render('Dashboard', [
            'totalUsers' => $totalUsers,
            'totalPosts' => $totalJobOffers,
            'totalJobsDone' => $totalJobsDone, 
        ]);
    }

    public function getHeaderDetails()
    {
        try {
            $totalUsers = User::where('is_approved', 1)->count();
            $totalPosts = JobOffer::where('is_approved', 1)->count();
            $totalJobsDone = JobDone::count();

            return response()->json([
                'totalUsers' => $totalUsers,
                'totalPosts' => $totalPosts,
                'totalJobsDone' => $totalJobsDone,
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

    
    public function getPendingApprovalPosts()
    {
        try {
            $pendingPosts = JobOffer::where('is_approved', 0)->get(); // Fetch posts that are not approved yet
    
            return response()->json([
                'pendingPosts' => $pendingPosts,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching pending posts: ' . $e->getMessage());
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

        public function approvePost($id)
        {
            try {
                $post = JobOffer::findOrFail($id);
                $post->is_approved = 1; // Mark the post as approved
                $post->save();

                return response()->json(['message' => 'Post approved successfully']);
            } catch (\Exception $e) {
                \Log::error('Error approving post: ' . $e->getMessage());
                return response()->json(['error' => 'Internal Server Error'], 500);
            }
        }
        public function reportall()
        {
            return Inertia::render('Admin/report');
        }
        public function reportUser()
        {
            return Inertia::render('Admin/reportuser');
        }
        public function reportPost()
        {
            return Inertia::render('Admin/reportpost');
        }
        // AdminDashboardController.php
        public function getApprovedUsers()
        {
            try {
                $approvedUsers = User::where('is_approved', 1)->get();

                return response()->json([
                    'approvedUsers' => $approvedUsers,
                ]);
            } catch (\Exception $e) {
                \Log::error('Error fetching approved users: ' . $e->getMessage());
                return response()->json(['error' => 'Internal Server Error'], 500);
            }
        }

        public function getApprovedPosts()
        {
            try {
                $approvedPosts = JobOffer::where('is_approved', 1)->get();

                return response()->json([
                    'approvedPosts' => $approvedPosts,
                ]);
            } catch (\Exception $e) {
                \Log::error('Error fetching approved posts: ' . $e->getMessage());
                return response()->json(['error' => 'Internal Server Error'], 500);
            }
        }

        public function getJobDone()
            {
                try {
                    $jobDone = JobDone::all();

                    return response()->json([
                        'jobDone' => $jobDone,
                    ]);
                } catch (\Exception $e) {
                    \Log::error('Error fetching job done data: ' . $e->getMessage());
                    return response()->json(['error' => 'Internal Server Error'], 500);
                }
            }


            public function searchApprovedUsers(Request $request)
            {
                return response()->json(['message' => 'Endpoint is working']);
            }
            
            
            public function addUser(Request $request)
    {
        $request->validate([
            'id_number' => 'required|integer|unique:users',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'middleName' => 'nullable|string|max:255',
            'gender' => 'required|in:male,female',
            'role' => 'required|in:student,employee',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        try {
            $user = User::create([
                'id_number' => $request->id_number,
                'firstName' => $request->firstName,
                'lastName' => $request->lastName,
                'middleName' => $request->middleName,
                'is_approved' => 1,
                'gender' => $request->gender,
                'role' => $request->role,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            return response()->json(['message' => 'User added successfully', 'user' => $user], 200);
        } catch (\Exception $e) {
            Log::error('Error adding user: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to add user'], 500);
        }
        
    }
            
            
    public function addStaff(Request $request)
    {
        // Validate request input
        $request->validate([
            'id_number' => 'required|integer|unique:admins,id_number',
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
        ]);
    
        try {
            // Create a new staff entry in the admins table
            $staff = Admin::create([
                'id_number' => $request->id_number,
                'password' => Hash::make($request->password),
                'role' => 'staff',
            ]);
    
            return response()->json(['message' => 'Staff added successfully', 'staff' => $staff], 200);
        } catch (\Exception $e) {
            Log::error('Error adding staff: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to add staff'], 500);
        }
    }

}
            





