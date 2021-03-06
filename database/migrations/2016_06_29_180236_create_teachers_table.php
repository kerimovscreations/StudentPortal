<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTeachersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',255);
            $table->string('email',255)->unique();
            $table->string('password',60);
            $table->string('work_days',255)->nullable();
            $table->string('work_start_time',255)->nullable();
            $table->string('work_end_time',255)->nullable();
            $table->text('bio')->nullable();
            $table->string('profile_image_path')->default('images/profile_icon.png');
            $table->rememberToken();
            $table->string('api_token',60)->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('teachers');
    }
}
