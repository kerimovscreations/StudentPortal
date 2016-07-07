<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',255);
            $table->string('email',255)->unique();
            $table->string('password',60);
            $table->integer('group_id')->unsigned();
            $table->string('phone',13);
            $table->string('birthDate',10);
            $table->text('bio')->nullable();
            $table->string('profile_image_path')->default('images/profile_icon.png');
            $table->rememberToken();
            $table->string('api_token',60)->unique();
            $table->timestamps();

            $table->foreign('group_id')
                ->references('id')
                ->on('groups');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('students');
    }
}
