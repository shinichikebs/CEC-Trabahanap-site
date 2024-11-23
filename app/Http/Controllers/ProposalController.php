<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Proposal;
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

      
        $proposal = new Proposal();
        $proposal->user_id = auth()->id(); 
        $proposal->job_offer_id = $request->job_offer_id;
        $proposal->proposal_text = $request->proposal_text;

      
        if ($request->hasFile('attachment')) {
            $filePath = $request->file('attachment')->store('proposals', 'public');
            $proposal->attachment_path = $filePath;
        }

        $proposal->save();

        return response()->json(['message' => 'Proposal sent successfully'], 200);
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


    public function approveProposal($id)
    {
        $proposal = Proposal::findOrFail($id);


        $jobOffer = $proposal->jobOffer;
        if ($jobOffer->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $proposal->approved = true;
        $proposal->save();

      

        return response()->json(['message' => 'Proposal approved successfully.']);
    }
}
