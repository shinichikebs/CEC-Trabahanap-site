<?php

namespace App\Http\Controllers;

use App\Models\JobOffer;
use App\Models\JobDone; 
use App\Models\Attachment;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostProjectController extends Controller
{
    public function show()
    {
        return Inertia::render('PostProject');
    }

    // Method to handle project posting along with file uploads
    public function postProject(Request $request)
{
    // Log the incoming request data
    \Log::info('Request Data Received: ', $request->all());

    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'category' => 'required|string|max:255',
        'subCategory' => 'required|string|max:255',
        'description' => 'required|string',
        'uploads.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,rtf,odt,csv,html,htm,mp3,wav,aac,flac,mp4,avi,mkv,mov,wmv,zip,rar,7z|max:30720',
        'workType' => 'required|integer',
        'budget' => 'nullable|numeric',
        'daysPostEnd' => 'required|integer',
    ]);

    // Log the validated data
    \Log::info('Validated Data: ', $validated);

    $project = JobOffer::create([
        'job_title' => $validated['title'],
        'job_description' => $validated['description'],
        'category' => $validated['category'],
        'budget' => $validated['budget'],
        'sub_category' => $validated['subCategory'],
        'work_type' => $validated['workType'], // Ensure work_type is being passed here
        'days_post_end' => $validated['daysPostEnd'], // Ensure days_post_end is being passed here
        'user_id' => Auth::id(),
    ]);

    // Log the created project
    \Log::info('Created Project: ', $project->toArray());

    if ($request->hasFile('uploads')) {
        foreach ($request->file('uploads') as $file) {
            $filePath = $file->store('uploads', 'public');

            $attachment = new Attachment();
            $attachment->job_id = $project->id;
            $attachment->user_id = Auth::id();
            $attachment->attachment_path = $filePath;
            $attachment->save();
        }
    }

    return back()->with('success', 'Project successfully posted!');
}



    public function uploadFile(Request $request)
    {
        $request->validate(['file' => 'required|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,rtf,odt,csv,html,htm,mp3,wav,aac,flac,mp4,avi,mkv,mov,wmv,zip,rar,7z|max:3030720720']);
    
        $filePath = $request->file('file')->store('uploads', 'public');

        return response()->json(['filePath' => $filePath]);
    }

    // Method to get the job offer and pass it to the edit form
    public function edit($id)
    {
        $jobOffer = JobOffer::with('attachments')->findOrFail($id);
        return Inertia::render('PostProject', ['jobOffer' => $jobOffer]);
    }

    // Method to handle updating an existing job offer
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'subCategory' => 'required|string|max:255',
            'description' => 'required|string',
            'uploads.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,rtf,odt,csv,html,htm,mp3,wav,aac,flac,mp4,avi,mkv,mov,wmv,zip,rar,7z|max:30720',
            'workType' => 'required|integer',
            'budget' => 'nullable|numeric',
            'daysPostEnd' => 'required|integer',
        ]);
    
        // Find the existing job offer
        $jobOffer = JobOffer::findOrFail($id);
    
        // Update job offer fields
        $jobOffer->update([
            'job_title' => $validated['title'],
            'job_description' => $validated['description'],
            'category' => $validated['category'],
            'sub_category' => $validated['subCategory'],
            'budget' => $validated['budget'],
            'work_type' => $validated['workType'],
            'days_post_end' => $validated['daysPostEnd'],
        ]);
    
        // Handle new file uploads
        if ($request->hasFile('uploads')) {
            foreach ($request->file('uploads') as $file) {
                $filePath = $file->store('uploads', 'public');
    
                Attachment::create([
                    'job_id' => $jobOffer->id,
                    'user_id' => Auth::id(),
                    'attachment_path' => $filePath,
                ]);
            }
        }
    
        return back()->with('success', 'Project successfully updated!');
    }
    

    public function destroy($id)
    {
        $project = JobOffer::findOrFail($id);
        $project->delete();

        return response()->json(['success' => 'Project deleted successfully.']);

    }

    public function markAsDone($id)
    {
        try {
            // Find the job offer by ID
            $jobOffer = JobOffer::findOrFail($id);

            // Create a new job done record with the job offer data
            $jobDone = new JobDone();
            $jobDone->job_title = $jobOffer->job_title;
            $jobDone->job_description = $jobOffer->job_description;
            $jobDone->category = $jobOffer->category;
            $jobDone->user_id = $jobOffer->user_id;
            $jobDone->save();

            // Delete the job offer record
            $jobOffer->delete();

            return response()->json(['success' => 'Project moved to job_done table']);
        } catch (\Exception $e) {
            Log::error('Error moving project to job_done: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
}