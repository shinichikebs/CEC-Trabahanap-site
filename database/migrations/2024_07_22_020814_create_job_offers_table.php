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
        Schema::create('job_offers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('job_title');
            $table->text('job_description');
            $table->string('category');
            $table->decimal('budget', 10, 2)->nullable();
            $table->string('sub_category');
            $table->integer('work_type')->default(0);
            $table->integer('days_post_end')->default(0);
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_offers');
    }
};
Schema::table('users', function (Blueprint $table) {
    $table->dropForeign(['job_offer_id']); 
});