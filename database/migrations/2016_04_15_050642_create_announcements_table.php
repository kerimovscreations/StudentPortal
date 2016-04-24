<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAnnouncementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->increments('id');
            $table->text('body');
            $table->integer('owner_id')->unsigned();
            $table->foreign('owner_id')->references('id')->on('teachers')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('announcement_group', function (Blueprint $table) {
            $table->integer('announcement_id')->unsigned()->index();
            $table->foreign('announcement_id')->references('id')->on('announcements')->onDelete('cascade');

            $table->integer('group_id')->unsigned()->index();
            $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade');

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
        Schema::drop('announcements');
        Schema::drop('announcement_group');
    }
}
