<?php

namespace App\Http\Controllers;

use App\Models\JobOffer;
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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'uploads.*' => 'nullable|file|mimes:jpg,png,pdf,docx|max:2048',
            'workType' => 'nullable|string',
            'budget' => 'nullable|numeric',
            'daysPostEnd' => 'nullable|numeric',
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
        }

        return back()->with('success', 'Project successfully posted!');
    }

    public function uploadFile(Request $request)
    {
        $request->validate(['file' => 'required|file|mimes:jpg,png,pdf,docx|max:2048']);
    
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
        // Validate the incoming request data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'uploads.*' => 'nullable|file|mimes:jpg,png,pdf,docx|max:2048',
            'workType' => 'nullable|string',
            'budget' => 'nullable|numeric',
            'daysPostEnd' => 'nullable|numeric',
        ]);

        // Find the existing job offer
        $jobOffer = JobOffer::findOrFail($id);

        // Update the job offer with new data
        $jobOffer->update([
            'job_title' => $validated['title'],
            'category' => $validated['category'],
            'job_description' => $validated['description'],
            'workType' => $validated['workType'] ?? '',
            'budget' => $validated['budget'] ?? 0,
            'daysPostEnd' => $validated['daysPostEnd'] ?? 0,
        ]);

        // If new uploads are provided, handle file uploads and update attachments
        if ($request->hasFile('uploads')) {
            foreach ($request->file('uploads') as $file) {
                $filePath = $file->store('uploads', 'public');

                $attachment = new Attachment();
                $attachment->job_id = $jobOffer->id;
                $attachment->user_id = Auth::id();
                $attachment->attachment_path = $filePath;
                $attachment->save();
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
}
