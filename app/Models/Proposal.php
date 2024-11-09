<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Notifications\ProposalApproved; // Import the notification class
use Illuminate\Support\Facades\Notification; // Import Notification facade

class Proposal extends Model
{
    use HasFactory;

    protected $fillable = ['approved']; // Include 'approved' in fillable to allow mass assignment

    // Define the relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Define the relationship with the JobOffer model
    public function jobOffer()
    {
        return $this->belongsTo(JobOffer::class);
    }

    // Approve the proposal and notify the user
    public function approve()
    {
        $this->approved = true; // Mark proposal as approved
        $this->save(); // Save the approval status

        // Send a notification to the user
        Notification::send($this->user, new ProposalApproved($this));
    }
}
