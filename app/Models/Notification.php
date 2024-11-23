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
        'message',     
        'read',        
        'data',       
    ];

    protected $casts = [
        'read' => 'boolean', 
        'data' => 'array',   
    ];

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    
    public function markAsRead()
    {
        $this->update(['read' => true]);
    }

  
    public function scopeUnread($query)
    {
        return $query->where('read', false);
    }
}
