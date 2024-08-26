<?php

namespace App\Http\Controllers;

use App\Models\JobOffer;
use App\Models\User;
use App\Models\Attachment;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class PostProjectController extends Controller
{
    public function show()
    {
        return Inertia::render('PostProject');
    }

    public function postProject(Request $request)
    {
        $validated = $request->validate([
                        'title' => 'required|string|max:255',
                        'category' => 'required|string|max:255',
                        'description' => 'required|string',
                        'uploads.*' => 'file|mimes:jpg,png,pdf|max:2048',
                    ]);

        $project = new JobOffer();
        $project->job_title = $validated['title'];
        $project->job_description = $validated['description'];
        $project->category = $validated['category'];
        $project->user_id = Auth::id(); // logged in na user
        $project->save();

        if ($request->hasFile('uploads')) {
            Log::info('Uploads field is present.');
    
            foreach ($request->file('uploads') as $file) {
                // Log file information
                Log::info('Processing file: ' . $file->getClientOriginalName());
    
                // Store each file and get its path
                $filePath = $file->store('uploads', 'public');
    
                // Save file information in the attachments table
                $attachment = new Attachment();
                $attachment->job_id = $project->id; // last id of project saved above
                $attachment->user_id = Auth::id();
                $attachment->attachment_path = $filePath;
                $attachment->save();
    
                Log::info('File stored at: ' . $filePath);
            }
    
            return response()->json(['message' => 'Project posted successfully!']);
        } else {
            Log::info('No files uploaded.');
            return response()->json(['message' => 'No files were uploaded.']);
        }
  }
}
