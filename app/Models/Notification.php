<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Notification extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'notifications';

    protected $fillable = [
        'user_id',
        'sender_user_id',
        'message',
        'read',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_user_id');
    }
}
