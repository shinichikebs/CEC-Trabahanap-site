<?php

namespace App\Http\Controllers;

use App\Models\JobOffer;
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

    // Method to handle project posting along with file uploads
    public function postProject(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'uploads.*' => 'file|mimes:jpg,png,pdf,docx|max:2048',
        ]);

        $project = new JobOffer();
        $project->job_title = $validated['title'];
        $project->job_description = $validated['description'];
        $project->category = $validated['category'];
        $project->user_id = Auth::id();
        $project->save();

        if ($request->hasFile('uploads')) {
            foreach ($request->file('uploads') as $file) {
                $filePath = $file->store('uploads', 'public');

                $attachment = new Attachment();
                $attachment->job_id = $project->id;
                $attachment->user_id = Auth::id();
                $attachment->attachment_path = $filePath;
                $attachment->save();
            }

            return response()->json(['message' => 'Project posted successfully!']);
        } else {
            return response()->json(['message' => 'No files were uploaded.']);
        }
    }

    // Separate method for handling individual file uploads
    public function uploadFile(Request $request)
    {
        $request->validate(['file' => 'required|file|mimes:jpg,png,pdf,docx|max:2048']);
    
        $filePath = $request->file('file')->store('uploads', 'public');

        return response()->json(['filePath' => $filePath]);
    }
}
