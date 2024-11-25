<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Notifications\ProposalApproved; 
use Illuminate\Support\Facades\Notification; 

class Proposal extends Model
{
    use HasFactory;

    protected $fillable = ['approved']; 


    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function jobOffer()
    {
        return $this->belongsTo(JobOffer::class, 'job_offer_id')->with('user');
    }
    
    

  
    public function approve()
    {
        $this->approved = true; 
        $this->save(); 

        
        Notification::send($this->user, new ProposalApproved($this));
    }
    
}

