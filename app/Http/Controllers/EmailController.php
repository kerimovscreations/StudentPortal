<?php
namespace App\Http\Controllers;

use App\Announcement;
use App\Event;
use App\Group;
use App\Student;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    public static function send(array $request)
    {
        foreach ($request as $elem) {
            if ($elem['type'] == 'success_register') {
                $receiver = User::findOrFail($elem['receiver_id']);

                $data = [
                    'receiver' => $receiver->name,
                ];

                Mail::send('emails.success_register', $data, function ($message) use ($receiver, $elem) {
                    $message->to($receiver->email, $receiver->name)->subject($elem['subject']);
                });
                return true;
            } else if ($elem['type'] == 'confirm') {
                $receiver = DB::table($elem['receiver_type'] . 's')->where('id', $elem['receiver_id'])->first();

                $data = [
                    'receiver' => $receiver->name,
                    'receiver_type' => $elem['receiver_type']
                ];

                Mail::send('emails.confirmation_email', $data, function ($message) use ($receiver, $elem) {
                    $message->to($receiver->email, $receiver->name)->subject($elem['subject']);
                });
                return true;
            }

            if ($elem['source_table'] == 'events') {
                $action_pre = '';
                $action_post = '';
                $person_name = '';

                $event = Event::find($elem['source_id']);

                $receiver = DB::table($elem['receiver_table'])->where('id', $elem['receiver_id'])->first();

                if ($elem['receiver_table'] == 'mentors')
                    $person_name = DB::table($event->responsible_first_table)->where('id', $event->responsible_first_id)->value('name');
                else if ($elem['receiver_table'] == 'students')
                    $person_name = DB::table($event->responsible_second_table)->where('id', $event->responsible_second_id)->value('name');

                switch ($elem['type']) {
                    case 'request_extra':
                        $action_post = 'has requested to you for an extra lesson on ';
                        break;
                    case 'decided_extra':
                        $action_pre = 'You have an extra lesson with ';
                        break;
                    case 'accepted_extra':
                        $action_post = 'accepted an extra lesson on ';
                        break;
                    case 'rejected_extra':
                        $action_post = 'rejected an extra lesson on ';
                        break;
                    case 'time_changed_extra':
                        $action_post = 'changed time of the extra lesson to ';
                        break;
                    case 'updated_extra':
                        $action_pre = 'Extra lesson has been updated by ';
                        $person_name = DB::table($event->owner_table)->where('id', $event->owner_id)->value('name');
                        $action_post = ' to ';
                        break;
                    case 'cancelled_extra':
                        $action_pre = 'Extra lesson has been cancelled by ';
                        $person_name = DB::table($event->owner_table)->where('id', $event->owner_id)->value('name');
                        $action_post = ' which would be held on ';
                        break;
                    case 'deleted_extra':
                        $action_pre = 'Extra lesson has been deleted by ';
                        $person_name = DB::table($event->owner_table)->where('id', $event->owner_id)->value('name');
                        $action_post = ' which would be held on ';
                        break;
                };

                $data = [
                    'receiver' => $receiver->name,
                    'person' => $person_name,
                    'action_pre' => $action_pre,
                    'action_post' => $action_post,
                    'date' => date("Y M d", strtotime($event->date)),
                    'start_time' => $event->start_time,
                    'end_time' => $event->end_time,
                    'description' => $event->description
                ];

                Mail::send('emails.notification_extra_lesson', $data, function ($message) use ($receiver, $elem) {
                    $message->to($receiver->email, $receiver->name)->subject($elem['subject']);
                });
            } else if ($elem['source_table'] == 'announcements') {
                $announcement = Announcement::find($elem['source_id']);
                $receiver = Group::find($elem['receiver_id']);
                $person_name = DB::table('teachers')->where('id', $announcement->owner_id)->value('name');
                $action_post = ' has made a new announcement:';

                $data = [
                    'receiver' => $receiver->name,
                    'person' => $person_name,
                    'action_post' => $action_post,
                    'description' => $announcement->body
                ];

                Mail::send('emails.notification_group_announcement', $data, function ($message) use ($receiver, $elem) {
                    $message->to($receiver->email, $receiver->name)->subject($elem['subject']);
                });
            }
        }
    }
}
