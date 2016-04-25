<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title',255);
            $table->text('description');
            $table->string('type',255);
            $table->string('date',255);
            $table->string('start_time',255);
            $table->string('end_time',255);
            $table->integer('group_id')->unsigned();
            $table->integer('place_id')->unsigned();
            $table->boolean('status');
            $table->integer('owner_id')->unsigned();
            $table->string('owner_table',255);
            $table->integer('responsible_first_id')->unsigned();
            $table->string('responsible_first_table',255);
            $table->integer('responsible_second_id')->unsigned();
            $table->string('responsible_second_table',255);

            $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade');
            $table->foreign('place_id')->references('id')->on('places')->onDelete('cascade');

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
        Schema::drop('events');
    }
}
