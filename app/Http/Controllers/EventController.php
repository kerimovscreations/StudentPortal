<?php

namespace App\Http\Controllers;

use App\Event;
use App\Notification;
use Illuminate\Http\Request;

use App\Http\Requests;

class EventController extends Controller
{

    public function store(Request $request)
    {
        $event = Event::create($request->all());

        if ($event->type == 'lesson') {
            Notification::create([
                'text' => 'New lesson',
                'status' => 0,
                'receiver_id' => $event->group_id,
                'receiver_table' => 'groups',
                'source_id' => $event->id,
                'source_table' => 'events']);
        } else {
            if ($request['from'] == 'student')
                Notification::create([
                    'text' => 'New extra lesson',
                    'status' => 0,
                    'receiver_id' => $event->responsible_second_id,
                    'receiver_table' => 'mentors',
                    'source_id' => $event->id,
                    'source_table' => 'events']);
            else {
                Notification::create([
                    'text' => 'New extra lesson',
                    'status' => 0,
                    'receiver_id' => $event->responsible_first_id,
                    'receiver_table' => 'students',
                    'source_id' => $event->id,
                    'source_table' => 'events']);
                Notification::create([
                    'text' => 'New extra lesson',
                    'status' => 0,
                    'receiver_id' => $event->responsible_second_id,
                    'receiver_table' => 'mentors',
                    'source_id' => $event->id,
                    'source_table' => 'events']);
            }
        }
    }

    public function changeStatus(Request $request)
    {
        $event = Event::findOrFail($request['id']);
        $event->status = $request['status'];
        if ($request['status'] == 1)
            Notification::where('source_table', 'events')->where('source_id', $event->id)->delete();
        if ($event->type == 'extra' && $request['status'] == 0) {
            Notification::where('source_table', 'events')->where('source_id', $event->id)->delete();
            if ($request['from'] == 'student')
                Notification::create([
                    'text' => 'Extra lesson decided',
                    'status' => 0,
                    'receiver_id' => $event->responsible_second_id,
                    'receiver_table' => 'mentors',
                    'source_id' => $event->id,
                    'source_table' => 'events']);
            else
                Notification::create([
                    'text' => 'Extra lesson decided',
                    'status' => 0,
                    'receiver_id' => $event->responsible_first_id,
                    'receiver_table' => 'students',
                    'source_id' => $event->id,
                    'source_table' => 'events']);
        }

        $event->save();

    }

    public function changeTime(Request $request)
    {
        $event = \App\Event::findOrFail($request['id']);
        Notification::where('source_table','events')->where('source_id',$event->id)->delete();
        $event->start_time = $request['startTime'];
        $event->end_time = $request['endTime'];
        if ($request['from'] == 'student') {
            Notification::create([
                'text' => 'Extra lesson time has changed',
                'status' => 0,
                'receiver_id' => $event->responsible_first_id,
                'receiver_table' => 'mentors',
                'source_id' => $event->id,
                'source_table' => 'events']);
        } else {
            Notification::create([
                'text' => 'Extra lesson time has changed',
                'status' => 0,
                'receiver_id' => $event->responsible_first_id,
                'receiver_table' => 'students',
                'source_id' => $event->id,
                'source_table' => 'events']);
        }
        $event->save();
    }

    public function update(Request $request)
    {
        $event = Event::findOrFail($request['id']);
        $event->update($request->all());
        Notification::where('source_table','events')->where('source_id', $event->id)->touch();
    }

    public function delete(Request $request)
    {
        $event = Event::findOrFail($request['id']);
        Notification::where('source_table', 'events')->where('source_id', $event->id)->delete();
        $event->delete();
    }
}
