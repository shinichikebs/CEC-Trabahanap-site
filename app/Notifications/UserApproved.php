<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class UserApproved extends Notification
{
    use Queueable;

    // The user object
    protected $user;

    // Constructor to accept the user
    public function __construct($user)
    {
        $this->user = $user;
    }

    // Define the via method to send the email
    public function via($notifiable)
    {
        return ['mail'];
    }

    // Define the mail message to send
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Your Account Has Been Approved.')
                    ->greeting('Hello! ' . $this->user->first_name . ' ' . $this->user->last_name)  // Adjusted to use proper user fields
                    ->line('Your account has been approved. You can now access all features.')
                    ->action('Go to Dashboard', url('/')) // Adjust the URL if needed
                    ->line('Thank you for being a part of our community!');
    }
}


