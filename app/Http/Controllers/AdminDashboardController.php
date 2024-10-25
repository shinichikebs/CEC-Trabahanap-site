<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\JobOffer;
use App\Models\JobDone;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

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



}
