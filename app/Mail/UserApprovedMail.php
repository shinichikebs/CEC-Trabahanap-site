<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Messages\Content;

class UserApprovedMail extends Mailable
{
    use SerializesModels;

    public $name; // Declare name to be passed to the view

    // Constructor to accept the name
    public function __construct(string $name)
    {
        $this->name = $name;
    }

    // Build the email message
    public function build()
    {
        return $this->subject('Your Account Has Been Approved')
                    ->view('emails.user-approved')
                    ->with([
                        'name' => $this->name, // Pass the name variable to the view
                    ]);
    }
}
