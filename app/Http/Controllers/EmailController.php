<?php
namespace App\Http\Controllers;

use App\Event;
use App\Student;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    public static function send(array $request)
    {
        foreach ($request as $elem) {
            $action_pre = '';
            $action_post = '';
            $person_name='';

            $receiver = DB::table($elem['receiver_table'])->where('id', $elem['receiver_id'])->first();
            $event = Event::all()->find($elem['source_id']);
            if ($elem['receiver_table'] == 'mentors')
                $person_name = DB::table($event->responsible_first_table)->where('id', $event->responsible_first_id)->value('name');
            else if ($elem['receiver_table'] == 'students')
                $person_name = DB::table($event->responsible_second_table)->where('id', $event->responsible_second_id)->value('name');

            if ($elem['type'] == 'request_extra')
                $action_post = 'is requested to you for an extra lesson ';
            else if ($elem['type'] == 'decided_extra')
                $action_pre = 'You have an extra lesson with ';

            $data = [
                'receiver' => $receiver->name,
                'person' => $person_name,
                'action_pre' => $action_pre,
                'action_post' => $action_post,
                'date' => $event->date,
                'start_time' => $event->start_time,
                'end_time' => $event->end_time,
                'description' => $event->description
            ];

            Mail::send('emails.notification_extra_lesson', $data, function ($message) use ($receiver, $elem) {
                $message->to($receiver->email, $receiver->name)->subject($elem['subject']);
            });
        }
        return "Your email was successfully sent";
    }
}
