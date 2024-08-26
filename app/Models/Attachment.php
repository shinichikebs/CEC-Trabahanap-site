<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    use HasFactory;

    protected $table = 'attachments';

    protected $fillable = [
        'job_id', 'user_id', 'attachment_path',
    ];

    public function job_attachment()
    {
        return $this->belongsTo(JobOffer::class);
    }

    public function user_attachment()
    {
        return $this->belongsTo(User::class);
    }

}
