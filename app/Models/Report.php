<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    // Specify the table name (optional if using standard naming)
    protected $table = 'reports';

    // Define fillable fields for mass assignment
    protected $fillable = [
        'user_id', 
        'violation', 
        'reported_user_name', 
        'reporting_user_name'
    ];

    /**
     * Relationship to the User model.
     * Each report is associated with one user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
