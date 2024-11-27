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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sender_id'); // User who sends the message
            $table->unsignedBigInteger('recipient_id'); // User who receives the message
            $table->text('content'); // Message content
            $table->boolean('is_read')->default(false); // Read status
            $table->unsignedBigInteger('sender_id'); 
            $table->unsignedBigInteger('recipient_id'); 
            $table->text('content'); 
            $table->boolean('is_read')->default(false); 
            $table->timestamps();

            // Foreign keys
            $table->foreign('sender_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('recipient_id')->references('id')->on('users')->onDelete('cascade');

            // Indexes for optimization
            $table->index('sender_id');
            $table->index('recipient_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
