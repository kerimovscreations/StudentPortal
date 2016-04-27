<?php

namespace App\Http\Controllers;

use App\Events\Event;
use Illuminate\Http\Request;

use App\Http\Requests;

class EventController extends Controller
{

    public function store(Request $request)
    {
        $event = new \App\Event();
        $event->title = $request['title'];
        $event->description = $request['description'];
        $event->type = $request['type'];
        $event->date = $request['date'];
        $event->start_time = $request['start_time'];
        $event->end_time = $request['end_time'];
        $event->group_id = $request['group_id'];
        $event->place_id = $request['place_id'];
        $event->status = $request['status'];
        $event->owner_id = $request['owner_id'];
        $event->owner_table = $request['owner_table'];
        $event->responsible_first_id = $request['responsible_first_id'];
        $event->responsible_first_table = $request['responsible_first_table'];
        $event->responsible_second_id = $request['responsible_second_id'];
        $event->responsible_second_table = $request['responsible_second_table'];
        $event->save();
    }

    public function group()
    {
        return $this->belongsTo('App\Group');
    }

    public function place()
    {
        return $this->belongsTo('App\Place');
    }
}
