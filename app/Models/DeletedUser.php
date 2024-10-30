<?php
// app/Models/DeletedUser.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeletedUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_number',
        'firstName',
        'lastName',
        'email',
        'role',
        'deleted_at',
    ];
}
