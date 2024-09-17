<?php

namespace App\Http\Controllers;

use App\Models\Proposal;
use Illuminate\Http\Request;

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
        $proposal = Proposal::where('job_offer_id', $projectId)->first();

        if (!$proposal) {
            return response()->json(['error' => 'No proposal found for this project'], 404);
        }

        return response()->json(['proposal' => $proposal], 200);
    }
}
