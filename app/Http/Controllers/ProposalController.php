<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\JobOffer;
use App\Models\Proposal;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProposalController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            'proposal_text' => 'required|string',
            'job_offer_id' => 'required|exists:job_offers,id',
            'attachment' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:30720', // 30MB size limit
        ]);
    
        // Create a new proposal
        $proposal = new Proposal();
        $proposal->user_id = auth()->id(); 
        $proposal->job_offer_id = $request->job_offer_id;
        $proposal->proposal_text = $request->proposal_text;
    
        // Handle file attachment
        if ($request->hasFile('attachment')) {
            $filePath = $request->file('attachment')->store('proposals', 'public');
            $proposal->attachment_path = $filePath;
        }
    
        $proposal->save();
    
        // Fetch related job offer and user details
        $jobOffer = $proposal->jobOffer; // Assuming `jobOffer` is a relationship in your Proposal model
        $sender = auth()->user(); // Get the authenticated user's details
    
        // Create a notification for the job offer owner
        $notification = new Notification();
        $notification->user_id = $jobOffer->user_id; // Notify the job offer owner
        $notification->sender_user_id = $sender->id; // Store the sender's ID
        $notification->message = "{$sender->firstName} {$sender->lastName} has submitted a proposal for your job offer '{$jobOffer->job_title}'.";
        $notification->read = 0; // Unread
        $notification->save();
    
        // Optionally, return detailed response
        return response()->json([
            'message' => 'Proposal sent successfully',
            'proposal' => $proposal,
            'notification' => $notification,
        ], 200);

    }

    public function getProposal($projectId)
    {
      
        $proposal = Proposal::with('user')->where('job_offer_id', $projectId)->get();

        if ($proposal->isEmpty()) {
            return response()->json(['error' => 'No proposal found for this project'], 404);
        }

        return response()->json(['proposal' => $proposal], 200);
    }

   
    public function getProposals($jobOfferId)
    {
        $proposals = Proposal::with('user') 
            ->where('job_offer_id', $jobOfferId)
            ->get();

        return response()->json(['proposals' => $proposals]);
    }

  
    public function getUserProfile($userId)
    {
        $user = User::find($userId);

        if ($user) {
            return response()->json($user);
        }

        return response()->json(['error' => 'User not found'], 404);
    }


    public function approveProposal($proposalId)
    {
        $proposal = Proposal::findOrFail($proposalId);
        $jobOffer = JobOffer::findOrFail($proposal->job_offer_id);
    
        // Assuming the creator of the job post is the owner of the job offer
        $creatorUserId = $jobOffer->user_id; 
    
        // Notification when proposal is approved
        Notification::create([
            'user_id' => $proposal->user_id,  // This is the proposal sender
            'sender_user_id' => $creatorUserId, // Job offer owner is the sender
            'message' => "Your proposal for the job '{$jobOffer->job_title}' has been approved by {$jobOffer->user->firstName} {$jobOffer->user->lastName}.",
            'read' => false,
        ]);
    
        // Additional logic to approve the proposal can go here (e.g., updating status)
        
        return response()->json(['message' => 'Proposal approved and notification sent.']);
    }
    
    
    // public function approveProposal($id)
    // {
    //     // Find the proposal by ID
    //     $proposal = Proposal::findOrFail($id);
    
    //     // Check if the authenticated user owns the job offer
    //     $jobOffer = $proposal->jobOffer;
    //     if ($jobOffer->user_id !== Auth::id()) {
    //         return response()->json(['message' => 'Unauthorized'], 403);
    //     }
    
    //     // Approve the proposal
    //     $proposal->approved = true;
    //     $proposal->save();
    
    //     // Create a notification for the proposal user
    //     $notification = new Notification();
    //     $notification->user_id = $proposal->user_id; // Notify the user who submitted the proposal
    //     $notification->message = 'Your proposal for has been approved.';
    //     $notification->read = 0; // Unread
    //     $notification->save();
    
    //     return response()->json(['message' => 'Proposal approved successfully.']);
    // }
    
    
}
