<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use Notifiable;

    protected $table = 'admins'; // Ensure it matches your database table

    protected $fillable = [
        'id_number',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}
