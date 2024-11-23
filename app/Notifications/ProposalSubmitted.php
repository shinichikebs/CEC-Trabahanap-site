<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Proposal;

class ProposalSubmitted extends Notification
{
    use Queueable;

    protected $proposal;

  
    public function __construct(Proposal $proposal)
    {
        $this->proposal = $proposal;
    }

   
    public function via($notifiable)
    {
        return ['mail', 'database']; 
    }

    
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Proposal Submitted')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('A new proposal has been submitted for your job posting: "' . $this->proposal->jobOffer->job_title . '".')
            ->action('View Proposal', url('/proposals/' . $this->proposal->id))
            ->line('Thank you for using our application!');
    }

   
    public function toDatabase($notifiable)
    {
        return [
            'message' => 'A new proposal has been submitted for your job posting: "' . $this->proposal->jobOffer->job_title . '".',
            'proposal_id' => $this->proposal->id,
            'job_offer_id' => $this->proposal->job_offer_id,
            'submitted_by' => $this->proposal->user->name,
        ];
    }
}
