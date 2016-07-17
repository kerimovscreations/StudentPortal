<?php
namespace App\Http\Controllers;

use App\Announcement;
use App\Event;
use App\Group;
use App\Reservation;

use App\Teacher;
use App\User;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    public static function send(array $request)
    {
        foreach ($request as $elem) {
            if ($elem['type'] == 'teacher_registered') {
                $receiver = Teacher::findOrFail($elem['receiver_id']);

                $data = [
                    'receiver' => $receiver->name,
                    'registered_user' => $elem['registered_user']
                ];

                Mail::send('emails.teacher_registered', $data, function ($message) use ($receiver, $elem) {
                    $message->to($receiver->email, $receiver->name)->subject($elem['subject']);
                });
            }
            else if ($elem['type'] == 'success_register') {
                    $receiver = User::findOrFail($elem['receiver_id']);

                    $data = [
                        'receiver' => $receiver->name,
                    ];

                    Mail::send('emails.success_register', $data, function ($message) use ($receiver, $elem) {
                        $message->to($receiver->email, $receiver->name)->subject($elem['subject']);
                    });
                }
            else if ($elem['type'] == 'confirm') {
                    $receiver = DB::table($elem['receiver_type'] . 's')->where('id', $elem['receiver_id'])->first();

                    $data = [
                        'receiver' => $receiver->name,
                        'receiver_type' => $elem['receiver_type']
                    ];

                    Mail::send('emails.confirmation_email', $data, function ($message) use ($receiver, $elem) {
                        $message->to($receiver->email, $receiver->name)->subject($elem['subject']);
                    });
                }

            if(isset($elem['source_table'])){
                if ($elem['source_table'] == 'reservations') {
                    $action_pre = '';
                    $action_post = '';
                    $person_name = '';

                    $reservation = Reservation::findOrFail($elem['source_id']);

                    $receiver = DB::table($elem['receiver_table'])->where('id', $elem['receiver_id'])->first();

                    if ($elem['receiver_table'] == 'mentors')
                        $person_name = $reservation->student()->first()->name;
                    else if ($elem['receiver_table'] == 'students')
                        $person_name = $reservation->mentor()->first()->name;

                    switch ($elem['type']) {
                        case 'request_extra':
                            $action_post = 'has requested to you for a reservation on ';
                            break;
                        case 'decided_extra':
                            $action_pre = 'You have a reservation with ';
                            break;
                        case 'accepted_extra':
                            $action_post = 'accepted reservation on ';
                            break;
                        case 'rejected_extra':
                            $action_post = 'rejected reservation on ';
                            break;
                        case 'time_changed_extra':
                            $action_post = 'changed time of the reservation to ';
                            break;
                        case 'updated_extra':
                            $action_pre = 'Reservation has been updated by ';
                            $person_name = $reservation->student()->first()->name;
                            $action_post = ' to ';
                            break;
                        case 'cancelled_extra':
                            $action_pre = 'Reservation has been cancelled by ';
                            $person_name = $reservation->student()->first()->name;
                            $action_post = ' which would be held on ';
                            break;
                        case 'deleted_extra':
                            $action_pre = 'Reservation has been deleted by ';
                            $person_name = $reservation->student()->first()->name;
                            $action_post = ' which would be held on ';
                            break;
                    };

                    $data = [
                        'receiver' => $receiver->name,
                        'person' => $person_name,
                        'action_pre' => $action_pre,
                        'action_post' => $action_post,
                        'date' => date("Y M d", strtotime($reservation->date)),
                        'start_time' => $reservation->start_time,
                        'end_time' => $reservation->end_time,
                        'description' => $reservation->description
                    ];

                    Mail::send('emails.notification_extra_lesson', $data, function ($message) use ($receiver, $elem) {
                        $message->to($receiver->email, $receiver->name)->subject($elem['subject']);
                    });
                }
                else if ($elem['source_table'] == 'announcements') {
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
}
