<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');  // Receiver of the notification
            $table->unsignedBigInteger('sender_user_id');  // Sender of the notification
            $table->string('message');
            $table->boolean('read')->default(false);
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('sender_user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
    
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
