<?php

namespace App\Notifications;

use App\Models\Proposal;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;

class NewProposalSubmitted extends Notification
{
    use Queueable;

    public $proposal;

    /**
     * Create a new notification instance.
     */
    public function __construct(Proposal $proposal)
    {
        $this->proposal = $proposal;
    }

    /**
     * Determine the notification's delivery channels.
     */
    public function via($notifiable)
    {
        return ['database']; // Store the notification in the database
    }

    /**
     * Get the array representation of the notification.
     */
    public function toDatabase($notifiable)
    {
        return [
            'proposal_id' => $this->proposal->id,
            'job_offer_id' => $this->proposal->job_offer_id,
            'message' => 'A new proposal has been submitted for your job offer.',
            'submitted_by' => $this->proposal->user->name, // Assuming the user has a `name` attribute
        ];
    }
}
