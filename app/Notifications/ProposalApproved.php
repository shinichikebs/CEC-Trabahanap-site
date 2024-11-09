<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Proposal;
use App\Models\User;

class ProposalApproved extends Notification
{
    use Queueable;

    protected $proposal;

    public function __construct(Proposal $proposal)
    {
        $this->proposal = $proposal;
    }

    public function via($notifiable)
    {
        return ['mail', 'database']; // Adds database channel
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Proposal Approved')
            ->greeting('Hello ' . $notifiable->firstName . ',')
            ->line('Your proposal for the job "' . $this->proposal->jobOffer->job_title . '" has been approved.')
            ->action('View Job', url('/job-offers/' . $this->proposal->job_offer_id))
            ->line('Thank you for using our application!');
    }

    public function toArray($notifiable)
    {
        return [
            'message' => 'Your proposal for "' . $this->proposal->jobOffer->job_title . '" has been approved.',
            'proposal_id' => $this->proposal->id,
            'job_offer_id' => $this->proposal->job_offer_id,
            'approved' => 1, // Add approved status here
        ];
    }
}
