<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class JobOffer extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'job_offers';

    protected $fillable = [
        'job_title',
        'job_description',
        'category',
        'user_id',
    ];

    public function user() {
		return $this->belongsTo(User::class);
	}
}