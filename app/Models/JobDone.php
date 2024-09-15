<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobDone extends Model
{
    protected $table = 'job_done';

    protected $fillable = [
        'job_title', 'job_description', 'category', 'user_id'
    ];
}
