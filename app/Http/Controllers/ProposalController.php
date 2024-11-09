<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Proposal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProposalController extends Controller
{
    // Store the proposal in the database
    public function store(Request $request)
    {
        $request->validate([
            'proposal_text' => 'required|string',
            'job_offer_id' => 'required|exists:job_offers,id',
            'attachment' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:30720', // 30MB size limit
        ]);

        // Create a new proposal
        $proposal = new Proposal();
        $proposal->user_id = auth()->id(); // Store the ID of the currently authenticated user
        $proposal->job_offer_id = $request->job_offer_id;
        $proposal->proposal_text = $request->proposal_text;

        // Handle file upload if present
        if ($request->hasFile('attachment')) {
            $filePath = $request->file('attachment')->store('proposals', 'public');
            $proposal->attachment_path = $filePath;
        }

        // Save the proposal to the database
        $proposal->save();

        return response()->json(['message' => 'Proposal sent successfully'], 200);
    }

    // Fetch the proposal for a specific job offer
    public function getProposal($projectId)
    {
        // Retrieve the proposal based on the job_offer_id
        // Modified to get return user details (2024-10-04)
        $proposal = Proposal::with('user')->where('job_offer_id', $projectId)->get();

        if (!$proposal) {
            return response()->json(['error' => 'No proposal found for this project'], 404);
        }

        return response()->json(['proposal' => $proposal], 200);
    }

    public function getProposals($jobOfferId)
    {
        $proposals = Proposal::with('user') // Load user data with each proposal
            ->where('job_offer_id', $jobOfferId)
            ->get();

        return response()->json(['proposals' => $proposals]);
    }

    // Fetch user profile details
    public function getUserProfile($userId)
    {
        $user = User::find($userId);

        if ($user) {
            return response()->json($user);
        }

        return response()->json(['error' => 'User not found'], 404);
    }

    public function approveProposal($id)
    {
        $proposal = Proposal::findOrFail($id);

        // Optional: Check if the current user is authorized to approve this proposal
        $jobOffer = $proposal->jobOffer;
        if ($jobOffer->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $proposal->approved = true;
        $proposal->save();

        // Notify the user (implement notification logic if needed)
        // $proposal->user->notify(new ProposalApproved($proposal));

        return response()->json(['message' => 'Proposal approved successfully.']);
    }
}
