<?php

namespace App\Http\Controllers;

use App\Event;
use App\Mentor;
use App\Notification;
use App\Student;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\DB;

class EventController extends Controller
{

    public function store(Request $request)
    {
        $data = $request;
        if (is_null($data['title'])) {
            $data['title'] = DB::table($data['responsible_first_table'])->where('id', $data['responsible_first_id'])->value('name');
        }
        $event = Event::create($data->all());

        if ($event->type == 'lesson') {
            Notification::create([
                'text' => 'New lesson',
                'status' => 0,
                'receiver_id' => $event->group_id,
                'receiver_table' => 'groups',
                'source_id' => $event->id,
                'source_table' => 'events']);
        } else {
            $result_mail = [];
            if ($request['from'] == 'student') {
                Notification::create([
                    'text' => 'New extra lesson',
                    'status' => 0,
                    'receiver_id' => $event->responsible_second_id,
                    'receiver_table' => 'mentors',
                    'source_id' => $event->id,
                    'source_table' => 'events']);

                $sender=Student::find($event->responsible_first_id)->name;
                $receiver=Mentor::find($event->responsible_second_id)->name;

                Notification::create([
                    'text' => $sender.' has requested an extra lesson to '.$receiver,
                    'status' => 1,
                    'receiver_id' => 0,
                    'receiver_table' => 'teachers',
                    'source_id' => $event->id,
                    'source_table' => 'events']);

                $result_mail[0] = [
                    'receiver_id' => $event->responsible_second_id,
                    'receiver_table' => 'mentors',
                    'subject' => 'New extra lesson request',
                    'source_id' => $event->id,
                    'source_table' => 'events',
                    'type' => 'request_extra'
                ];
            } else {
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
                $mail1 = [
                    'receiver_id' => $event->responsible_first_id,
                    'receiver_table' => 'students',
                    'subject' => 'New extra lesson',
                    'source_id' => $event->id,
                    'source_table' => 'events',
                    'type' => 'decided_extra'
                ];
                $mail2 = [
                    'receiver_id' => $event->responsible_second_id,
                    'receiver_table' => 'mentors',
                    'subject' => 'New extra lesson',
                    'source_id' => $event->id,
                    'source_table' => 'events',
                    'type' => 'decided_extra'
                ];
                array_push($result_mail, $mail1, $mail2);
            }
            EmailController::send($result_mail);
        }
    }

    public function changeStatus(Request $request)
    {
        $result_mail = [];
        $event = Event::findOrFail($request['id']);
        $event->status = $request['status'];

        if ($event->type == 'lesson') {
            $event->responsible_first_id = $request['responsible_first_id'];
            $event->responsible_first_table = $request['responsible_first_table'];
        }

        $event->save();

        $sender=Student::find($event->responsible_first_id)->name;
        $receiver=Mentor::find($event->responsible_second_id)->name;
        
        if ($event->status == 1){
            Notification::where('source_table', 'events')->where('source_id', $event->id)->where('receiver_table','<>','teachers')->delete();
            
            Notification::create([
                'text' => $receiver.' has completed an extra lesson with '.$sender,
                'status' => 1,
                'receiver_id' => 0,
                'receiver_table' => 'teachers',
                'source_id' => $event->id,
                'source_table' => 'events']);
        }
            
        else if ($event->type == 'extra' && $event->status == 2) {
            Notification::where('source_table', 'events')->where('source_id', $event->id)->where('receiver_table','<>','teachers')->delete();

            if ($request['from'] == 'student') {
                Notification::create([
                    'text' => 'Extra lesson rejected',
                    'status' => 0,
                    'receiver_id' => $event->responsible_second_id,
                    'receiver_table' => 'mentors',
                    'source_id' => $event->id,
                    'source_table' => 'events']);

                Notification::create([
                    'text' => $sender.' has rejected an extra lesson from '.$receiver,
                    'status' => 1,
                    'receiver_id' => 0,
                    'receiver_table' => 'teachers',
                    'source_id' => $event->id,
                    'source_table' => 'events']);

                $result_mail[0] = [
                    'receiver_id' => $event->responsible_second_id,
                    'receiver_table' => 'mentors',
                    'subject' => 'Extra lesson rejected',
                    'source_id' => $event->id,
                    'source_table' => 'events',
                    'type' => 'rejected_extra'
                ];
            } else {
                Notification::create([
                    'text' => 'Extra lesson rejected',
                    'status' => 0,
                    'receiver_id' => $event->responsible_first_id,
                    'receiver_table' => 'students',
                    'source_id' => $event->id,
                    'source_table' => 'events']);

                Notification::create([
                    'text' => $receiver.' has rejected an extra lesson from '.$sender,
                    'status' => 1,
                    'receiver_id' => 0,
                    'receiver_table' => 'teachers',
                    'source_id' => $event->id,
                    'source_table' => 'events']);

                $result_mail[0] = [
                    'receiver_id' => $event->responsible_first_id,
                    'receiver_table' => 'students',
                    'subject' => 'New extra lesson rejected',
                    'source_id' => $event->id,
                    'source_table' => 'events',
                    'type' => 'rejected_extra'
                ];
            }
        }

        if ($event->type == 'extra' && $event->status == 0) {
            Notification::where('source_table', 'events')->where('source_id', $event->id)->where('receiver_table','<>','teachers')->delete();

            $sender=Student::find($event->responsible_first_id)->name;
            $receiver=Mentor::find($event->responsible_second_id)->name;

            if ($request['from'] == 'student') {
                Notification::create([
                    'text' => 'Extra lesson accepted',
                    'status' => 0,
                    'receiver_id' => $event->responsible_second_id,
                    'receiver_table' => 'mentors',
                    'source_id' => $event->id,
                    'source_table' => 'events']);

                Notification::create([
                    'text' => $sender.' has accepted an extra lesson from '.$receiver,
                    'status' => 1,
                    'receiver_id' => 0,
                    'receiver_table' => 'teachers',
                    'source_id' => $event->id,
                    'source_table' => 'events']);

                $result_mail[0] = [
                    'receiver_id' => $event->responsible_second_id,
                    'receiver_table' => 'mentors',
                    'subject' => 'New extra lesson accepted',
                    'source_id' => $event->id,
                    'source_table' => 'events',
                    'type' => 'accepted_extra'
                ];
            } else {
                Notification::create([
                    'text' => 'Extra lesson accepted',
                    'status' => 0,
                    'receiver_id' => $event->responsible_first_id,
                    'receiver_table' => 'students',
                    'source_id' => $event->id,
                    'source_table' => 'events']);

                Notification::create([
                    'text' => $receiver.' has accepted an extra lesson from '.$sender,
                    'status' => 1,
                    'receiver_id' => 0,
                    'receiver_table' => 'teachers',
                    'source_id' => $event->id,
                    'source_table' => 'events']);

                $result_mail[0] = [
                    'receiver_id' => $event->responsible_first_id,
                    'receiver_table' => 'students',
                    'subject' => 'New extra lesson decided',
                    'source_id' => $event->id,
                    'source_table' => 'events',
                    'type' => 'accepted_extra'
                ];
            }
        }
        EmailController::send($result_mail);
    }

    public function changeTime(Request $request)
    {
        $result_mail = [];
        $event = \App\Event::findOrFail($request['id']);
        Notification::where('source_table', 'events')->where('source_id', $event->id)->delete();
        $event->start_time = $request['startTime'];
        $event->end_time = $request['endTime'];
        if ($request['from'] == 'student') {
            Notification::create([
                'text' => 'Extra lesson time has changed',
                'status' => 0,
                'receiver_id' => $event->responsible_second_id,
                'receiver_table' => 'mentors',
                'source_id' => $event->id,
                'source_table' => 'events']);
            $result_mail[0] = [
                'receiver_id' => $event->responsible_second_id,
                'receiver_table' => 'mentors',
                'subject' => 'Extra lesson time has changed',
                'source_id' => $event->id,
                'source_table' => 'events',
                'type' => 'time_changed_extra'
            ];
        } else {
            Notification::create([
                'text' => 'Extra lesson time has changed',
                'status' => 0,
                'receiver_id' => $event->responsible_first_id,
                'receiver_table' => 'students',
                'source_id' => $event->id,
                'source_table' => 'events']);
            $result_mail[0] = [
                'receiver_id' => $event->responsible_first_id,
                'receiver_table' => 'students',
                'subject' => 'Extra lesson time has changed',
                'source_id' => $event->id,
                'source_table' => 'events',
                'type' => 'time_changed_extra'
            ];
        }
        $event->save();
        EmailController::send($result_mail);
    }

    public function update(Request $request)
    {
        $event = Event::findOrFail($request['id']);
        if ($event->type == 'extra') {
            if ($event->responsible_second_id != $request['responsible_second_id']) {
                $result_mail = [];
                $result_mail[0] = [
                    'receiver_id' => $event->responsible_second_id,
                    'receiver_table' => $event->responsible_second_table,
                    'subject' => 'Extra lesson cancelled',
                    'source_id' => $event->id,
                    'source_table' => 'events',
                    'type' => 'cancelled_extra'
                ];
                EmailController::send($result_mail);
                Notification::create([
                    'text' => 'New extra lesson',
                    'status' => 0,
                    'receiver_id' => $request['responsible_second_id'],
                    'receiver_table' => $request['responsible_second_table'],
                    'source_id' => $event->id,
                    'source_table' => 'decided_extra']);

                $sender=Student::find($event->responsible_first_id)->name;
                $receiver=Mentor::find($event->responsible_second_id)->name;
                $new_receiver=Mentor::find($request['responsible_second_id'])->name;

                Notification::create([
                    'text' => $sender.' has changed mentor - '.$receiver.' to '.$new_receiver,
                    'status' => 1,
                    'receiver_id' => 0,
                    'receiver_table' => 'teachers',
                    'source_id' => $event->id,
                    'source_table' => 'events']);
            }

            $event->update($request->all());
            $notifications = Notification::where('source_table', 'events')->where('source_id', $event->id)->get();

            $result_mail = [];

            if ($event->owner_table == 'students') {
                $mail = [
                    'receiver_id' => $event->responsible_second_id,
                    'receiver_table' => $event->responsible_second_table,
                    'subject' => 'Event updated',
                    'source_id' => $event->id,
                    'source_table' => 'events',
                    'type' => 'updated_extra'
                ];
                array_push($result_mail, $mail);
                foreach ($notifications as $notification) {
                    $notification->receiver_id=$event->responsible_second_id;
                    $notification->receiver_table=$event->responsible_second_table;
                    $notification->text = 'Extra lesson updated';
                    $notification->save();
                }
            } else if ($event->owner_table == 'teachers') {
                foreach ($notifications as $notification) {
                    $mail = [
                        'receiver_id' => $notification->receiver_id,
                        'receiver_table' => $notification->receiver_table,
                        'subject' => 'Event updated',
                        'source_id' => $event->id,
                        'source_table' => 'events',
                        'type' => 'updated_extra'
                    ];
                    array_push($result_mail, $mail);
                    $notification->text = 'Extra lesson updated';
                    $notification->save();
                }
            }
            EmailController::send($result_mail);
        } else if ($event->type == 'lesson') {
            $event->update($request->all());
            $notifications = Notification::where('source_table', 'events')->where('source_id', $event->id)->get();

            foreach ($notifications as $notification) {
                $notification->text = 'Lesson updated';
                $notification->save();
            }
        }
    }

    public function delete(Request $request)
    {
        $event = Event::findOrFail($request['id']);
        $notifications = Notification::where('source_table', 'events')->where('source_id', $event->id)->get();
        if ($event->type == 'extra') {
            $result_mail = [];

            if ($event->owner_table == 'students') {
                $mail = [
                    'receiver_id' => $event->responsible_second_id,
                    'receiver_table' => $event->responsible_second_table,
                    'subject' => 'Event deleted',
                    'source_id' => $event->id,
                    'source_table' => 'events',
                    'type' => 'deleted_extra'
                ];
                array_push($result_mail, $mail);
                foreach ($notifications as $notification) {
                    $notification->delete();
                }
            } else if ($event->owner_table == 'teachers') {
                foreach ($notifications as $notification) {
                    $mail = [
                        'receiver_id' => $notification->receiver_id,
                        'receiver_table' => $notification->receiver_table,
                        'subject' => 'Event deleted',
                        'source_id' => $event->id,
                        'source_table' => 'events',
                        'type' => 'deleted_extra'
                    ];
                    array_push($result_mail, $mail);
                    $notification->delete();
                }
            }
            EmailController::send($result_mail);
        } else if ($event->type == 'lesson') {
            $event->delete();
            foreach ($notifications as $notification) {
                $notification->delete();
            }
        }
        $event->delete();
    }
}
