<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage; // Ensure this is imported

class Attachment extends Model
{
    use HasFactory;

    protected $table = 'attachments';

    protected $fillable = [
        'job_id', 'user_id', 'attachment_path',
    ];

    // Accessor to generate full URL for the attachment path
    public function getAttachmentPathAttribute($value)
    {
        // This assumes you are storing files locally in the 'storage/app/public' folder
        return asset('storage/' . $value);
        
        // Alternatively, if you are using cloud storage like S3, you could use:
        // return Storage::url($value);
    }

    // Relationship to JobOffer (better naming convention)
    public function jobOffer()
    {
        return $this->belongsTo(JobOffer::class, 'job_id');
    }

    // Relationship to User (better naming convention)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
