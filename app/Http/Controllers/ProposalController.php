<?php

namespace App\Http\Controllers;

use App\Models\Proposal;
use Illuminate\Http\Request;

class ProposalController extends Controller
{
    public function store(Request $request)
    {
      $request->validate([
    'proposal_text' => 'required|string',
    'job_offer_id' => 'required|exists:job_offers,id',
    'attachment' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:30720', 
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
}
