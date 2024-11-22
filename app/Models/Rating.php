<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rating extends Model
{
    protected $fillable = ['rated_user_id', 'rater_user_id', 'rating'];


    /**
     * The user who is being rated.
     */
    public function ratedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rated_user_id');
    }

    /**
     * The user who gave the rating.
     */
    public function raterUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rater_user_id');
    }
}
