<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    // Specify the table name if it is not the plural form of the model name
    protected $table = 'messages';

    // Define which attributes are mass-assignable
    protected $fillable = ['sender_id', 'recipient_id', 'content', 'is_read'];

    // Optionally, you can define relationships, for example:
    // public function sender() {
    //     return $this->belongsTo(User::class, 'sender_id');
    // }

    // public function recipient() {
    //     return $this->belongsTo(User::class, 'recipient_id');
    // }
}
